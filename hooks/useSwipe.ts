import { useRouter, useSegments } from "expo-router";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import type { Href } from "expo-router";

export function useSwipe() {
  const router = useRouter();
  const segments = useSegments();

  const tabs = ['index', 'guide', 'memories', 'placestraveled'];

  const current = segments[segments.length - 1] ?? 'index';
  const activeIndex = Math.max(0, tabs.indexOf(current));

  // IMPORTANT: Convert string → Href here (JS thread), not inside the worklet
  const navigate = (routeName: string) => {
    const path: Href =
      routeName === 'index'
        ? '/(tabs)'
        : (`/(tabs)/${routeName}` as Href);

    router.replace(path);
  };

  return Gesture.Pan().onEnd((e) => {
    'worklet';
    const threshold = 50;

    if (e.translationX < -threshold && activeIndex < tabs.length - 1) {
      const next = tabs[activeIndex + 1];
      runOnJS(navigate)(next);
    } else if (e.translationX > threshold && activeIndex > 0) {
      const prev = tabs[activeIndex - 1];
      runOnJS(navigate)(prev);
    }
  });
}
