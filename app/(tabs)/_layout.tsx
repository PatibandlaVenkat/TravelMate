import { Tabs,useRouter, useSegments } from 'expo-router';
import React from 'react';
import {Gesture,GestureDetector} from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Href } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router=useRouter();
  const segments=useSegments();

  const tabs= ['index', 'guide', 'memories', 'placestraveled'];

  const current=segments[segments.length-1] ?? 'index';
  const activeIndex =Math.max(0,tabs.indexOf(current));

  const navigate=(path:Href)=>{
    router.replace(path);
  };

  const swipe=Gesture.Pan().onEnd((e) =>{
    'worklet';
  const threshold=50;
  if(e.translationX < -threshold && activeIndex < tabs.length-1){
  const next= tabs[activeIndex+1];
  const path=next ==='index' ? '/(tabs)' : `/(tabs)/${next}` as Href;
  runOnJS(navigate)(path);
  }else if(e.translationX> threshold && activeIndex>0){
    const prev=tabs[activeIndex-1];
    const path=prev ==='index' ? '/(tabs)' : `/(tabs)/${prev}`as Href;
    runOnJS(navigate)(path);
  }
  }
);

  return (
    <GestureDetector gesture={swipe}>
    <Tabs
      initialRouteName="index" // index.tsx will be the default tab
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index" // maps to app/(tabs)/index.tsx
        options={{
          title: 'Translate',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="globe" color={color} />,
        }}
      />

      <Tabs.Screen
      name="guide"
      options={{
        title:'Guide',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color}/>
      }}
      />

      <Tabs.Screen
        name="memories" // maps to app/(tabs)/memories.tsx
        options={{
          title: 'Memories',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bookmark.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="placestraveled" // maps to app/(tabs)/placestraveled.tsx
        options={{
          title: 'PlacesTraveled',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="pin.fill" color={color} />,
        }}
      />
    </Tabs>
    </GestureDetector>
  );
}
