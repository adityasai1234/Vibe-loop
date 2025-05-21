import React from 'react';
import { PRESETS, EqPreset } from "@/audio/eqPresets";
import { usePlayerStore } from "@/store/playerStore";

export default function EQControl() {
  const { eqPreset, setEqPreset } = usePlayerStore();
  return (
    <div className="flex gap-2 flex-wrap">
      {(Object.keys(PRESETS) as EqPreset[]).map(p => (
        <button key={p}
          className={`px-3 py-1 rounded ${eqPreset===p?'bg-blue-600 text-white':'bg-gray-200 dark:bg-gray-700 '}`}
          onClick={() => setEqPreset(p)}>
          {p}
        </button>
      ))}
    </div>
  );
}