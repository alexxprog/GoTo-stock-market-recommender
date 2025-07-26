import React, { memo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { RecommendedPointType } from '../utils/recommendation';
import { Pagination } from './Pagination';
import StockChart from './StockChart';
import { useAppDispatch } from '../store/hooks';
import { setCurrentPage } from '../store/stockSlice';
import { colors } from '../theme/colors';

interface ResultsListProps {
  recommendations: RecommendedPointType[];
  itemsPerPage: number;
  days: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
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
  itemsPerPage,
  days,
  currentPage,
  loading,
  error,
}: ResultsListProps) => {
  const dispatch = useAppDispatch();

  const onPaginate = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  if (loading && recommendations.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (recommendations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available. Please perform a search.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StockChart data={recommendations} field="price" title="Price Chart" />
      <StockChart data={recommendations} field="mentions" title="Mentions Chart" />
      <RecommendationHeader />
      {recommendations.map((item, index) => (
        <RecommendationItem key={`${item.date}-${index}`} item={item} />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(days / itemsPerPage)}
        paginate={onPaginate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    flex: 1,
    marginTop: 10,
    padding: 10,
  },
  dateText: {
    color: colors.gray[700],
    flex: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: colors.gray[500],
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: colors.error,
    borderRadius: 8,
    marginTop: 10,
    padding: 20,
  },
  errorText: {
    color: colors.black,
    textAlign: 'center',
  },
  headerAction: {
    flex: 1,
    textAlign: 'right',
  },
  headerDate: {
    flex: 2,
  },
  headerMentions: {
    flex: 1,
    textAlign: 'center',
  },
  headerPrice: {
    flex: 1,
    textAlign: 'right',
  },
  headerRow: {
    borderBottomColor: colors.gray[200],
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 5,
    paddingVertical: 10,
  },
  headerText: {
    color: colors.gray[500],
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  mentionsText: {
    color: colors.gray[800],
    flex: 1,
    textAlign: 'center',
  },
  priceText: {
    color: colors.gray[800],
    flex: 1,
    textAlign: 'right',
  },
  recommendationItem: {
    alignItems: 'center',
    borderBottomColor: colors.gray[200],
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 12,
  },
  recommendationText: {
    flex: 1,
    fontWeight: '500',
    textAlign: 'right',
  },
});
