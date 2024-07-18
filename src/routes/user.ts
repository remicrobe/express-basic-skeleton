import express = require("express");
import { User } from "../database/entity/user.entity";
import {checkRequiredField, statusMsg} from "../utils/global";
import { createHash } from "crypto";
import { Equal } from "typeorm";
import { ErrorHandler } from "../utils/error/error-handler";
import { UserRepository } from "../database/repository/user.repository";
import {verifyJwt} from "../utils/jwt/verify";
import {generateJwt} from "../utils/jwt/generate";
import {ColumnImageTransformer} from "../database/transformer/ColumnImageTransformer";
import {base64tojpeg} from "../utils/image/base64tojpeg";
import {rateLimiterMiddleware} from "../middlewares/rateLimiter";
import {deleteImage} from "../storage/deleteImage";
import {apiTokenMiddleware} from "../middlewares/checkApiToken";

const userRouter = express.Router();

userRouter.get('/me', apiTokenMiddleware, async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.path = '/user/me'
        #swagger.method = 'get'
        #swagger.description = 'Get all information of the connected user.'
        #swagger.responses[200] = {
            description: 'User information retrieved successfully.',
            schema: {
                $ref: '#/definitions/User'
            }
        }
        #swagger.responses[401] = {
            description: 'Unauthorized. No valid token provided.',
            schema: {
                status: 401,
                msg: 'Unauthorized.'
            }
        }
    */

    try {
        let user: User = res.locals.connectedUser;

        return res.send(user);
    } catch (e) {
        return ErrorHandler(e, req, res);
    }
});

userRouter.delete('/', apiTokenMiddleware, async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.path = '/user/'
        #swagger.method = 'delete'
        #swagger.description = 'Delete an User.'
        #swagger.responses[200] = {
            description: 'User information deleted successfully.',
            schema: {
                msg: '',
                status: 200
            }
        }
        #swagger.responses[401] = {
            description: 'Unauthorized. No valid token provided.',
            schema: {
                status: 401,
                msg: 'Unauthorized.'
            }
        }
    */

    try {
        let user: User = res.locals.connectedUser;

        user.deletedAt = new Date();
        user.isDeleted = true;

        await UserRepository.save(user);

        return res.send(statusMsg(200, 'User bien supprimé'));
    } catch (e) {
        return ErrorHandler(e, req, res);
    }
});

userRouter.post('/register', rateLimiterMiddleware(60 * 15, 5), async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.path = '/user/register'
        #swagger.description = 'Register a new user.'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'User registration data',
            required: true,
            schema: {
                $ref: '#/definitions/User'
            }
        }
    */

    try {
        let { email, firstName, lastName, password, username, image } = req.body;

        if (!checkRequiredField([
            { type: 'mail', object: email },
            { type: 'password', object: password },
            { type: 'name', object: firstName },
            { type: 'name', object: lastName },
            { type: 'username', object: username },
        ])) {
            return res.sendStatus(422);
        }

        let user = UserRepository.createUser(
            lastName,
            firstName,
            email,
            username,
            createHash('sha256').update(password).digest('hex'),
            "split_api",
            true,
            false
        )

        if (image) {
            user.imageLink = await base64tojpeg(image, {height: 400, width: 400})
        }

        let createdUser = await UserRepository.save(user);

        if (image) {
            if (user.imageLink) {
                await deleteImage(user.imageLink)
            }
            user.imageLink = new ColumnImageTransformer().from(user.imageLink)
        }

        return res.send({
            ...createdUser,
            token: generateJwt("token", createdUser.id),
            refreshToken: generateJwt("refreshToken", createdUser.id)
        });
    } catch (e) {
        return ErrorHandler(e, req, res);
    }
});

userRouter.put('/update', apiTokenMiddleware, async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.path = '/user/update'
        #swagger.description = 'Update user details.'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'User update data',
            required: true,
            schema: {
                $ref: '#/definitions/User'
            }
        }
        #swagger.responses[200] = {
            description: 'User updated successfully.',
            schema: {
                $ref: '#/definitions/User'
            }
        }
        #swagger.responses[404] = {
            description: 'User not found.',
            schema: {
                status: 404,
                msg: 'User not found.'
            }
        }
        #swagger.responses[422] = {
            description: 'Unprocessable entity.',
            schema: {
                status: 422,
                msg: 'Required fields missing.'
            }
        }
    */

    try {
        let { email, firstName, lastName, password, username, image } = req.body;
        let user: User = res.locals.connectedUser;

        if (username && checkRequiredField([{ type: 'username', object: username }])) user.username = username;
        if (email && checkRequiredField([{ type: 'mail', object: email }])) user.email = email;
        if (password && checkRequiredField([{ type: 'password', object: password }])) user.password = createHash('sha256').update(password).digest('hex');
        if (image) {
            user.imageLink = await base64tojpeg(image, {height: 400, width: 400})
        }

        let updatedUser = await UserRepository.save(user);

        if (image) {
            user.imageLink = new ColumnImageTransformer().from(user.imageLink)
        }

        return res.send(updatedUser);
    } catch (e) {
        return ErrorHandler(e, req, res);
    }
});

userRouter.delete('/image', apiTokenMiddleware, async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.path = '/user/image'
        #swagger.description = 'Delete user image.'
        #swagger.responses[200] = {
            description: 'User updated successfully.',
            schema: {
                  $ref: '#/definitions/User'
            }
        }
        #swagger.responses[404] = {
            description: 'User not found.',
            schema: {
                status: 404,
                msg: 'User not found.'
            }
        }
        #swagger.responses[422] = {
            description: 'Unprocessable entity.',
            schema: {
                status: 422,
                msg: 'Required fields missing.'
            }
        }
    */

    try {
        let user: User = res.locals.connectedUser;

        if (user.imageLink) {
            await deleteImage(user.imageLink)
            user.imageLink = null
            user = await UserRepository.save(user);
        }

        return res.send(user);
    } catch (e) {
        return ErrorHandler(e, req, res);
    }
});


userRouter.get('/check/username/:username', async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.path = '/user/check/username/{username}'
        #swagger.description = 'Check if username already use.'
        #swagger.parameters['username'] = {
            in: 'path',
            description: 'username to check',
            required: true,
            type: 'string'
        }
    */

    try {
        let { username } = req.params;

        let user = await UserRepository.findOneBy({username})

        return res.send(!!user);
    } catch (e) {
        return ErrorHandler(e, req, res);
    }
});

userRouter.post('/login', async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.description = 'User login.'
        #swagger.path = '/user/login'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'User login data',
            required: true,
            schema: {
                email: 'user@example.com',
                password: 'Password123'
            }
        }
        #swagger.responses[200] = {
            description: 'User login successful.',
            schema: {
                $ref: '#/definitions/User'
            }
        }
    */

    try {
        let { email, password } = req.body;

        if (!checkRequiredField([{ type: 'email', object: email }, password])) {
            return res.sendStatus(422);
        }

        let connectedUser = await UserRepository.findOneOrFail({
            where: {
                email: Equal(email),
                password: Equal(createHash('sha256').update(password).digest('hex')),
                isDeleted: Equal(false)
            }
        });

        return res.send({
            ...connectedUser,
            token: generateJwt("token", connectedUser.id),
            refreshToken: generateJwt("refreshToken", connectedUser.id)
        });
    } catch (e) {
        return ErrorHandler(e, req, res);
    }
});

userRouter.get('/refresh-token/:refreshToken', async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.description = 'Refresh user token.'
        #swagger.path = '/user/refresh-token/{refreshToken}'
        #swagger.parameters['refreshToken'] = {
            in: 'path',
            description: 'Refresh token',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'User token refreshed successfully.',
            schema: {
                $ref: '#/definitions/User'
            }
        }
        #swagger.responses[401] = {
            description: 'Unauthorized. No valid token provided.',
            schema: {
                status: 401,
                msg: 'Aucun token valide trouvé.'
            }
        }
    */

    try {
        let { refreshToken } = req.params;

        if (!refreshToken) {
            return res.sendStatus(422);
        }

        let checkToken = verifyJwt('refreshToken', refreshToken)

        if (!checkToken) {
            return res.status(401).send(statusMsg(401, 'Aucun token valide trouvé'))
        }

        let collab = await UserRepository.findOneByOrFail({
            id: Equal(checkToken),
            isDeleted: Equal(false)
        });

        return res.send({
            ...collab,
            token: generateJwt("token", collab.id),
            refreshToken: generateJwt("refreshToken", collab.id)
        });
    } catch (e) {
        return ErrorHandler(e, req, res);
    }
});

export { userRouter }
