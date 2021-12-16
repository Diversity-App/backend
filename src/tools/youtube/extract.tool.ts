import axios from 'axios';
import { Token, youtubeVideo } from '../../types';

async function extractVideoProperties(videoId: string, youtubeToken: Token): Promise<youtubeVideo> {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
            part: 'snippet,contentDetails,statistics',
            id: videoId,
        },
        headers: {
            Authorization: 'Bearer ' + youtubeToken.access_token,
        },
    });

    const [video] = response.data.items;

    const videoInfo: youtubeVideo & any = {
        id: videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.default.url,
        publishedAt: video.snippet.publishedAt,
        channelTitle: video.snippet.channelTitle,
        duration: video.contentDetails.duration,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        tags: video.snippet.tags,
        category: video.snippet.category,
    };
    console.debug(`executed /stats api call on video id=${videoId} (${videoInfo.title})`);
    return videoInfo;
}

export default extractVideoProperties;
