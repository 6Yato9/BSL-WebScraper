'use client';

import { VideoData } from '../api/scrape/route';
import VideoCard from './VideoCard';

interface WordSectionProps {
  word: string;
  videos: VideoData[];
}

export default function WordSection({ word, videos }: WordSectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 capitalize">
        {word}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <VideoCard key={`${video.word}-${index}`} video={video} />
        ))}
      </div>
    </div>
  );
}
