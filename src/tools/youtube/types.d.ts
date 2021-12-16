export interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: number;
    tags: string[];
    channel: string;
    channelId: string;
    category: string;
}

export interface Playlist {
    id: string;
    playlistTitle: string;
    description: string;
    thumbnail: string;
    videos: Video[];
}

export interface PlaylistItem {
    playlistId: string;
    videoId: string;
}

export type PlaylistVideo = Video & PlaylistItem;
