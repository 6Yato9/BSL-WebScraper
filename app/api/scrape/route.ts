import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export interface VideoData {
  word: string;
  videoUrl: string;
  posterUrl: string;
  source: string;
}

export const runtime = 'nodejs'; // Required for cheerio
export const dynamic = 'force-dynamic'; // Disable caching
export const maxDuration = 60; // Maximum execution time in seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phrase = searchParams.get('phrase');

    if (!phrase) {
      return NextResponse.json(
        { error: 'Phrase parameter is required' },
        { status: 400 }
      );
    }

    // Split phrase into words and clean them
    const words = phrase
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);

    if (words.length === 0) {
      return NextResponse.json(
        { error: 'No valid words found in phrase' },
        { status: 400 }
      );
    }

    // Scrape each word
    const results: { word: string; videos: VideoData[] }[] = [];

    for (const word of words) {
      const url = `https://www.signbsl.com/sign/${encodeURIComponent(word)}`;
      console.log(`[DEBUG] Fetching URL for word "${word}":`, url);
      
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Referer': 'https://www.signbsl.com/',
          },
          cache: 'no-store',
        });

        console.log(`[DEBUG] Response status for "${word}":`, response.status, response.statusText);

        if (!response.ok) {
          console.error(`[ERROR] Failed to fetch ${word}: ${response.status} ${response.statusText}`);
          continue;
        }

        const html = await response.text();
        console.log(`[DEBUG] HTML length for "${word}":`, html.length);
        console.log(`[DEBUG] HTML preview for "${word}":`, html.substring(0, 500));
        
        const $ = cheerio.load(html);

        const videos: VideoData[] = [];

        // Find all video elements with multiple selector strategies
        console.log(`[DEBUG] Searching for videos in "${word}"...`);
        
        // Strategy 1: Look for video source elements
        const videoSources = $('video source');
        console.log(`[DEBUG] Found ${videoSources.length} video source elements`);
        
        videoSources.each((_, element) => {
          const videoUrl = $(element).attr('src');
          const posterUrl = $(element).parent().attr('poster');
          
          console.log(`[DEBUG] Video URL found:`, videoUrl);
          
          // Get the source info from the nearby text
          const videoContainer = $(element).closest('[itemprop="video"]');
          const sourceText = videoContainer.find('div[style*="float:left"] span[style*="color:#666"]').first().text().trim();

          if (videoUrl) {
            videos.push({
              word,
              videoUrl,
              posterUrl: posterUrl || '',
              source: sourceText || 'Unknown Source',
            });
          }
        });

        // Strategy 2: Look for direct video URLs in meta tags
        if (videos.length === 0) {
          console.log(`[DEBUG] Trying meta tag strategy for "${word}"...`);
          const metaVideoUrl = $('meta[property="og:video"]').attr('content');
          const metaPosterUrl = $('meta[property="og:image"]').attr('content');
          
          if (metaVideoUrl) {
            console.log(`[DEBUG] Found video in meta tag:`, metaVideoUrl);
            videos.push({
              word,
              videoUrl: metaVideoUrl,
              posterUrl: metaPosterUrl || '',
              source: 'signbsl.com',
            });
          }
        }

        console.log(`[DEBUG] Total videos found for "${word}":`, videos.length);

        if (videos.length > 0) {
          // Only include the first video for each word
          results.push({ word, videos: [videos[0]] });
          console.log(`[DEBUG] Added video for "${word}":`, videos[0].videoUrl);
        } else {
          console.warn(`[WARN] No videos found for "${word}"`);
        }
      } catch (error) {
        console.error(`[ERROR] Error scraping word "${word}":`, error);
        if (error instanceof Error) {
          console.error(`[ERROR] Error message:`, error.message);
          console.error(`[ERROR] Error stack:`, error.stack);
        }
      }
    }

    console.log(`[DEBUG] Final results:`, JSON.stringify(results, null, 2));
    console.log(`[DEBUG] Total words processed:`, words.length);
    console.log(`[DEBUG] Total words with videos:`, results.length);
    
    const response = NextResponse.json({ results });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    console.error('Server error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error details:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
