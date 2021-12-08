import { SSOController, SSOTools, Token, User } from '../../../../types';
import { Request, Response } from 'express';
import SsoTool from '../../../../tools/sso.tool';
import fetch from 'node-fetch';

export default class GoogleController implements SSOController, SSOTools {
    private static clientId: string = process.env.GOOGLE_CLIENT_ID || '';
    private static clientSecret: string = process.env.GOOGLE_CLIENT_SECRET || '';
    private static callbackUrl: string = process.env.GOOGLE_CALLBACK_URL || '';
    private static redirectUrl: string = process.env.GOOGLE_REDIRECT_URL || '';
    private static scope: string = process.env.GOOGLE_SCOPE || '';
    private static state: string = process.env.GOOGLE_STATE || '';

    private static async fetchUser(token: string): Promise<User & any> {
        const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        return res.json();
    }

    private static async fetchToken(code: string): Promise<Token & any> {
        const body = {
            code: code,
            client_id: GoogleController.clientId,
            client_secret: GoogleController.clientSecret,
            redirect_uri: GoogleController.callbackUrl,
            grant_type: 'authorization_code',
        };

        const res = await fetch('https://www.googleapis.com/oauth2/v4/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(body),
        });

        return res.json();
    }

    public static async getCode(req: Request, res: Response): Promise<void> {
        try {
            const params = {
                client_id: GoogleController.clientId,
                redirect_uri: GoogleController.redirectUrl,
                scope: GoogleController.scope,
                state: GoogleController.state,
                response_type: 'code',
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
            const { user } = req.session;
            if (!user) {
                res.status(401).send({
                    status: 'error',
                    error: 'Unauthorized',
                });
                return;
            }
            if (!code || typeof code !== 'string') {
                res.status(400).send({
                    status: 'error',
                    error: 'Bad request',
                });
                return;
            }
            const token = await GoogleController.fetchToken(code);
            const providerUser = await GoogleController.fetchUser(token.access_token);

            await SsoTool.syncUserToken(user.id, providerUser.id, 'Google', token);

            res.json({
                status: 'success',
                token: token.access_token,
                user: user,
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
