import Animated from 'react-native-reanimated';

export default function MoodBlob({ mood, intensity }) {
  // ... calculate color/size based on mood/intensity ...
  return (
    <Animated.View
      style={{
        width: 40 + intensity * 4,
        height: 40 + intensity * 4,
        borderRadius: 100,
        backgroundColor: moodColorMap[mood],
        // ... animated styles ...
      }}
    />
  );
}