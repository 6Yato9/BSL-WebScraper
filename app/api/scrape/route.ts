import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export interface VideoData {
  word: string;
  videoUrl: string;
  posterUrl: string;
  source: string;
}

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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${word}: ${response.status}`);
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

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
