import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { fetchSymbols, StockSymbolType } from '../services/symbolService';
import { useDebounce } from '../hooks/useDebounce';
import { Dropdown } from './Dropdown';
import { Notification } from './Notification';
import { useAppDispatch } from '../store/hooks';
import { setDays, setSymbol, setCurrentPage } from '../store/stockSlice';
import { colors } from '../theme/colors';

export type StockFormProps = {
  days: number;
  symbol: string;
  loading: boolean;
};

export const StockForm = ({ days, symbol, loading }: StockFormProps) => {
  const dispatch = useAppDispatch();
  const [symbolInput, setSymbolInput] = useState<string>(symbol);
  const [daysInput, setDaysInput] = useState<string>(days.toString());
  // selectedFromDropdownRef is used to prevent the dropdown from opening when the user is selected a symbol
  const selectedFromDropdownRef = useRef<string>('');
  const [symbolError, setSymbolError] = useState<string>('');
  const [daysError, setDaysError] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [filteredSymbols, setFilteredSymbols] = useState<StockSymbolType[]>([]);
  const debouncedSymbol = useDebounce(symbolInput, 300);

  const handleSearch = (search: string, daysCount: number) => {
    if (loading) return;

    dispatch(setCurrentPage(1));
    dispatch(setSymbol(search));
    dispatch(setDays(daysCount));
  };

  const handleSelectSymbol = useCallback((text: string) => {
    selectedFromDropdownRef.current = text;
    setSymbolInput(text);
    setSymbolError('');
    setFilteredSymbols([]);
    setShowDropdown(false);
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    if (selectedFromDropdownRef.current === debouncedSymbol) {
      selectedFromDropdownRef.current = '';
      return;
    }

    if (debouncedSymbol) {
      fetchSymbols(debouncedSymbol).then((filtered) => {
        if (!selectedFromDropdownRef.current) {
          setFilteredSymbols(filtered);
          setShowDropdown(filtered.length > 0);
        }
      });
    } else {
      setFilteredSymbols([]);
      setShowDropdown(false);
    }
  }, [debouncedSymbol]);

  type ValidationErrors = {
    symbol: string;
    days: string;
  };

  const validateInputs = (): ValidationErrors | false => {
    const errors: ValidationErrors = {
      symbol: '',
      days: '',
    };
    if (!symbolInput) {
      errors.symbol = 'Stock symbol is required';
    }
    if (!daysInput) {
      errors.days = 'Days is required';
    }
    const numericValue = daysInput.replace(/[^0-9]/g, '');
    if (numericValue !== daysInput) {
      errors.days = 'Please enter a valid number of days';
    }
    return errors.days || errors.symbol ? errors : false;
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Stock Symbol</Text>
      <TextInput
        value={symbolInput}
        onChangeText={(text) => {
          setSymbolInput(text.toUpperCase());
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
        editable={!loading}
      />
      {symbolError && <Notification text={symbolError} type="error" />}

      {showDropdown && (
        <Dropdown
          key={filteredSymbols.length}
          symbols={filteredSymbols}
          onSelect={(text) => {
            handleSelectSymbol(text);
          }}
        />
      )}

      <Text style={styles.label}>Time Window (Days)</Text>
      <TextInput
        value={daysInput}
        onChangeText={(text) => {
          setDaysInput(text);
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
        editable={!loading}
      />
      {daysError && <Notification text={daysError} type="error" />}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          const errors = validateInputs();
          if (!errors) {
            Keyboard.dismiss();
            handleSearch(symbolInput, parseInt(daysInput, 10));
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

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: 5,
    marginTop: 10,
    padding: 15,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: colors.gray[300],
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
