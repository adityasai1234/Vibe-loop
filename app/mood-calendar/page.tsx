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
      <div className="w-full max-w-2xl mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <span className="text-lg">💡</span>
          <span className="text-sm">
            <strong>Daily Limit:</strong> You can only log your mood once per day, and only for today. Click on any logged date to view your previous entries.
          </span>
        </div>
      </div>
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
              const hasLogged = moods.length > 0;
              const isToday = dateKey === new Date().toISOString().split('T')[0];
              
              return (
                <div
                  key={dateKey}
                  className={`aspect-square w-full flex flex-col items-center justify-center rounded border transition relative ${
                    selectedDay === dateKey 
                      ? 'bg-primary/20 border-primary' 
                      : hasLogged 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-800/30 cursor-pointer' 
                        : 'bg-muted/20'
                  } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                  onClick={hasLogged ? () => setSelectedDay(dateKey) : undefined}
                >
                  <span className="font-bold">{Number(dateKey.split('-')[2])}</span>
                  <span className="text-2xl mt-1">{latestMood ? latestMood.emoji : '—'}</span>
                  {hasLogged && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                  {isToday && !hasLogged && (
                    <button
                      className="mt-2 px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/80 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDay(dateKey);
                      }}
                    >
                      Log Mood
                    </button>
                  )}
                  {isToday && hasLogged && (
                    <button
                      className="mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDay(dateKey);
                      }}
                    >
                      View Log
                    </button>
                  )}
                  {hasLogged && !isToday && (
                    <div className="mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded opacity-75">
                      View Log
                    </div>
                  )}
                </div>
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
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Logged
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full ring-2 ring-blue-400"></div>
                Today (can log or view)
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Logged dates (click to view)
              </span>
            </div>
          </div>
          {selectedDay && (
            <div className="mt-6 p-4 border rounded bg-background/80">
              <div className="font-semibold mb-2">
                {selectedDay === new Date().toISOString().split('T')[0] ? 'Today\'s Mood' : `Mood for ${selectedDay}`}:
              </div>
              <ul className="space-y-1">
                {(moodsByDay[selectedDay] || []).map((entry, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-base">
                    <span>{entry.emoji}</span> {entry.text} <span className="text-xs text-muted-foreground">({entry.time})</span>
                  </li>
                ))}
              </ul>
              {selectedDay === new Date().toISOString().split('T')[0] && (
                <MoodJournalForm selectedDay={selectedDay} onEntryAdded={() => {
                  (async () => {
                    setLoading(true);
                    try {
                      const res = await fetch('/api/mood-log');
                      if (!res.ok) return;
                      const data = await res.json();
                      if (data.logs) setMoodLogs(data.logs);
                    } finally {
                      setLoading(false);
                    }
                  })();
                }} />
              )}
              {selectedDay !== new Date().toISOString().split('T')[0] && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded text-blue-800 dark:text-blue-200 text-sm">
                  📅 This is a previous mood log. You can only log new entries for today.
                </div>
              )}
              <button className="mt-2 text-sm text-primary underline" onClick={() => setSelectedDay(null)}>Close</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MoodJournalForm({ selectedDay, onEntryAdded }: { selectedDay: string, onEntryAdded: () => void }) {
  const [emoji, setEmoji] = useState('😊');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [existingLog, setExistingLog] = useState<{emoji: string, text: string, time: string} | null>(null);
  const emojis = ['😊', '😢', '😎', '😴', '🤩', '😡'];

  // Check if user has already logged for this day
  useEffect(() => {
    async function checkExistingLog() {
      try {
        const res = await fetch(`/api/mood-log?date=${selectedDay}`);
        if (res.ok) {
          const data = await res.json();
          if (data.log) {
            setExistingLog(data.log);
          }
        }
      } catch (error) {
        console.error('Error checking existing log:', error);
      }
    }
    checkExistingLog();
  }, [selectedDay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const time = selectedDay + 'T12:00:00Z'; // Save as noon UTC for the day
      const res = await fetch('/api/mood-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, text, time }),
      });
      
      if (res.ok) {
        setText('');
        setExistingLog({ emoji, text, time });
        onEntryAdded();
      } else {
        const data = await res.json();
        if (data.alreadyLogged) {
          setError('You have already logged your mood for this day. You can only log once per day.');
        } else if (data.invalidDate) {
          setError('You can only log your mood for today. Logging for past or future days is not allowed.');
        } else {
          setError(data.error || 'Failed to save mood log');
        }
      }
    } catch (error) {
      setError('Failed to save mood log');
    } finally {
      setSubmitting(false);
    }
  };

  // If user has already logged for this day, show the existing log
  if (existingLog) {
    return (
      <div className="mt-4 p-4 border rounded bg-green-50 dark:bg-green-900/20">
        <div className="font-semibold text-green-800 dark:text-green-200 mb-2">
          ✓ Mood already logged for this day
        </div>
        <div className="flex items-center gap-2 text-lg">
          <span>{existingLog.emoji}</span> 
          <span>{existingLog.text}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Logged at {new Date(existingLog.time).toLocaleTimeString()}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      {error && (
        <div className="p-3 border border-red-200 rounded bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}
      <div className="flex gap-2 items-center">
        <span className="font-medium">Mood:</span>
        {emojis.map(e => (
          <button
            type="button"
            key={e}
            className={`text-2xl px-1 ${emoji === e ? 'ring-2 ring-primary rounded' : ''}`}
            onClick={() => setEmoji(e)}
            aria-label={e}
          >
            {e}
          </button>
        ))}
      </div>
      <textarea
        className="border rounded p-2 bg-background/50"
        placeholder="Write your mood journal..."
        value={text}
        onChange={e => setText(e.target.value)}
        required
        rows={2}
      />
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={submitting || !text.trim()}
      >
        {submitting ? 'Saving...' : 'Save Journal'}
      </button>
    </form>
  );
} 