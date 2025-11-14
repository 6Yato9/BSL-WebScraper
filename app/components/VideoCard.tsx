'use client';

import { VideoData } from '../api/scrape/route';

interface VideoCardProps {
  video: VideoData;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800">
        <video
          className="w-full h-full"
          controls
          poster={video.posterUrl}
          preload="metadata"
        >
          <source src={video.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="p-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {video.source}
        </p>
      </div>
    </div>
  );
}
