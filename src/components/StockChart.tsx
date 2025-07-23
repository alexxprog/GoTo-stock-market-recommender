import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { RecommendedPointType } from '../utils/recommendation';

interface Props {
  data: RecommendedPointType[];
  field: 'price' | 'mentions';
  title: string;
}

const screenWidth = Dimensions.get('window').width;

const StockChart: React.FC<Props> = ({ data, field, title }) => {
  const chartData = {
    labels: data.map((d) => d.date.slice(5)), // MM-DD
    datasets: [
      {
        data: data.map((d) => (field === 'price' ? d.price : d.mentions)),
      },
    ],
  };

  return (
    <View>
        <Text style={styles.title}>{title.charAt(0).toUpperCase() + title.slice(1)}</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix={field === 'price' ? '$' : ''}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f8f9fa',
            backgroundGradientTo: '#e9ecef',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(33, 37, 41, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(33, 37, 41, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: '3',
              strokeWidth: '1',
              stroke: '#555',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
    </View>
  );
};

export default StockChart;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
});