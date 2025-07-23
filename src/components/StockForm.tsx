import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { fetchSymbols, StockSymbolType } from '../services/symbolService';
import { useDebounce } from '../hooks/useDebounce';
import { Dropdown } from './Dropdown';
import { Notification } from './Notification';

interface StockFormProps {
  onSearch: (text: string, daysCount: number) => void;
}

export const StockForm = ({ onSearch }: StockFormProps) => {
  const [symbol, setSymbol] = useState<string>('');
  const [days, setDays] = useState<string>('10');
  // isSelecting is used to prevent the dropdown from opening when the user is selected a symbol
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
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
  }, [debouncedSymbol, isSelecting]);

  type ValidationErrors = {
    symbol: string;
    days: string;
  };

  const validateInputs = (): ValidationErrors | false => {
    const errors: ValidationErrors = {
      symbol: '',
      days: '',
    };
    if (!symbol) {
      errors.symbol = 'Stock symbol is required';
    }
    if (!days) {
      errors.days = 'Days is required';
    }
    const numericValue = days.replace(/[^0-9]/g, '');
    if (numericValue !== days) {
      errors.days = 'Please enter a valid number of days';
    }
    return errors.days || errors.symbol ? errors : false;
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Stock Symbol</Text>
      <TextInput
        value={symbol}
        onChangeText={(text) => {
          setSymbol(text.toUpperCase());
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
            setSymbolError('');
            setSymbol(text);
            setShowDropdown(false);
            Keyboard.dismiss();
          }}
        />
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
          const errors = validateInputs();
          if (!errors) {
            Keyboard.dismiss();
            onSearch(symbol, parseInt(days, 10));
            setShowDropdown(false);

            return;
          }
          if (errors.symbol) {
            setSymbolError(errors.symbol);
          }
          if (errors.days) {
            setDaysError(errors.days);
          }
        }}
        accessibilityRole="button"
        accessibilityLabel="Get recommendation button"
        accessibilityHint="Tap to get recommendation"
      >
        <Text style={styles.buttonText}>Get Recommendations</Text>
      </TouchableOpacity>
    </View>
  );
};

const COLORS = {
  blue: '#007AFF',
  white: '#fff',
  gray: '#ccc',
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.blue,
    borderRadius: 5,
    marginTop: 10,
    padding: 15,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: COLORS.gray,
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
});
