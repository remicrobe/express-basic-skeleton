import {AppDataSource} from "../datasource";
import {User} from "../entity/user.entity";
import {Equal} from "typeorm";
import {createHash, randomUUID} from "crypto";

export const UserRepository = AppDataSource.getRepository(User).extend({
    createUser(lastName: string, firstName: string, email: string, username: string, password: string, provider: string, isCompleted: boolean, isGuest: boolean = false) {
        let user = new User();
        user.lastName = lastName
        user.firstName = firstName
        user.email = email
        user.username = username
        user.password = password
        user.provider = provider
        user.isCompleted = isCompleted
        user.isGuest = isGuest
        return user;
    },
    async initSplitMaster() {
        let master = await UserRepository.findOneBy({
            username: Equal("splitMaster")
        })

        if (!master) {
            master = await UserRepository.save(UserRepository.createUser(
                'Master',
                'Split',
                'contact@split-app.fr',
                'splitMaster',
                createHash('sha256').update(process.env.MASTER_PASSWORD).digest('hex'),
                'split',
                true,
                false
            ))
            console.log("Split master créé !")
        }
    },
    async getSplitMaster() {
        return await UserRepository.findOneByOrFail({
            username: Equal("splitMaster")
        });
    },
    createGuest(name: string) {
        let uuid = randomUUID()
        return UserRepository.createUser(
            'Guest',
            name,
            uuid + '@split-app.fr',
            uuid,
            'Guest account',
            'Split',
            true,
            true
        );
    },
    async getRegisterUserClassique() {
        return UserRepository.count({
            where: {
                provider: Equal("split_api")
            }
        })
    },
    async getRegisterUserGoogle() {
        return UserRepository.count({
            where: {
                provider: Equal("google_account")
            }
        })
    },
    async getRegisterUserApple() {
        return UserRepository.count({
            where: {
                provider: Equal("apple_account")
            }
        })
    },
    async getTotalUsers() {
        return UserRepository.count({
            where: {
                isGuest: false
            }
        })
    },
    async getTotalGuests() {
        return UserRepository.count({
            where: {
                isGuest: true
            }
        })
    }

})
