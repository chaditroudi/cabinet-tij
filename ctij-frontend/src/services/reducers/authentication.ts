// src/reducers/authentication.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  full_name: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface UpdatePasswordData {
  old_password: string;
  new_password: string;
}

interface User {
  id: number;
  email: string;
  full_name: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: any;
  isAuthenticated: boolean;
  refreshError: any;
  isRegister: boolean;
  isLoadingLogin: boolean;
  isLoadingRegister: boolean;
  isPasswordUpdated: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  refreshError: null,
  isRegister: false,
  isLoadingLogin: false,
  isLoadingRegister: false,
  isPasswordUpdated: false,
  isInitialized: false,
};

// Initialize on app load
export const initializeAuth = createAsyncThunk<void>(
  "auth/initializeAuth",
  async (_, { dispatch }) => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (storedRefresh) {
      try {
        await dispatch(refreshAccessToken()).unwrap();
        await dispatch(getAccount()).unwrap();
      } catch {
        dispatch(logout());
      }
    }
  }
);

// Verify email (if using email-based activation)
export const verifyEmail = createAsyncThunk<
  LoginResponse,
  string,
  { rejectValue: string }
>(
  "auth/verifyEmail",
  async (token, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/verify-email/${token}`);
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      thunkAPI.dispatch(getAccount());
      return { access_token, refresh_token };
    } catch (error: any) {
      const status = error?.response?.status;
      const message = status === 400
        ? "Invalid or expired token."
        : "Email verification failed.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login
export const login = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: any }
>(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/login/", credentials);
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token.token);
      thunkAPI.dispatch(getAccount());
      return {
        access_token,
        refresh_token: refresh_token.token,
      };
    } catch (error: any) {
      const msg = error.code === "ECONNABORTED"
        ? "Request timed out."
        : error.response?.data || "Login failed";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// Register
export const register = createAsyncThunk<
  LoginResponse,
  RegisterCredentials,
  { rejectValue: any }
>(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/register/", credentials);
      return response.data;
    } catch (error: any) {
      const msg = error.code === "ECONNABORTED"
        ? "Request timed out."
        : error.response?.data?.message || "Register failed";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// Fetch user profile
export const getAccount = createAsyncThunk<
  User,
  void,
  { rejectValue: any }
>(
  "auth/getAccount",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/user/");
      return response.data;
    } catch (error: any) {
      const msg = error.code === "ECONNABORTED"
        ? "Request timed out."
        : error.response || { status: 500, message: "Fetch failed" };
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// Refresh token
export const refreshAccessToken = createAsyncThunk<
  string,
  void,
  { rejectValue: any }
>(
  "auth/refreshAccessToken",
  async (_, thunkAPI) => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      return thunkAPI.rejectWithValue("No refresh token");
    }

    try {
      const response = await axiosInstance.post("/refresh/", {
        refresh_token: refresh,
      });
      const { access_token, refresh_token } = response.data.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      return access_token;
    } catch (error: any) {
      if ([401, 403].includes(error.response?.status)) {
        thunkAPI.dispatch(logout());
      }
      const msg = error.code === "ECONNABORTED"
        ? "Request timed out."
        : error.response?.data || "Refresh failed";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// Slice
const authentication = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      Object.assign(state, {
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        error: null,
      });
    },
    resetError(state) {
      state.error = null;
      state.refreshError = null;
    },
  },
  extraReducers: (builder) => {
    // Initialization
    builder.addCase(initializeAuth.fulfilled, (state) => {
      state.isInitialized = true;
    });
    builder.addCase(initializeAuth.rejected, (state) => {
      state.isInitialized = true;
    });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.error = null;
        state.isLoadingLogin = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.isLoadingLogin = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.isAuthenticated = false;
        state.isLoadingLogin = false;
      });

    // Verify Email
    builder
      .addCase(verifyEmail.fulfilled, (state, { payload }) => {
        state.accessToken = payload.access_token;
        state.refreshToken = payload.refresh_token;
        state.isAuthenticated = true;
      })
      .addCase(verifyEmail.rejected, (state, { payload }) => {
        state.error = payload;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.error = null;
        state.isLoadingRegister = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isRegister = true;
        state.isLoadingRegister = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.isRegister = false;
        state.isLoadingRegister = false;
      });

    // Get Account
    builder
      .addCase(getAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAccount.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getAccount.rejected, (state, action) => {
        state.error = action.payload;
        state.user = null;
        state.loading = false;
        state.isAuthenticated = false;
      });

    // Refresh Token
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.refreshError = action.payload;
        state.isAuthenticated = false;
      });

 
  },
});

export const { logout, resetError } = authentication.actions;
export default authentication.reducer;
