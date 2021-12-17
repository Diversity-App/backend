import { Playlist, Video } from './types';
import { StatItem } from '../../types';

export default class StatsTool {
    static parseVideoStats(video: Video): StatItem {
        const categories = video.category.split(',');
        const tags = video.tags
            ? video.tags.reduce((acc, tag) => {
                  return [...acc, ...tag.split(' ').map((t) => t.trim().toLowerCase())];
              }, [])
            : [];

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
