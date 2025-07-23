import React, { useCallback, useMemo, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PaginationProps {
    totalPages: number,
    currentPage: number,
    paginate: (page: number) => void
};

export const Pagination = memo(({totalPages, currentPage, paginate}: PaginationProps) => {
    let startPage, endPage;

    const prevPageHandler = useCallback(() => {
        paginate(currentPage - 1 > 1 ? currentPage - 1 : 1);
    }, [currentPage, paginate]);

    const nextPageHandler = useCallback(() => {
        paginate(currentPage + 1 > totalPages ? totalPages : currentPage + 1);
    }, [currentPage, totalPages, paginate]);

    const handlePageClick = useCallback((number: number) => () => {
        paginate(number);
    }, [paginate]);

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
            showEndEllipsis: totalPages > 5 && currentPage < totalPages - 2
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
                style={[
                    styles.paginationButton,
                    currentPage === 1 && styles.disabledButton
                ]}
                >
                <Text style={styles.paginationText}>Prev</Text>
                </TouchableOpacity>

                {showStartEllipsis && <Text style={styles.paginationText}>...</Text>}

                {pages.map(number => (
                    <TouchableOpacity
                        key={number}
                        onPress={handlePageClick(number)}
                        disabled={number === currentPage}
                        accessibilityRole="button"
                        accessibilityLabel={`Page ${number}`}
                        accessibilityHint={number === currentPage ? 'Current page' : `Navigate to page ${number}`}
                        style={[
                            styles.paginationButton,
                            currentPage === number && styles.activePage
                        ]}
                    >
                        <Text style={[
                            styles.paginationText,
                            currentPage === number && styles.activeText
                        ]}>
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
                style={[
                    styles.paginationButton,
                    currentPage === totalPages && styles.disabledButton
                ]}
                >
                <Text style={styles.paginationText}>Next</Text>
                </TouchableOpacity>
            </View>
        )}
        </>
    );
});

const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
      },
      paginationButton: {
        paddingVertical: 8,
        paddingHorizontal: 5,
        marginHorizontal: 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        minWidth: 30,
        alignItems: 'center',
      },
      activePage: {
        backgroundColor: '#007AFF',
      },
      paginationText: {
        color: '#000',
      },
      activeText: {
        color: '#fff',
      },
      disabledButton: {
        opacity: 0.5,
      },
});