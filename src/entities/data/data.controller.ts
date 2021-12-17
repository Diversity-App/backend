import { Request, Response } from 'express';
import SsoTool from '../../tools/sso.tool';
import { Token } from '../../types';
import YoutubeApiWrapper from '../../tools/youtube/api.tool';
import YoutubeStatsTool from '../../tools/youtube/stats.tool';
import StatsTool from '../../tools/stats.tool';

export default class DataController {
    static async getStats(req: Request, res: Response) {
        //get id from params
        try {
            const { user } = req.session;
            if (!user) {
                return res.redirect('/auth/login');
            }

            const youtubeToken: Token = await SsoTool.getProviderToken(user.id, 'Google');
            if (!youtubeToken) {
                return res.redirect('/auth/sso/google/login');
            }
            const stats = [
                YoutubeApiWrapper.getLikedPlaylist(youtubeToken.access_token),
                YoutubeApiWrapper.getUserHomepage(youtubeToken.access_token),
            ];
            const parsedStats = (await Promise.all(stats))
                .map(YoutubeStatsTool.parsePlaylistStats)
                .map(StatsTool.summarize);

            const summary = StatsTool.aggregate(parsedStats);

            res.status(200).json(summary);
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }

    static async getHomePage(req: Request, res: Response) {
        try {
            const { user } = req.session;
            if (!user) {
                return res.redirect('/auth/login');
            }

            const youtubeToken: Token = await SsoTool.getProviderToken(user.id, 'Google');
            if (!youtubeToken) {
                return res.redirect('/auth/sso/google/login');
            }
            const data = await YoutubeApiWrapper.getUserHomepage(youtubeToken.access_token);
            const stats = YoutubeStatsTool.parsePlaylistStats(data);
            const summary = StatsTool.summarize(stats);
            res.status(200).json(summary);
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }

    static async getLikedPlaylists(req: Request, res: Response) {
        try {
            const { user } = req.session;
            if (!user) {
                return res.redirect('/auth/login');
            }

            const youtubeToken: Token = await SsoTool.getProviderToken(user.id, 'Google');
            if (!youtubeToken) {
                return res.redirect('/auth/sso/google/login');
            }
            const data = await YoutubeApiWrapper.getLikedPlaylist(youtubeToken.access_token);
            const stats = YoutubeStatsTool.parsePlaylistStats(data);
            const summary = StatsTool.summarize(stats);
            res.status(200).json(summary);
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }
}
