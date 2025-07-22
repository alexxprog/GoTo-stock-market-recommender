// src/__tests__/components/StockForm.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StockForm } from '../../components/StockForm';
import { fetchSymbols } from '../../services/symbolService';

// Mock the fetchSymbols function
jest.mock('../../services/symbolService', () => ({
  fetchSymbols: jest.fn(),
}));

// Helper function to wait for a specified time
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('StockForm', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the fetchSymbols response
    (fetchSymbols as jest.Mock).mockResolvedValue([
      { Symbol: 'AAPL', Name: 'Apple Inc.' },
      { Symbol: 'MSFT', Name: 'Microsoft Corporation' },
    ]);
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <StockForm onSearch={mockOnSearch} />
    );

    expect(getByPlaceholderText('Enter stock symbol (e.g., AAPL, MSFT, GOOGL) or company name')).toBeTruthy();
    expect(getByPlaceholderText('Enter number of days (e.g., 10, 30, 90)')).toBeTruthy();
    expect(getByText('Get Recommendations')).toBeTruthy();
  });

  it('validates empty symbol on submit', async () => {
    const { getByText, queryByText } = render(
      <StockForm onSearch={mockOnSearch} />
    );

    const submitButton = getByText('Get Recommendations');
    fireEvent.press(submitButton);

    // Check if error message is displayed
    expect(queryByText('Stock symbol is required')).toBeTruthy();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('validates days input to be a number', async () => {
    const { getByText, getByPlaceholderText } = render(
      <StockForm onSearch={mockOnSearch} />
    );

    const symbolInput = getByPlaceholderText('Enter stock symbol (e.g., AAPL, MSFT, GOOGL) or company name');
    const daysInput = getByPlaceholderText('Enter number of days (e.g., 10, 30, 90)');
    const submitButton = getByText('Get Recommendations');

    // Test with non-numeric input
    fireEvent.changeText(symbolInput, 'AAPL');
    fireEvent.changeText(daysInput, 'abc');
    fireEvent.press(submitButton);

    // Check if error message is displayed
    expect(getByText('Please enter a valid number of days')).toBeTruthy();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('calls onSearch with correct parameters when form is valid', async () => {
    const { getByText, findByText, getByPlaceholderText } = render(
      <StockForm onSearch={mockOnSearch} />
    );

    const symbolInput = getByPlaceholderText('Enter stock symbol (e.g., AAPL, MSFT, GOOGL) or company name');
    const daysInput = getByPlaceholderText('Enter number of days (e.g., 10, 30, 90)');
    const submitButton = getByText('Get Recommendations');

    // Fill in the form
    fireEvent.changeText(symbolInput, 'AAPL');

    // Wait for dropdown to appear and select the first option
    await sleep(1000);
    const appleOption = await findByText(/Apple Inc/i);
    fireEvent.press(appleOption);

    fireEvent.changeText(daysInput, '10');

    // Submit the form
    fireEvent.press(submitButton);

    // Check if onSearch was called with correct parameters
    expect(mockOnSearch).toHaveBeenCalledWith('AAPL', 10);
  });

  it('shows dropdown when typing in symbol input', async () => {
    const { getByPlaceholderText, findByText } = render(
      <StockForm onSearch={mockOnSearch} />
    );

    const symbolInput = getByPlaceholderText('Enter stock symbol (e.g., AAPL, MSFT, GOOGL) or company name');

    // Type in the symbol input
    fireEvent.changeText(symbolInput, 'AAPL');

    await sleep(1000);

    // Wait for the dropdown to appear with the mocked data
    const appleOption = await findByText(/Apple Inc/i);
    expect(appleOption).toBeTruthy();
  });
});
