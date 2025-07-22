// src/__tests__/screens/HomeScreen.test.tsx
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from '../../screens/HomeScreen';
import { getStockData } from '../../services/stockService';
import { generateRecommendations } from '../../utils/recommendation';

// Mock the services
jest.mock('../../services/stockService', () => ({
  getStockData: jest.fn(),
}));

// Helper function to wait for a specified time
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock the recommendation utility
jest.mock('../../utils/recommendation', () => ({
  generateRecommendations: jest.fn(),
}));

describe('HomeScreen', () => {
  const mockStockData = [
    { date: '2023-01-01', price: 150, mentions: 10 },
    { date: '2023-01-02', price: 155, mentions: 15 },
  ];

  const mockRecommendations = [
    { date: '2023-01-01', price: 150, mentions: 10, recommendation: 'Buy' },
    { date: '2023-01-02', price: 155, mentions: 15, recommendation: 'Buy' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getStockData as jest.Mock).mockResolvedValue(mockStockData);
    (generateRecommendations as jest.Mock).mockReturnValue(mockRecommendations);
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<HomeScreen />);

    // Check if header is rendered
    expect(getByText(/Stock Market Recommender/i)).toBeTruthy();

    // Check if form inputs are rendered
    expect(getByPlaceholderText('Enter stock symbol (e.g., AAPL, MSFT, GOOGL) or company name')).toBeTruthy();
    expect(getByPlaceholderText('Enter number of days (e.g., 10, 30, 90)')).toBeTruthy();
  });

  it('loads and displays recommendations when form is submitted', async () => {
    const { getByText, getByPlaceholderText, findByText } = render(<HomeScreen />);

    // Fill in the form
    const symbolInput = getByPlaceholderText('Enter stock symbol (e.g., AAPL, MSFT, GOOGL) or company name');
    const daysInput = getByPlaceholderText('Enter number of days (e.g., 10, 30, 90)');
    const submitButton = getByText('Get Recommendations');

    fireEvent.changeText(symbolInput, 'AAPL');

    await sleep(1000);

    const appleOption = await findByText(/Apple Inc/i);
    fireEvent.press(appleOption);
    fireEvent.changeText(daysInput, '10');
    await sleep(500);

    // Submit the form
    fireEvent.press(submitButton);

    // Check if services were called with correct parameters
    expect(getStockData).toHaveBeenCalledWith('AAPL', 10, 10, 1);

    // Wait for the component to process the response
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(generateRecommendations).toHaveBeenCalledWith(mockStockData);

    // Check if recommendations are displayed
    // Note: This assumes ResultsList is rendered with the recommendations
    expect(getByText('Recommendations')).toBeTruthy();
  });

  it('handles pagination correctly', async () => {
    const { getByText, getByPlaceholderText } = render(<HomeScreen />);

    // First, submit the form to load initial data
    fireEvent.changeText(
      getByPlaceholderText('Enter stock symbol (e.g., AAPL, MSFT, GOOGL) or company name'),
      'AAPL'
    );
    fireEvent.changeText(
      getByPlaceholderText('Enter number of days (e.g., 10, 30, 90)'),
      '20' // More than one page of data (20 days / 10 per page = 2 pages)
    );

    fireEvent.press(getByText('Get Recommendations'));

    await sleep(1000);

    // Reset mocks to track the second call
    (getStockData as jest.Mock).mockClear();

    // Simulate clicking on page 2
    // Note: This assumes your Pagination component renders page numbers as buttons
    fireEvent.press(getByText('2'));

    // Check if getStockData was called with the correct page number
    expect(getStockData).toHaveBeenCalledWith('AAPL', 20, 10, 2);
  });
});
