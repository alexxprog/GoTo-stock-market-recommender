// src/__tests__/services/symbolService.test.ts
import { fetchSymbols } from '../../services/symbolService';

// Mock the entire companies.json module
jest.mock('../../data/companies.json', () => [
  { Symbol: 'AAPL', Name: 'Apple Inc.' },
  { Symbol: 'MSFT', Name: 'Microsoft Corporation' },
  { Symbol: 'GOOGL', Name: 'Alphabet Inc.' },
  { Symbol: 'AMZN', Name: 'Amazon.com Inc.' },
  { Symbol: 'META', Name: 'Meta Platforms Inc.' },
]);

describe('fetchSymbols', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mocked implementation in case it was changed in a test
    jest.mock('../../data/companies.json', () => [
      { Symbol: 'AAPL', Name: 'Apple Inc.' },
      { Symbol: 'MSFT', Name: 'Microsoft Corporation' },
      { Symbol: 'GOOGL', Name: 'Alphabet Inc.' },
      { Symbol: 'AMZN', Name: 'Amazon.com Inc.' },
      { Symbol: 'META', Name: 'Meta Platforms Inc.' },
    ]);
  });

  it('returns matching symbols by symbol', async () => {
    const result = await fetchSymbols('AAPL');
    expect(result).toEqual([{ Symbol: 'AAPL', Name: 'Apple Inc.' }]);
  });

  it('returns matching symbols by company name', async () => {
    const result = await fetchSymbols('Apple');
    expect(result).toEqual([{ Symbol: 'AAPL', Name: 'Apple Inc.' }]);
  });

  it('is case insensitive', async () => {
    const result1 = await fetchSymbols('aapl');
    const result2 = await fetchSymbols('apple');

    expect(result1).toEqual([{ Symbol: 'AAPL', Name: 'Apple Inc.' }]);
    expect(result2).toEqual([{ Symbol: 'AAPL', Name: 'Apple Inc.' }]);
  });

  it('returns multiple matches', async () => {
    const result = await fetchSymbols('Inc');
    expect(result).toHaveLength(4); // All our mock companies have 'Inc' in their name
    expect(result).toEqual(expect.arrayContaining([
      { Symbol: 'AAPL', Name: 'Apple Inc.' },
      { Symbol: 'GOOGL', Name: 'Alphabet Inc.' },
      { Symbol: 'AMZN', Name: 'Amazon.com Inc.' },
      { Symbol: 'META', Name: 'Meta Platforms Inc.' },
    ]));
  });

  it('returns empty array when no matches found', async () => {
    const result = await fetchSymbols('Nonexistent');
    expect(result).toEqual([]);
  });

  it('returns empty array for empty search string', async () => {
    // In a real app, you might want to handle this case differently
    // (e.g., return all symbols or a default set)
    const result = await fetchSymbols('');
    expect(result).toEqual([]);
  });

  it('returns results after a delay', async () => {
    const startTime = Date.now();
    await fetchSymbols('AAPL');
    const endTime = Date.now();

    // The function should take at least 300ms due to the setTimeout
    expect(endTime - startTime).toBeGreaterThanOrEqual(300);
  });
});
