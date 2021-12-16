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
    channelId: string;
    duration: string;
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
    favoriteCount: string;
    commentCount: string;
    tags: string[];
    category: string;
}

export type Tag = string;
export type Category = string;

export interface StatItem {
    source: string;
    // linkedUserId: number;
    // sourceId: string;
    title: string;
    description: string;
    tags: Array<Tag>;
    categories: Array<Category>;
    created_at: number;
    updated_at: number;
}

export interface StatSummary {
    items: Array<StatItem>;
    total: number;
    categories: Array<Category>;
    tags: Array<Tag>;
    tagsRatio: Array<{ name: string; count: number }>;
    categoriesRatio: Array<{ name: string; count: number }>;
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
    protected static fetchUser($token: string): Promise<User & any>;

    protected static fetchToken($code: string): Promise<Token & any>;
}

export abstract class SSOController {
    public static getCode($req: Request, $res: Response): Promise<void>;

    public static getToken($req: Request, $res: Response): Promise<void>;
}
