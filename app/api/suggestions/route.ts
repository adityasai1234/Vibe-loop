import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for suggestions (replace with DB in production)
let suggestions: Array<{ artist: string; youtubeUrl: string; timestamp: string }> = [];

export async function GET() {
  return NextResponse.json(suggestions);
}

export async function POST(req: NextRequest) {
  try {
    const { artist, youtubeUrl } = await req.json();
    if (!artist && !youtubeUrl) {
      return NextResponse.json({ error: 'Artist or YouTube URL required.' }, { status: 400 });
    }
    const suggestion = {
      artist: artist || '',
      youtubeUrl: youtubeUrl || '',
      timestamp: new Date().toISOString(),
    };
    suggestions.push(suggestion);
    return NextResponse.json(suggestion, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
} 