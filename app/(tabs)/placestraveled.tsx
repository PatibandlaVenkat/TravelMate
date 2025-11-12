// ...existing code...
import React from 'react';
import { View, StyleSheet, StatusBar,Text } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSwipe } from '@/hooks/useSwipe';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function BlankIndex() {
  const colorScheme=useColorScheme();
  const theme =Colors[colorScheme ?? 'light'];
  const swipe=useSwipe();
  return (
    <GestureDetector gesture={swipe}>
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <StatusBar barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'} />
      <Text style={[styles.title,{color:theme.text}]}>Places Visited</Text>
      <View style={[styles.hline,{backgroundColor: theme.icon}]}></View>
    </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    paddingTop: 70,
  },
   title:{
    fontWeight:'700',
    fontSize: 28, 
    paddingBottom:8,
  },
  hline:{
    height:1,
    width:'100%',
    marginVertical:10,
  }
});
// ...existing code...
