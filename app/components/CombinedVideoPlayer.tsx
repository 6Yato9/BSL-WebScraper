'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface Video {
  word: string;
  videoUrl: string;
  posterUrl: string;
  source: string;
}

interface CombinedVideoPlayerProps {
  videos: Video[];
}

export default function CombinedVideoPlayer({ videos }: CombinedVideoPlayerProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videos[currentVideoIndex];

  useEffect(() => {
    // Reset to first video when videos change
    setCurrentVideoIndex(0);
    setIsPlaying(false);
  }, [videos]);

  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      // Move to next video
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsPlaying(true);
    } else {
      // All videos finished
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    setCurrentVideoIndex(0);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play();
    }
  }, [currentVideoIndex, isPlaying]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Video Display */}
        <div className="relative aspect-video bg-zinc-900">
          <video
            ref={videoRef}
            key={currentVideo.videoUrl}
            className="w-full h-full"
            poster={currentVideo.posterUrl}
            onEnded={handleVideoEnd}
            muted={isMuted}
          >
            <source src={currentVideo.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Current Word Overlay */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-white font-semibold text-lg capitalize">
              {currentVideo.word}
            </p>
            <p className="text-zinc-300 text-sm">
              {currentVideoIndex + 1} of {videos.length}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 capitalize">
                {currentVideo.word}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {currentVideo.source}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    index < currentVideoIndex
                      ? 'bg-green-500'
                      : index === currentVideoIndex
                      ? 'bg-blue-500'
                      : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              {videos.map((video, index) => (
                <span key={index} className="capitalize">
                  {video.word}
                </span>
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRestart}
              className="p-3 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={handleMuteToggle}
              className="p-3 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
