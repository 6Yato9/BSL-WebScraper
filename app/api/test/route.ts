import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Test a simple fetch to signbsl.com
    const testUrl = 'https://www.signbsl.com/sign/black';
    
    console.log('[TEST] Attempting to fetch:', testUrl);
    
    const response = await fetch(testUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    
    console.log('[TEST] Response status:', response.status);
    console.log('[TEST] Response headers:', Object.fromEntries(response.headers.entries()));
    
    const html = await response.text();
    console.log('[TEST] HTML length:', html.length);
    console.log('[TEST] HTML preview:', html.substring(0, 1000));
    
    // Check if we can find video elements
    const hasVideoTag = html.includes('<video');
    const hasSourceTag = html.includes('<source');
    const hasMetaVideo = html.includes('og:video');
    
    return NextResponse.json({
      success: true,
      status: response.status,
      htmlLength: html.length,
      hasVideoTag,
      hasSourceTag,
      hasMetaVideo,
      htmlPreview: html.substring(0, 500),
    });
  } catch (error) {
    console.error('[TEST] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
