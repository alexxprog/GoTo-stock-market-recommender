import React from 'react';
import { StockSymbolType } from '../services/symbolService';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface DropdownProps {
    symbols: StockSymbolType[];
    onSelect: (symbol: string) => void;
}

export const Dropdown = ({ symbols, onSelect }: DropdownProps) => {
    return (
        <View>
            {symbols.length > 20 ? (
                <View
                    style={styles.dropdown}
                    accessibilityRole="alert"
                    accessibilityLabel="Too many results">
                    <Text style={styles.dropdownItem}>
                    We found {symbols.length} results. Please enter more symbols to narrow down the search
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.dropdown}
                    accessibilityRole="list"
                    accessibilityLabel="Stock symbol suggestions"
                >
                    {symbols.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                onSelect(item.Symbol);
                            }}
                            style={styles.dropdownItem}
                            accessibilityRole="button"
                            accessibilityLabel={`Select ${item.Symbol} - ${item.Name}`}
                            accessibilityHint="Tap to select this stock symbol"
                        >
                            <Text>{item.Symbol} | {item.Name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#fff',
        maxHeight: 200,
        overflow: 'scroll',
        zIndex: 1,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});