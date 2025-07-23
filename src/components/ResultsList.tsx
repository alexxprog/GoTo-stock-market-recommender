import React, { useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RecommendedPointType } from '../utils/recommendation';
import { Pagination } from './Pagination';
import StockChart from './StockChart';

interface ResultsListProps {
  recommendations: RecommendedPointType[];
  itemsPerPage?: number;
  days: number;
  onPaginate: (page: number) => void;
}

const RecommendationHeader = memo(() => (
  <View style={styles.headerRow}>
    <Text style={[styles.headerText, styles.headerDate]}>Date</Text>
    <Text style={[styles.headerText, styles.headerPrice]}>Price</Text>
    <Text style={[styles.headerText, styles.headerMentions]}>Mentions</Text>
    <Text style={[styles.headerText, styles.headerAction]}>Action</Text>
  </View>
));

const RecommendationItem = memo(({ item }: { item: RecommendedPointType }) => {
  const icon = {
    Buy: '🟢',
    Sell: '🔴',
    Hold: '🟡',
  };

  return (
    <View style={styles.recommendationItem}>
      <Text style={styles.dateText}>{item.date}</Text>
      <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
      <Text style={styles.mentionsText}>{item.mentions}</Text>
      <Text
        style={styles.recommendationText}
        accessibilityLabel={`Recommendation is ${item.recommendation}`}
      >
        {icon[item.recommendation as keyof typeof icon] || ''} {item.recommendation}
      </Text>
    </View>
  );
});

export const ResultsList = ({
  recommendations,
  itemsPerPage = 10,
  days,
  onPaginate,
}: ResultsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isChartVisible, setIsChartVisible] = useState(false);
  const totalPages = Math.ceil(days / itemsPerPage);

  const paginate = useCallback(
    (pageNumber: number) => {
      setCurrentPage(pageNumber);
      onPaginate(pageNumber);
    },
    [onPaginate],
  );

  const toggleChart = useCallback(() => {
    setIsChartVisible((prev) => !prev);
  }, []);

  if (recommendations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No recommendations yet. Search for a stock to see recommendations.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Recommendations</Text>
      <Text style={styles.sectionSubTitle} onPress={toggleChart}>
        {isChartVisible ? 'Hide charts' : 'Show charts'}
      </Text>
      <View style={styles.chartContainer}>
        {isChartVisible && (
          <View>
            <StockChart data={recommendations} field="price" title="Price Chart" />
            <StockChart data={recommendations} field="mentions" title="Mentions Chart" />
          </View>
        )}
      </View>

      <View style={styles.listContent}>
        <RecommendationHeader />
        {recommendations.map((item, index) => (
          <RecommendationItem key={`${item.date}-${index}`} item={item} />
        ))}
      </View>
      <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
    </ScrollView>
  );
};

const COLORS = {
  gray666: '#666',
  gray333: '#333',
  grayDDD: '#ddd',
  grayF0F: '#f0f0f0',
};

const styles = StyleSheet.create({
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  dateText: {
    color: COLORS.gray666,
    flex: 1,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    color: COLORS.gray666,
    fontSize: 16,
    textAlign: 'center',
  },
  headerAction: {
    flex: 1,
    textAlign: 'center',
  },
  headerDate: {
    flex: 1,
    textAlign: 'center',
  },
  headerMentions: {
    flex: 1,
    textAlign: 'center',
  },
  headerPrice: {
    flex: 1,
    textAlign: 'center',
  },
  headerRow: {
    borderBottomColor: COLORS.grayDDD,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 10,
  },
  headerText: {
    color: COLORS.gray333,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  mentionsText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  priceText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  recommendationItem: {
    alignItems: 'center',
    borderBottomColor: COLORS.grayF0F,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  recommendationText: {
    flex: 1,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionSubTitle: {
    color: COLORS.gray333,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionTitle: {
    color: COLORS.gray333,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});
