import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <HomeScreen />
    </SafeAreaView>
  );
}

const GRAY_FFF = '#fff';

const styles = StyleSheet.create({
  container: {
    backgroundColor: GRAY_FFF,
    flex: 1,
  },
});
