import { checkPassword, generateToken, hashPassword } from '../../tools/auth.tools';
import { Request, Response } from 'express';
import Pool from '../../tools/database.tools';

export default class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            const query = `INSERT INTO "Users" (username, password) VALUES($1, $2);`;

            await Pool.query(query, [username, hashPassword(password)]);

            res.status(201).json({
                status: 'success',
                message: 'User created successfully',
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                status: 'error',
                message: 'Error registering user',
            });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            const query = `SELECT * FROM "Users" WHERE username = $1;`;

            const [user] = (await Pool.query(query, [username])).rows;

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found',
                });
            }

            if (!checkPassword(password, user.password)) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Password does not match',
                });
            }

            const token = generateToken(user);

            delete user.password;

            res.status(200)
                .cookie('API_TOKEN', token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                })
                .json({
                    status: 'success',
                    data: {
                        token,
                        user,
                    },
                });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                status: 'error',
                message: 'Error logging in user',
            });
        }
    }
}
