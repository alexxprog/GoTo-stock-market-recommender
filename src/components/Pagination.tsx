import React, { useCallback, useMemo, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  paginate: (page: number) => void;
}

export const Pagination = memo(({ totalPages, currentPage, paginate }: PaginationProps) => {
  const prevPageHandler = useCallback(() => {
    paginate(currentPage - 1 > 1 ? currentPage - 1 : 1);
  }, [currentPage, paginate]);

  const nextPageHandler = useCallback(() => {
    paginate(currentPage + 1 > totalPages ? totalPages : currentPage + 1);
  }, [currentPage, totalPages, paginate]);

  const handlePageClick = useCallback(
    (number: number) => () => {
      paginate(number);
    },
    [paginate],
  );

  // Lets consider this as expensive calculations
  const { pages, showStartEllipsis, showEndEllipsis } = useMemo(() => {
    let startPage, endPage;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    return {
      pages: Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i),
      showStartEllipsis: totalPages > 5 && currentPage > 3,
      showEndEllipsis: totalPages > 5 && currentPage < totalPages - 2,
    };
  }, [currentPage, totalPages]);

  return (
    <>
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={prevPageHandler}
            disabled={currentPage === 1}
            accessibilityRole="button"
            accessibilityLabel="Previous page"
            accessibilityHint="Navigate to the previous page of results"
            style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
          >
            <Text style={styles.paginationText}>Prev</Text>
          </TouchableOpacity>

          {showStartEllipsis && <Text style={styles.paginationText}>...</Text>}

          {pages.map((number) => (
            <TouchableOpacity
              key={number}
              onPress={handlePageClick(number)}
              disabled={number === currentPage}
              accessibilityRole="button"
              accessibilityLabel={`Page ${number}`}
              accessibilityHint={
                number === currentPage ? 'Current page' : `Navigate to page ${number}`
              }
              style={[styles.paginationButton, currentPage === number && styles.activePage]}
            >
              <Text style={[styles.paginationText, currentPage === number && styles.activeText]}>
                {number}
              </Text>
            </TouchableOpacity>
          ))}

          {showEndEllipsis && <Text style={styles.paginationText}>...</Text>}

          <TouchableOpacity
            onPress={nextPageHandler}
            disabled={currentPage === totalPages}
            accessibilityRole="button"
            accessibilityLabel="Next page"
            accessibilityHint="Navigate to the next page of results"
            style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
          >
            <Text style={styles.paginationText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
});

const COLORS = {
  gray333: '#333',
  gray666: '#666',
  grayDDD: '#ddd',
  grayF0F: '#f0f0f0',
  white: '#fff',
  blue: '#007AFF',
  black: '#000',
};

const styles = StyleSheet.create({
  activePage: {
    backgroundColor: COLORS.blue,
  },
  activeText: {
    color: COLORS.white,
  },
  disabledButton: {
    opacity: 0.5,
  },
  paginationButton: {
    alignItems: 'center',
    backgroundColor: COLORS.grayF0F,
    borderRadius: 4,
    marginHorizontal: 4,
    minWidth: 30,
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  paginationContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  paginationText: {
    color: COLORS.black,
  },
});
