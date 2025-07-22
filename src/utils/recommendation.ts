// src/utils/recommendation.ts
import { StockDataPointType } from '../services/stockService';

export type Recommendation = 'Buy' | 'Hold' | 'Sell';

export interface RecommendedPointType extends StockDataPointType {
  recommendation: Recommendation;
}

export function generateRecommendations(
  data: StockDataPointType[]
): RecommendedPointType[] {
  const result: RecommendedPointType[] = [];

  for (let i = data.length - 1; i >= 0; i--) {
    const current = data[i];
    const previous = data[i + 1 >= data.length - 1 ? data.length - 1 : i + 1];

    let recommendation: Recommendation = 'Hold';

    if (previous) {
      const priceUp = current.price > previous.price;
      const mentionsUp = current.mentions > previous.mentions;
      const priceDown = current.price < previous.price;
      const mentionsDown = current.mentions < previous.mentions;

      if (priceUp && mentionsUp) {
        recommendation = 'Buy';
      } else if (priceDown && mentionsDown) {
        recommendation = 'Sell';
      }
    }

    result.push({
      ...current,
      recommendation,
    });
  }

  return result.reverse();
}
