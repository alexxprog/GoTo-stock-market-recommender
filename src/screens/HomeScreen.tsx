import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { getStockData } from '../services/stockService';
import { generateRecommendations, RecommendedPointType } from '../utils/recommendation';
import { Header } from '../components/Header';
import { StockForm } from '../components/StockForm';
import { ResultsList } from '../components/ResultsList';

const HomeScreen = () => {
  const daysPerPage = 10;
  const [recommendations, setRecommendations] = useState<RecommendedPointType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const symbol = useRef('');
  const days = useRef(0);
  const paginate = useCallback((page: number) => {
    setCurrentPage(page);
    loadData(page);
  }, []);

  const loadData = async (page: number) => {
    if (!symbol.current || !days.current) {
      setRecommendations([]);
      return;
    }
    const data = await getStockData(symbol.current, days.current, daysPerPage, page);
    const withRecs = generateRecommendations(data);
    setRecommendations(withRecs);
  };

  const handleSearch = async (text: string, daysCount: number) => {
    symbol.current = text;
    days.current = daysCount;
    // Not sure if we need to reset the page to 1
    // setCurrentPage(1);
    await loadData(currentPage);
  };

  return (
    <View style={styles.container}>
      <Header />

      <StockForm
        onSearch={handleSearch}
      />

      <ResultsList
        recommendations={recommendations}
        itemsPerPage={daysPerPage}
        days={days.current}
        onPaginate={paginate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
});

export default HomeScreen;
