import * as dotenv from 'dotenv';
import { Client } from "basic-ftp"

dotenv.config()
import * as express from 'express'
import * as cors from 'cors'
import {AppDataSource} from "./database/datasource";
import {userRouter} from "./routes/user";
import {Server} from 'socket.io';
import * as http from "http";
import * as swaggerJsonFile from "./docs/swagger_output.json"
import * as basicAuth from 'express-basic-auth'
import {authRouter} from "./routes/auth";
import {initSocket} from "./utils/socket/initSocket";
import * as bodyParser from "body-parser"
import * as swStats from "swagger-stats";
import {UserRepository} from "./database/repository/user.repository";
import * as cron from 'node-cron';

export class Index {
    static jwtKey = process.env.JWT_SECRET;
    static app = express()
    static router = express.Router()
    static server = http.createServer(Index.app); // Créez un serveur HTTP à partir de votre application Express
    static io = new Server(Index.server, {cors: {origin: '*'}}); // Créez une instance de Socket.IO attachée à votre serveur HTTP

    static globalConfig() {
        Index.app.set('trust proxy', '127.0.0.1'); // Ready to trust you're nginx proxy :))
        Index.app.disable('x-powered-by');
        Index.app.use(cors())
        Index.app.use(bodyParser.json({ limit: '10mb' })); // Pour les données JSON
        Index.app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // Pour les données encodées dans l'URL
    }

    static jobsConfig() {
        cron.schedule('0 1 * * *', async () => {
            // Ready to handle jobs :)
        });
    }


    static routeConfig() {
        Index.app.use('/user', userRouter)
        Index.app.use('/auth', authRouter)
    }

    static swaggerConfig() {
        const swaggerUi = require('swagger-ui-express')
        Index.app.use('/docs', basicAuth({
            users: {'DOCUSERNAME': 'DOCPASSWORD'},
            challenge: true,
        }), swaggerUi.serve, swaggerUi.setup(swaggerJsonFile))
    }

    static statsConfig() {
        Index.app.use(swStats.getMiddleware({
            swaggerSpec:swaggerJsonFile,
            authentication: true,
            sessionMaxAge: 900,
            onAuthenticate: (req,username,password) => {
                // CAN INSERT REAL LOGIC HERE
                return((username==='swagger-splitstats') && (password==='swagger-splitpassword') );
            }
        }))
    }
    static imageFolder() {
        if (process.env.STORAGE_FOLDER) {
            Index.app.use("/image", express.static(process.env.STORAGE_FOLDER));
        } else {
            console.error("Can't store image, path not set.")
        }
    }

    static redirectConfig() {
        Index.app.use((req, res) => {
            res.redirect('https://you-re-website.fr');
        });
    }

    static socketConfig() {
        initSocket(this.io)
    }

    static async databaseConfig() {
        await AppDataSource.initialize().then(async () => {
            console.log("DB Connecté")
        });
    }

    static startServer() {
        Index.server.listen(process.env.PORT, () => {
            console.log(`API démarrée sur le port ${process.env.PORT}....`);
            Index.app.emit("ready");
        });
    }

    static async main() {
        Index.jobsConfig()
        Index.swaggerConfig()
        Index.statsConfig()
        Index.globalConfig()
        Index.routeConfig()
        Index.socketConfig()
        Index.imageFolder()
        Index.redirectConfig()
        await Index.databaseConfig()
        await UserRepository.initSplitMaster();
        Index.startServer()
    }

}

Index.main() 