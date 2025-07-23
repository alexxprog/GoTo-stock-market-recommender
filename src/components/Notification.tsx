import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NotificationProps {
  text: string;
  type: 'error' | 'warning';
}

export const Notification = ({ text, type }: NotificationProps) => {
  return (
    <View style={[styles.container, styles[type]]}>
      <Text>{text}</Text>
    </View>
  );
};

const COLORS = {
  error: '#f8d7da',
  warning: '#fff3cd',
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  error: {
    backgroundColor: COLORS.error,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  warning: {
    backgroundColor: COLORS.warning,
  },
});
