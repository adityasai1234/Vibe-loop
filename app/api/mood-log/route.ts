import { NextRequest, NextResponse } from "next/server";
import { storeMoodLog, getAllMoodLogs } from "@/lib/s3-service";

export async function POST(request: NextRequest) {
  try {
    const { emoji, text, time } = await request.json();
    if (!emoji || !text || !time) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await storeMoodLog({ emoji, text, time });
    return NextResponse.json({ message: "Mood log stored successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to store mood log" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const logs = await getAllMoodLogs();
    return NextResponse.json({ logs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch mood logs" }, { status: 500 });
  }
} 