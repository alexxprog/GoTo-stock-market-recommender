import symbols from '../data/companies.json';

export interface StockSymbolType {
  Symbol: string;
  Name: string;
}

export async function fetchSymbols(str: string): Promise<StockSymbolType[]> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(
          !str
            ? []
            : symbols.filter(
                (s) =>
                  s.Name.toLowerCase().includes(str.toLowerCase()) ||
                  s.Symbol.toLowerCase().includes(str.toLowerCase()),
              ),
        ),
      300,
    );
  });
}
