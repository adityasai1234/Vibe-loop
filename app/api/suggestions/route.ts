import { NextRequest, NextResponse } from 'next/server';
import { storeSuggestion, getAllSuggestions, likeSuggestionById } from '@/lib/s3-service';

export async function POST(request: NextRequest) {
  try {
    const { artist, youtubeUrl } = await request.json();
    if (!artist || !youtubeUrl) {
      return NextResponse.json({ error: 'Missing artist or YouTube URL' }, { status: 400 });
    }
    await storeSuggestion({ artist, youtubeUrl });
    return NextResponse.json({ message: 'Suggestion stored successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to store suggestion' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const suggestions = await getAllSuggestions();
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing suggestion id' }, { status: 400 });
    }
    const updated = await likeSuggestionById(id);
    if (!updated) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
    }
    return NextResponse.json({ suggestion: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to like suggestion' }, { status: 500 });
  }
} 