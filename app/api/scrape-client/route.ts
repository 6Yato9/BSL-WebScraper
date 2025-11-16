import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * This endpoint returns just the URLs to fetch.
 * The client will fetch them using a CORS proxy.
 */
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

    // Return URLs for client to fetch
    const urls = words.map(word => ({
      word,
      url: `https://www.signbsl.com/sign/${encodeURIComponent(word)}`,
    }));

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
