import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getStockData } from '../services/stockService';
import { generateRecommendations, RecommendedPointType } from '../utils/recommendation';

interface StockStateType {
  symbol: string;
  days: number;
  recommendations: RecommendedPointType[];
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: StockStateType = {
  symbol: '', // TODO: check if we need to store it here
  days: 10, // TODO: check if we need to store it here
  recommendations: [],
  currentPage: 1,
  itemsPerPage: 10,
  loading: false,
  error: null,
};

export const fetchStockData = createAsyncThunk(
  'stock/fetchData',
  async (
    { days, page = 1, itemsPerPage = 10 }: { days: number; page?: number; itemsPerPage?: number },
    { rejectWithValue },
  ) => {
    try {
      const data = await getStockData(days, itemsPerPage, page);
      const recommendations = generateRecommendations(data);
      return { recommendations, page };
    } catch (error) {
      return rejectWithValue(`Failed to fetch stock data: ${error}`);
    }
  },
);

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setSymbol: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload;
    },
    setDays: (state, action: PayloadAction<number>) => {
      state.days = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetStockState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload.recommendations;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSymbol, setDays, setCurrentPage, resetStockState } = stockSlice.actions;

export const selectStockState = (state: { stock: StockStateType }) => state.stock;

export default stockSlice.reducer;
