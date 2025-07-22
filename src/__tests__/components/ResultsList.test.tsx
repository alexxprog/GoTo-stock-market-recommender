// src/__tests__/components/ResultsList.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ResultsList } from '../../components/ResultsList';
import { RecommendedPointType } from '../../utils/recommendation';

describe('ResultsList', () => {
  const mockRecommendations: RecommendedPointType[] = [
    {
      date: '2023-01-01',
      price: 150.25,
      mentions: 10,
      recommendation: 'Buy',
    },
    {
      date: '2023-01-02',
      price: 148.50,
      mentions: 8,
      recommendation: 'Hold',
    },
    {
      date: '2023-01-03',
      price: 145.75,
      mentions: 5,
      recommendation: 'Sell',
    },
  ];

  const mockOnPaginate = jest.fn();

  it('renders empty state when no recommendations', () => {
    render(
      <ResultsList
        recommendations={[]}
        days={10}
        onPaginate={mockOnPaginate}
      />
    );

    expect(screen.getByText('No recommendations yet. Search for a stock to see recommendations.')).toBeTruthy();
  });

  it('renders recommendations with correct data', () => {
    render(
      <ResultsList
        recommendations={mockRecommendations}
        days={3}
        onPaginate={mockOnPaginate}
      />
    );

    // Check section title
    expect(screen.getByText('Recommendations')).toBeTruthy();

    // Check headers
    expect(screen.getByText('Date')).toBeTruthy();
    expect(screen.getByText('Price')).toBeTruthy();
    expect(screen.getByText('Mentions')).toBeTruthy();
    expect(screen.getByText('Action')).toBeTruthy();

    // Check first recommendation
    expect(screen.getByText('2023-01-01')).toBeTruthy();
    expect(screen.getByText('$150.25')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText('🟢 Buy')).toBeTruthy();

    // Check second recommendation
    expect(screen.getByText('2023-01-02')).toBeTruthy();
    expect(screen.getByText('$148.50')).toBeTruthy();
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('🟡 Hold')).toBeTruthy();

    // Check third recommendation
    expect(screen.getByText('2023-01-03')).toBeTruthy();
    expect(screen.getByText('$145.75')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('🔴 Sell')).toBeTruthy();
  });

  it('renders pagination with correct number of pages', () => {
    // 30 days with 10 items per page should result in 3 pages
    render(
      <ResultsList
        recommendations={mockRecommendations}
        days={30}
        itemsPerPage={10}
        onPaginate={mockOnPaginate}
      />
    );

    // Check if pagination shows correct number of pages
    // Note: This assumes the Pagination component renders page numbers as buttons with text content as the page number
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('calls onPaginate when pagination is used', () => {
    render(
      <ResultsList
        recommendations={mockRecommendations}
        days={30}
        itemsPerPage={10}
        onPaginate={mockOnPaginate}
      />
    );

    // Simulate clicking on page 2
    // Note: Adjust the way you find and interact with the pagination controls
    // based on your actual Pagination component implementation
    const page2Button = screen.getByText('2');
    fireEvent.press(page2Button);

    expect(mockOnPaginate).toHaveBeenCalledWith(2);
  });
});
