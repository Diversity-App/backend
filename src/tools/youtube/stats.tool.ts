import { Playlist, Video } from './types';
import { StatItem } from '../../types';

export default class StatsTool {
    static parseVideoStats(video: Video): StatItem {
        if (!Array.isArray(video.tags)) throw 'Invalid video tags';
        // @ts-ignore
        const tags = video.tags.split(',');
        const categories = video.category.split(',');

        const stats = {
            source: 'youtube',
            title: video.title,
            tags: tags,
            categories: categories,
            description: video.description,
            created_at: Date.now(),
            updated_at: Date.now(),
        };
        return stats;
    }

    static parsePlaylistStats(playlist: Playlist): StatItem[] {
        const stats = playlist.videos.map((video: Video) => {
            return StatsTool.parseVideoStats(video);
        });
        return stats;
    }
}
