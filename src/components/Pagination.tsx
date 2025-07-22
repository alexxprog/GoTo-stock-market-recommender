import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PaginationProps {
    totalPages: number,
    currentPage: number,
    paginate: (page: number) => void
};

export const Pagination = ({totalPages, currentPage, paginate}: PaginationProps) => {
    let startPage, endPage;

    const prevPageHandler = () => {
        paginate(currentPage - 1 > 1 ? currentPage - 1 : 1);
    };

    const nextPageHandler = () => {
        paginate(currentPage + 1 > totalPages ? totalPages : currentPage + 1);
    };

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
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

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

            {totalPages > 5 && currentPage > 3 && <Text style={styles.paginationText}>...</Text>}

            {pages.map(number => (
            <TouchableOpacity
                key={number}
                onPress={() => paginate(number)}
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

            {totalPages > 5 && currentPage < totalPages - 2 && <Text style={styles.paginationText}>...</Text>}

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
};

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