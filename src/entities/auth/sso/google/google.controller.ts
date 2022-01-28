import { SSOController, SSOTools, Token, User } from '../../../../types';
import { Request, Response } from 'express';
import SsoTool from '../../../../tools/sso.tool';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export default class GoogleController implements SSOController, SSOTools {
    private static clientId: string = process.env.GOOGLE_CLIENT_ID || '';
    private static clientSecret: string = process.env.GOOGLE_CLIENT_SECRET || '';
    private static callbackUrl: string = process.env.GOOGLE_CALLBACK_URL || '';
    private static redirectUrl: string = process.env.GOOGLE_REDIRECT_URL || '';
    private static scope: string = process.env.GOOGLE_SCOPE || '';
    private static state: string = process.env.GOOGLE_STATE || '';

    private static async fetchUser(token: string): Promise<User & any> {
        const res = await axios(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return await res.data;
    }

    private static async fetchToken(code: string): Promise<Token & any> {
        const body = {
            code: code,
            client_id: GoogleController.clientId,
            client_secret: GoogleController.clientSecret,
            redirect_uri: "https://auth.expo.io/@area1234/diversity_app", // change @ to your expo account, will be changed to ngrok
            grant_type: 'authorization_code',
        };

        const res = await axios(`https://www.googleapis.com/oauth2/v4/token?${new URLSearchParams(body).toString()}`, {
            method: 'POST',
        });
        return await res.data;
    }

    public static async getCode(req: Request, res: Response): Promise<void> {
        try {
            const params = {
                client_id: GoogleController.clientId,
                redirect_uri: GoogleController.redirectUrl,
                scope: GoogleController.scope,
                state: GoogleController.state,
                response_type: 'code',
                prompt: 'consent',
            };
            const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(params).toString()}`;
            res.redirect(url);
        } catch (e) {
            console.log(e);
            res.status(500).send({
                status: 'error',
                error: 'Internal server error',
            });
        }
    }

    public static async getToken(req: Request, res: Response): Promise<void> {
        try {
            const { code } = req.query;
            if (!code || typeof code !== 'string') {
                res.status(400).send({
                    status: 'error',
                    error: 'Bad request',
                });
                return;
            }

            const { user } = req.session;
            if (!user) {
                res.status(401).send({
                    status: 'error',
                    error: 'Unauthorized',
                });
                return;
            }
            const token = await GoogleController.fetchToken(code);
            console.log(token)

            const providerUser = await GoogleController.fetchUser(token.access_token);
            console.log(providerUser);

            await SsoTool.syncUserToken(user.id, providerUser.sub, 'Google', token);

            res.json({
                status: 'success',
                token: token.access_token,
            });
        } catch (e) {
            console.log(e);
            res.status(500).send({
                status: 'error',
                error: 'Internal server error',
            });
        }
    }
}
