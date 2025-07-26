import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import HomeScreen from './src/screens/HomeScreen';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
