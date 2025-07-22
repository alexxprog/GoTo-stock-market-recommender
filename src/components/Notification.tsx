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

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    error: {
        backgroundColor: '#f8d7da',
    },
    warning: {
        backgroundColor: '#fff3cd',
    },
});