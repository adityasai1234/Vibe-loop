import { useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";   // assumes this exists
import { useUiStore } from "@/store/uiStore";
import { getDominantRGB, gradientFrom } from "@/sensors/colorUtils";

export const useDominantColor = () => {
  const { currentSong } = usePlayerStore();            // { albumArt, mood, … }
  const { setThemeGradient } = useUiStore();

  useEffect(() => {
    if (!currentSong?.albumArt) return;
    let cancelled = false;

    (async () => {
      try {
        const rgb = await getDominantRGB(currentSong.albumArt);
        if (!cancelled) {
          // Handle mood array - use first mood or empty string
          const moodString = Array.isArray(currentSong.mood) ? currentSong.mood[0] || "" : currentSong.mood || "";
          const grad = gradientFrom(rgb, moodString);
          setThemeGradient(grad);
        }
      } catch (e) {
        console.error("dominant-colour failed", e);
      }
    })();

    return () => { cancelled = true; };
  }, [currentSong, setThemeGradient]);
};