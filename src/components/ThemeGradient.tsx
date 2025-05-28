import { useUiStore } from "@/store/uiStore";

export default function ThemeGradient() {
  const gradient = useUiStore(s => s.themeGradient);
  return <style>{`:root{ --app-bg:${gradient}; }`}</style>;
}
