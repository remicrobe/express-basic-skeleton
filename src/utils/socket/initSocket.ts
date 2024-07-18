import {Server} from "socket.io";
import {verifyJwt} from "../jwt/verify";

export function initSocket(io: Server) {
    io.on('connection', async (socket) => {
        const { token } = socket.handshake.query;

        if (!token) {
            socket.disconnect();
        } else {
            let socketUser = verifyJwt("token", token)

            if (socketUser) {
                socket.to(socketUser.toString()).disconnectSockets()
                // 1 user = 1 socket, on veut pas surchargé avec plusieurs connexions par user
                socket.join(socketUser.toString())
            } else {
                socket.disconnect();
            }
        }
    });
}