import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Header } from '../components/Header';
import { StockForm } from '../components/StockForm';
import { ResultsList } from '../components/ResultsList';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchStockData, selectStockState } from '../store/stockSlice';
import { colors } from '../theme/colors';
import { selectAuthState } from '../store/authSlice';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuthState);

  const { symbol, days, recommendations, currentPage, itemsPerPage, error, loading } =
    useAppSelector(selectStockState);

  const loadData = useCallback(
    (page: number) => {
      if (!symbol || !days) return;

      dispatch(
        fetchStockData({
          days,
          page,
          itemsPerPage,
        }),
      );
    },
    [dispatch, days, symbol, itemsPerPage],
  );

  useEffect(() => {
    loadData(currentPage);
  }, [symbol, days, itemsPerPage, currentPage, loadData]);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <StockForm days={days} symbol={symbol} loading={loading} />
        <ResultsList
          recommendations={recommendations}
          itemsPerPage={itemsPerPage}
          days={days}
          currentPage={currentPage}
          error={error}
          loading={loading}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 20,
  },
});

export default HomeScreen;
