'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import CombinedVideoPlayer from './components/CombinedVideoPlayer';

interface WordResult {
  word: string;
  videos: {
    word: string;
    videoUrl: string;
    posterUrl: string;
    source: string;
  }[];
}

export default function Home() {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [results, setResults] = useState<WordResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchPhrase.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Split phrase into words
      const words = searchPhrase.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);
      
      if (words.length === 0) {
        throw new Error('No valid words found in phrase');
      }

      const wordResults: WordResult[] = [];

      // Fetch and parse each word (client-side to avoid 403)
      for (const word of words) {
        try {
          const url = `https://www.signbsl.com/sign/${encodeURIComponent(word)}`;
          
          // Fetch HTML from the browser (not blocked)
          const response = await fetch(url, {
            mode: 'cors',
            credentials: 'omit',
          });

          if (!response.ok) {
            console.warn(`Failed to fetch ${word}: ${response.status}`);
            continue;
          }

          const html = await response.text();
          
          // Parse HTML using DOMParser (works in browser)
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          // Find video elements
          const videoSources = doc.querySelectorAll('video source');
          
          if (videoSources.length > 0) {
            // Get first video
            const firstSource = videoSources[0] as HTMLSourceElement;
            const videoUrl = firstSource.getAttribute('src');
            const videoElement = firstSource.closest('video');
            const posterUrl = videoElement?.getAttribute('poster');

            if (videoUrl) {
              wordResults.push({
                word,
                videos: [{
                  word,
                  videoUrl,
                  posterUrl: posterUrl || '',
                  source: 'signbsl.com',
                }],
              });
            }
          } else {
            // Try meta tag fallback
            const metaVideo = doc.querySelector('meta[property="og:video"]');
            const metaPoster = doc.querySelector('meta[property="og:image"]');
            const videoUrl = metaVideo?.getAttribute('content');
            const posterUrl = metaPoster?.getAttribute('content');

            if (videoUrl) {
              wordResults.push({
                word,
                videos: [{
                  word,
                  videoUrl,
                  posterUrl: posterUrl || '',
                  source: 'signbsl.com',
                }],
              });
            }
          }
        } catch (err) {
          console.error(`Error fetching ${word}:`, err);
        }
      }

      setResults(wordResults);

      if (wordResults.length === 0) {
        setError('No videos found for the searched phrase. Please try different words.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            BSL Dictionary
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Search for British Sign Language videos
          </p>
        </div>

        {/* Search Bar - Centered */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchPhrase}
                onChange={(e) => setSearchPhrase(e.target.value)}
                placeholder="Enter a phrase (e.g., black hat, hello world)..."
                className="w-full px-6 py-5 pr-14 text-lg rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-lg"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !searchPhrase.trim()}
                className="absolute right-2 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl transition-colors disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </button>
            </div>
          </form>

          {/* Example searches */}
          <div className="mt-4 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Try searching:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['black hat', 'hello world', 'thank you'].map((example) => (
                <button
                  key={example}
                  onClick={() => setSearchPhrase(example)}
                  className="px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Searching for BSL videos...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Results for &quot;{searchPhrase}&quot;
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                {results.length} word{results.length !== 1 ? 's' : ''} combined into one video
              </p>
            </div>
            
            <CombinedVideoPlayer 
              videos={results.flatMap(result => result.videos)}
            />
          </div>
        )}

        {/* Initial State */}
        {!loading && !error && results.length === 0 && !searchPhrase && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
              Start Your Search
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
              Enter a phrase in the search bar above to find British Sign Language videos for each word.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
