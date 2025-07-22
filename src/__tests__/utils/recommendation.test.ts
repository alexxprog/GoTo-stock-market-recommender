// src/__tests__/utils/recommendation.test.ts
import { generateRecommendations } from '../../utils/recommendation';
import { StockDataPointType } from '../../services/stockService';

describe('generateRecommendations', () => {
  it('should return an array of the same length as input', () => {
    const mockData: StockDataPointType[] = [
      { date: '2023-01-01', price: 100, mentions: 10 },
      { date: '2023-01-02', price: 105, mentions: 15 },
    ];

    const result = generateRecommendations(mockData);
    expect(result).toHaveLength(mockData.length);
  });

  it('should return Buy recommendation when price and mentions are increasing', () => {
    const mockData: StockDataPointType[] = [
      { date: '2023-01-02', price: 105, mentions: 15 },
      { date: '2023-01-01', price: 100, mentions: 10 },
    ];

    const [first, second] = generateRecommendations(mockData);
    expect(first.recommendation).toBe('Buy'); // First point has no previous to compare with
    expect(second.recommendation).toBe('Hold');
  });

  it('should return Sell recommendation when price and mentions are decreasing', () => {
    const mockData: StockDataPointType[] = [
      { date: '2023-01-02', price: 100, mentions: 10 },
      { date: '2023-01-01', price: 105, mentions: 15 },
    ];

    const [first, second] = generateRecommendations(mockData);
    expect(first.recommendation).toBe('Sell'); // First point has no previous to compare with
    expect(second.recommendation).toBe('Hold');
  });

  it('should return Hold when there is no clear trend', () => {
    const mockData: StockDataPointType[] = [
      { date: '2023-01-01', price: 100, mentions: 10 },
      { date: '2023-01-02', price: 105, mentions: 5 }, // Price up, mentions down
      { date: '2023-01-03', price: 95, mentions: 15 }, // Price down, mentions up
    ];

    const result = generateRecommendations(mockData);
    // First point should be Hold (no previous to compare)
    expect(result[0].recommendation).toBe('Hold');
    // Second and third points should be Hold (no clear trend)
    expect(result[1].recommendation).toBe('Hold');
    expect(result[2].recommendation).toBe('Hold');
  });

  it('should handle empty input', () => {
    const result = generateRecommendations([]);
    expect(result).toEqual([]);
  });
});
