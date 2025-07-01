'use client'

import React, { useEffect, useState } from 'react';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDateKey(date: Date) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

export default function MoodCalendarPage() {
  const [moodLogs, setMoodLogs] = useState<{emoji: string, text: string, time: string}[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const res = await fetch('/api/mood-log');
        if (!res.ok) return;
        const data = await res.json();
        if (data.logs) setMoodLogs(data.logs);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  // Group moods by day
  const moodsByDay: Record<string, {emoji: string, text: string, time: string}[]> = {};
  moodLogs.forEach(log => {
    const dateKey = log.time ? new Date(log.time).toISOString().split('T')[0] : '';
    if (!moodsByDay[dateKey]) moodsByDay[dateKey] = [];
    moodsByDay[dateKey].push(log);
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // For calendar grid
  const calendarDays: (string | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <h1 className="text-3xl font-bold mb-6">Mood Calendar</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="grid grid-cols-7 gap-2 border rounded bg-background/80 p-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="font-semibold text-center text-muted-foreground">{day}</div>
            ))}
            {calendarDays.map((dateKey, idx) => {
              if (!dateKey) return <div key={idx} />;
              const moods = moodsByDay[dateKey] || [];
              const latestMood = moods[0];
              return (
                <button
                  key={dateKey}
                  className={`aspect-square w-full flex flex-col items-center justify-center rounded border ${selectedDay === dateKey ? 'bg-primary/20' : 'hover:bg-muted/40'} transition`}
                  onClick={() => setSelectedDay(dateKey)}
                >
                  <span className="font-bold">{Number(dateKey.split('-')[2])}</span>
                  <span className="text-2xl mt-1">{latestMood ? latestMood.emoji : '—'}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6">
            <div className="font-semibold mb-2">Legend:</div>
            <div className="flex gap-2 flex-wrap">
              <span>😊 Good</span>
              <span>😢 Sad</span>
              <span>😎 Cool</span>
              <span>😴 Tired</span>
              <span>🤩 Excited</span>
              <span>😡 Angry</span>
              <span>— No entry</span>
            </div>
          </div>
          {selectedDay && (
            <div className="mt-6 p-4 border rounded bg-background/80">
              <div className="font-semibold mb-2">Moods for {selectedDay}:</div>
              <ul className="space-y-1">
                {(moodsByDay[selectedDay] || []).map((entry, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-base">
                    <span>{entry.emoji}</span> {entry.text} <span className="text-xs text-muted-foreground">({entry.time})</span>
                  </li>
                ))}
              </ul>
              <button className="mt-2 text-sm text-primary underline" onClick={() => setSelectedDay(null)}>Close</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 