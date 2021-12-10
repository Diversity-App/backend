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

        const response = await axios.get('https://www.googleapis.com/youtube/v2/channels', {
            params: {
                part: 'snippet,contentDetails,id',
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

    static async getLikedPlaylistsID(req: Request, res: Response) {
        const { user } = req.session;
        if (!user) {
            return res.redirect('/auth/login');
        }

        const youtubeToken = await SsoTool.getProviderToken(user.id, 'Google');
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
            const { contentDetails } = item;
            const { likes } = contentDetails.relatedPlaylists;
            return {
                likes,
            };
        });
        return videos;
    }

    static async getLikedPlaylists(req: Request, res: Response) {
        const playlistID = await DataController.getLikedPlaylistsID(req, res);

        const { user } = req.session;
        if (!user) {
            return res.redirect('/auth/login');
        }

        const youtubeToken = await SsoTool.getProviderToken(user.id, 'Google');
        if (!youtubeToken) {
            return res.redirect('/auth/sso/google/login');
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
            params: {
                part: 'snippet',
                playlistId: playlistID[0].likes,
                mine: true,
                maxResults: 20,
            },
            headers: {
                Authorization: 'Bearer ' + youtubeToken.access_token,
            },
        });

        // const { data } = response;
        // const { items } = data;

        // const videos = items.map((item: any) => {
        //     const { snippet, contentDetails } = item;
        //     const { likes } = contentDetails.relatedPlaylists;
        //     return {
        //         likes,
        //     };
        // });
        res.status(200).json(response.data.items);
    }
}
