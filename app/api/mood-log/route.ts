import { NextRequest, NextResponse } from "next/server";
import { storeMoodLog, getAllMoodLogs, getUserMoodLogs, hasUserLoggedForDate, getUserMoodLogForDate } from "@/lib/s3-service";
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // Get user ID from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = user.id;

    const { emoji, text, time } = await request.json();
    if (!emoji || !text || !time) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Extract date from time (YYYY-MM-DD format)
    const submittedDate = new Date(time);
    const submittedDateStr = submittedDate.toISOString().split('T')[0];

    // Get today's date in UTC (YYYY-MM-DD)
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Only allow logging for today
    if (submittedDateStr !== todayStr) {
      return NextResponse.json({
        error: "You can only log your mood for today. Logging for past or future days is not allowed.",
        invalidDate: true
      }, { status: 400 });
    }

    // Check if user has already logged for this date
    const alreadyLogged = await hasUserLoggedForDate(userId, todayStr);
    if (alreadyLogged) {
      return NextResponse.json({ 
        error: "You have already logged your mood for today. You can only log once per day.",
        alreadyLogged: true 
      }, { status: 400 });
    }

    // Store the mood log with user ID
    await storeMoodLog({ emoji, text, time, userId });
    return NextResponse.json({ message: "Mood log stored successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to store mood log" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user ID from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = user.id;

    // Get date parameter if provided
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (date) {
      // Get specific date's log for the user
      const logForDate = await getUserMoodLogForDate(userId, date);
      return NextResponse.json({ log: logForDate });
    } else {
      // Get all logs for the user
      const logs = await getUserMoodLogs(userId);
      return NextResponse.json({ logs });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch mood logs" }, { status: 500 });
  }
} 