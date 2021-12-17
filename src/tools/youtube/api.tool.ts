import { Playlist, PlaylistVideo, Video } from './types';
import axios from 'axios';

export default class YoutubeApiWrapper {
    static async getUserPlaylists(userId: number, token: string): Promise<Playlist[]> {
        const params = {
            part: 'snippet',
            mine: true,
            maxResults: 50,
            parts: 'snippet',
            key: token,
        };
        const url = `https://www.googleapis.com/youtube/v3/playlists`;
        const response = await axios({
            params,
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const videos: PlaylistVideo[] = response.data.items.map((item: any) => {
            return {
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.default.url,
                publishedAt: item.snippet.publishedAt,
                channelId: item.snippet.channelId,
                channelTitle: item.snippet.channelTitle,
                playlistId: item.id,
            };
        });

        // group videos by playlistId
        const groupedVideos: PlaylistVideo[] = videos.reduce((acc: any, video: any) => {
            if (!acc[video.playlistId]) {
                acc[video.playlistId] = [];
            }
            acc[video.playlistId].push(video);
            return acc;
        }, {});

        // group videos by playlistId
        return Object.keys(groupedVideos).map((key: string) => {
            const playlist = response.data.items.find((item: any) => item.id === key);
            return {
                id: playlist.id,
                playlistTitle: playlist.snippet.title,
                description: playlist.snippet.description,
                thumbnail: playlist.snippet.thumbnails.default.url,
                publishedAt: playlist.snippet.publishedAt,
                channelId: playlist.snippet.channelId,
                channelTitle: playlist.snippet.channelTitle,
                // @ts-ignore
                videos: groupedVideos[key],
            };
        });
    }

    static async getPlaylistItems(playlistId: string, token: string): Promise<PlaylistVideo[]> {
        console.log('[YoutubeApiWrapper] getPlaylistItems', playlistId);
        const params = {
            part: 'snippet,contentDetails,status,id',
            maxResults: 50,
            playlistId,
            key: token,
        };

        const url = `https://www.googleapis.com/youtube/v3/playlistItems`;
        const response = await axios({
            params,
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return await Promise.all(
            response.data.items.map((item: any) => YoutubeApiWrapper.getVideoInfo(item.contentDetails.videoId, token)),
        );
    }

    static async getUserHomepage(token: string): Promise<Playlist> {
        console.log('[YoutubeApiWrapper] getUserHomepage');
        const params = {
            part: 'snippet',
            mine: true,
            maxResults: 50,
            parts: 'snippet,contentDetails,status,player,statistics,topicDetails',
            key: token,
        };
        const url = `https://www.googleapis.com/youtube/v3/playlists`;
        const response = await axios({
            params,
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        // parse response into playlist object

        const videos: PlaylistVideo[] = await Promise.all(
            response.data.items.map(async (item: any) => await YoutubeApiWrapper.getPlaylistItems(item.id, token)),
        );

        const playlist = response.data.items.find((item: any) => item.id === response.data.items[0].id);
        return {
            id: playlist.id,
            playlistTitle: playlist.snippet.title,
            description: playlist.snippet.description,
            thumbnail: playlist.snippet.thumbnails.default.url,
            videos: videos.flat(1).filter((video: any) => video),
        };
    }

    static async getCategoryName(categoryId: string, token: string) {
        console.log('[YoutubeApiWrapper] getCategoryName', categoryId);
        const params = {
            part: 'snippet',
            id: categoryId,
            key: token,
        };
        const url = `https://www.googleapis.com/youtube/v3/videoCategories`;
        const response = await axios({
            params,
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.items[0].snippet.title;
    }

    static async getVideoInfo(videoId: string, token: string): Promise<Video> {
        console.log('[YoutubeApiWrapper] getVideoInfo', videoId);
        const params = {
            part: 'snippet,contentDetails',
            id: videoId,
            parts: 'snippet',
            key: token,
        };
        const url = `https://www.googleapis.com/youtube/v3/videos?${new URLSearchParams(params)}`;
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data.items.length) {
            return null;
            // throw new Error('Video not found or is not available');
        }

        const categoryName = await YoutubeApiWrapper.getCategoryName(response.data.items[0].snippet.categoryId, token);

        return {
            id: response.data.items[0].id,
            title: response.data.items[0].snippet.title,
            description: response.data.items[0].snippet.description,
            thumbnail: response.data.items[0].snippet.thumbnails.default.url,
            tags: response.data.items[0].snippet.tags,
            channelId: response.data.items[0].snippet.channelId,
            channel: response.data.items[0].snippet.channelTitle,
            duration: response.data.items[0].contentDetails.duration,
            category: categoryName,
        };
    }

    static async getLikedPlaylist(token: string): Promise<Playlist> {
        const params = {
            myRating: 'like',
            maxResults: 50,
            part: 'snippet,contentDetails',
            key: token,
        };
        const url = `https://www.googleapis.com/youtube/v3/videos`;
        const response = await axios({
            params,
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        // parse response into playlist object
        const videos: PlaylistVideo[] = await Promise.all(
            response.data.items.map(async (item: any) => await YoutubeApiWrapper.getPlaylistItems(item.id, token)),
        );

        const playlist = response.data.items.find((item: any) => item.id === response.data.items[0].id);
        return {
            id: playlist.id,
            playlistTitle: playlist.snippet.title,
            description: playlist.snippet.description,
            thumbnail: playlist.snippet.thumbnails.default.url,
            videos: videos,
        };
    }
}
