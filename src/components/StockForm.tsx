import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { fetchSymbols, StockSymbolType } from '../services/symbolService';
import { useDebounce } from '../hooks/useDebounce';
import { Dropdown } from './Dropdown';
import { Notification } from './Notification';

interface StockFormProps {
  onSearch: (text: string, daysCount: number) => void;
}

export const StockForm = ({
  onSearch,
}: StockFormProps) => {
  const [symbol, setSymbol] = useState<string>('');
  const [days, setDays] = useState<string>('10');
  // isSelecting is used to prevent the dropdown from opening when the user is selected a symbol
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [symbolError, setSymbolError] = useState<string>('');
  const [daysError, setDaysError] = useState<string>('');
  const debouncedSymbol = useDebounce(symbol, 300);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [filteredSymbols, setFilteredSymbols] = useState<StockSymbolType[]>([]);

  useEffect(() => {
    if (isSelecting) {
        setIsSelecting(false);
        return;
    }

    if (debouncedSymbol) {
      fetchSymbols(debouncedSymbol).then((filtered) => {
        setFilteredSymbols(filtered);
        setShowDropdown(filtered.length > 0);
      });
    } else {
      setFilteredSymbols([]);
      setShowDropdown(false);
    }
  }, [debouncedSymbol]);

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Stock Symbol</Text>
      <TextInput
        value={symbol}
        onChangeText={(text) => {
            setSymbol(text);
            setIsSelected(false);
            setSymbolError('');
        }}
        accessibilityLabel="Stock symbol input or company name"
        placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL) or company name"
        placeholderTextColor="#999"
        autoCapitalize="characters"
        style={styles.input}
        onFocus={() => {
            setSymbolError('');
        }}
      />
      {symbolError && <Notification text={symbolError} type="error" />}

      {showDropdown && (
        <Dropdown
            key={filteredSymbols.length}
            symbols={filteredSymbols}
            onSelect={(text) => {
                setIsSelecting(true);
                setIsSelected(true);
                setSymbolError('');
                setSymbol(text);
                setShowDropdown(false);
                Keyboard.dismiss();
            }} />
      )}

      <Text style={styles.label}>Time Window (Days)</Text>
      <TextInput
        value={days}
        onChangeText={(text) => {
            setDays(text);
            setDaysError('');
        }}
        onFocus={() => {
            setDaysError('');
        }}
        accessibilityLabel="Time window in days input"
        placeholder="Enter number of days (e.g., 10, 30, 90)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        style={styles.input}
      />
      {daysError && <Notification text={daysError} type="error" />}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!symbol) {
              setSymbolError('Stock symbol is required');
              return;
          }
          if(!isSelected) {
              setSymbolError('Please select a stock symbol from the dropdown');
              return;
          }
          if (!days) {
              setDaysError('Days is required');
              return;
          }
          Keyboard.dismiss();
          onSearch(symbol, parseInt(days, 10));
          setShowDropdown(false);
        }}
        accessibilityRole="button"
        accessibilityLabel="Get recommendation button"
        accessibilityHint="Tap to get recommendation"
      >
        <Text style={styles.buttonText}>Get Recommendation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
