import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const Header = () => {
  return (
    <Text style={styles.header}>📈 Stock Market Recommender</Text>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
