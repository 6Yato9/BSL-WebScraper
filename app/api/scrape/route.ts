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
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${word}: ${response.status} ${response.statusText}`);
          continue;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const videos: VideoData[] = [];

        // Find all video elements
        $('video source').each((_, element) => {
          const videoUrl = $(element).attr('src');
          const posterUrl = $(element).parent().attr('poster');
          
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

        if (videos.length > 0) {
          // Only include the first video for each word
          results.push({ word, videos: [videos[0]] });
        }
      } catch (error) {
        console.error(`Error scraping word "${word}":`, error);
      }
    }

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
