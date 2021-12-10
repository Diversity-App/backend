import { Request, Response } from 'express';
import axios from 'axios';
import SsoTool from '../../tools/sso.tool';
import { Token, youtubeVideo } from '../../types';
import extractVideoProperties from '../../tools/youtube/extract.tool';

export default class DataController {
    static async getStats(req: Request, res: Response) {
        //get id from params
        const { id } = req.query;
        const { user } = req.session;
        if (!user) {
            return res.redirect('/auth/login');
        }

        const youtubeToken: Token = await SsoTool.getProviderToken(user.id, 'Google');
        if (!youtubeToken) {
            return res.redirect('/auth/sso/google/login');
        }
        if (typeof id != 'string')
            res.status(400).json("Invalid query. Expected id")
        const videoStats: youtubeVideo = await extractVideoProperties(id as string, youtubeToken);
        res.status(200).json(videoStats);
	}

    static async getHomePage(req: Request, res: Response) {
        const { user } = req.session;
        if (!user) {
            return res.redirect('/auth/login');
        }

        const youtubeToken = await SsoTool.getProviderToken(user.id, 'Google');
        if (!youtubeToken) {
            return res.redirect('/auth/sso/google/login');
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/activities', {
            params: {
                part: 'snippet,contentDetails,id',
                home: true,
                maxResults: 20,
            },
            headers: {
                Authorization: 'Bearer ' + youtubeToken.access_token,
            },
        });

        const { data } = response;
        const { items } = data;

        const videos = items.map((item: any) => {
            const { snippet, contentDetails, id } = item;
            const { channelTitle, title, description, thumbnails } = snippet;
            const { videoId } = contentDetails;
            const { url } = thumbnails.high;
            return {
                channelTitle,
                title,
                description,
                videoId,
                url,
                id,
            };
        });

        res.status(200).json(videos);
    }

    static async getLikes(req: Request, res: Response) {
        //const { user } = req.session;
        // if (!user) {
        //     return res.redirect('/auth/login');
        // }

        const youtubeToken: Token = await SsoTool.getProviderToken(1, 'Google');
        if (!youtubeToken) {
            return res.redirect('/auth/sso/google/login');
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet',
                myRating: 'like',
                maxResults: 100,
            },
            headers: {
                Authorization: 'Bearer ' + youtubeToken.access_token,
            },
        });

        const { data } = response;
        const { items } = data;

        res.status(200).json(data);
    }
}
