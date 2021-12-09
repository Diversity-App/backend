import { Request, Response } from 'express';
import axios from 'axios';
import SsoTool from '../../tools/sso.tool';

export default class DataController {
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

        const youtubeToken = await SsoTool.getProviderToken(1, 'Google');
        if (!youtubeToken) {
            return res.redirect('/auth/sso/google/login');
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
            params: {
                part: 'contentDetails',
                mine: true,
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
            const { title, description, thumbnails } = snippet;
            const { relatedPlaylists } = contentDetails;
            const { url } = thumbnails.high;
            const { likes } = relatedPlaylists.likes;
            return {
                likes,
                title,
                description,
                thumbnails,
                url,
                id,
            };
        });

        res.status(200).json(videos);
    }
}
