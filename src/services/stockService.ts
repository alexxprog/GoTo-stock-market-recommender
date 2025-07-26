export interface StockDataPointType {
  date: string;
  price: number;
  mentions: number;
}

export async function getStockData(
  days: number = 10,
  daysPerPage: number = 10,
  page: number = 1,
): Promise<StockDataPointType[]> {
  return new Promise((resolve) => {
    const data: StockDataPointType[] = [];
    const start = page === 1 ? 0 : page * daysPerPage - daysPerPage;
    const end = Math.min(page === 1 ? daysPerPage : page * daysPerPage, days);

    for (let i = start; i < end; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      data.push({
        date: date.toISOString().split('T')[0],
        price: +(Math.random() * 50 + 100).toFixed(2),
        mentions: Math.floor(Math.random() * 300),
      });
    }

    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}
