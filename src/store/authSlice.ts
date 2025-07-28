import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { checkAuthService } from '../services/authService';

type StockTradeType = {
  symbol: string;
  price: number;
  date: string;
  action: string;
  amount: number;
};

export type StockUserType = {
  name: string;
  email: string;
  bank: number;
  itemsPerPage: number;
  trades: StockTradeType[];
};

interface AuthState {
  isAuthenticated: boolean;
  user: StockUserType | null;
  loading: boolean;
  error: string | null;
  rememberMe: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  rememberMe: false,
};

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async ({ email, password }: { email: string; password: string }) => {
    const user = await checkAuthService(email, password);
    return user;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state, action: PayloadAction<{ email: string; rememberMe: boolean }>) => {
      state.loading = true;
      state.error = null;
      state.rememberMe = action.payload.rememberMe;
    },
    loginSuccess: (state, action: PayloadAction<StockUserType>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    restoreAuthState: (
      state,
      action: PayloadAction<{ user: StockUserType; rememberMe: boolean }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.rememberMe = action.payload.rememberMe;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError, restoreAuthState } =
  authSlice.actions;

export const selectAuthState = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;
