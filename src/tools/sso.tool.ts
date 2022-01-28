import Pool from './database.tools';
import { Token } from '../types';

export default class SsoTool {
    static async findUser(client_id: string, provider: string) {
        const query = `
            SELECT
                uuid, username
            FROM
                "Users"
            WHERE id IN (
                SELECT 
                    user_id
                FROM
                    "SSO_Tokens"
                WHERE client_id = $1 AND provider_id IN (
                    SELECT 
                        id
                    FROM
                        "SSO_Providers"
                    WHERE name = $2
                )
                )`;
        const [user] = (await Pool.query(query, [client_id, provider])).rows;
        return user;
    }

    static async syncUserToken(userId: number, clientId: string, providerName: string, token: Token) {
        const query = `
        INSERT INTO "SSO_Tokens" (
            user_id,
            client_id,
            provider_id,
            access_token,
            refresh_token,
            expires_in
        ) VALUES (
            $1,
            $2,
            (SELECT id FROM "SSO_Providers" WHERE name = $3),
            $4,
            $5,
            $6
        ) ON CONFLICT (user_id, provider_id) DO UPDATE SET
            access_token = $4,
            refresh_token = $5,
            expires_in = $6,
            updated_at = NOW()`;

        await Pool.query(query, [
            userId,
            clientId,
            providerName,
            token.access_token,
            token.refresh_token,
            token.expires_in,
        ]);
    }

    static async getProviderToken(userId: number, provider: string) {
        const query = `
            SELECT
                access_token,
                refresh_token,
                expires_in
            FROM
                "SSO_Tokens"
            WHERE user_id = $1 AND provider_id IN (
                SELECT 
                    id
                FROM
                    "SSO_Providers"
                WHERE name = $2
            )`;
        const [token] = (await Pool.query(query, [userId, provider])).rows;
        return token;
    }
}
