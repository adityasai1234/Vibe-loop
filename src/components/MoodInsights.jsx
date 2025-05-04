// Placeholder for chart/animation imports (e.g., Framer Motion, chart libraries)

const mockData = {
  week: [6, 7, 5, 8, 4, 7, 9],
  tags: { joyful: 4, numb: 2, grateful: 3, overwhelmed: 1 },
  energy: [3, 5, 4, 6, 7, 5, 8],
  quote: "Growth is a journey, not a destination.",
  anthem: "Sunshine Vibes"
};

export default function InsightsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl flex flex-col gap-8 animate-slide-up">
        <h2 className="text-2xl font-bold text-center mb-2">Mood Insights</h2>
        {/* Weekly Mood Chart Placeholder */}
        <div className="mb-4">
          <p className="font-semibold mb-1">Weekly Mood Chart</p>
          <div className="w-full h-32 bg-blue-100 rounded-xl flex items-end gap-1 p-2">
            {mockData.week.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-6 rounded-t-lg bg-blue-400" style={{ height: `${val * 12}px` }} />
                <span className="text-xs text-gray-500 mt-1">{['S','M','T','W','T','F','S'][i]}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Most Common Tags */}
        <div className="mb-4">
          <p className="font-semibold mb-1">Most Common Tags</p>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(mockData.tags).map(([tag, count]) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-blue-200 text-blue-800 text-sm font-semibold">{tag} ({count})</span>
            ))}
          </div>
        </div>
        {/* Energy Graph Placeholder */}
        <div className="mb-4">
          <p className="font-semibold mb-1">Energy Graph</p>
          <div className="w-full h-16 bg-green-100 rounded-xl flex items-end gap-1 p-2">
            {mockData.energy.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-4 rounded-t-lg bg-green-400" style={{ height: `${val * 8}px` }} />
              </div>
            ))}
          </div>
        </div>
        {/* Quote and Anthem */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <span className="italic text-lg text-blue-600">“{mockData.quote}”</span>
          <span className="text-sm text-gray-500">Most listened: <span className="font-semibold text-blue-700">{mockData.anthem}</span></span>
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        .animate-slide-up { animation: slideUp 0.7s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
