import { Request, Response } from 'express';

export interface Token {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export interface youtubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
    channelTitle: string;
    tags: Array<string>
    duration: string;
    category: number,
    viewCount: number;
    likeCount: number;    
}

export interface User {
    id: number;
    uuid: string;
    name: string;
    username: string;
    created_at: string;
    updated_at: string;
}

export abstract class SSOTools {
    protected static async fetchUser($token: string): Promise<User & any>;

    protected static async fetchToken($code: string): Promise<Token>;
}

export abstract class SSOController {
    public static async getCode($req: Request, $res: Response): Promise<void>;

    public static async getToken($req: Request, $res: Response): Promise<void>;
}
