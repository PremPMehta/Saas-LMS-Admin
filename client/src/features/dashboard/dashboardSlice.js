import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header when implementing
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  kpis: {
    totalAcademies: 0,
    totalPlans: 0,
    totalUsers: 0,
    coursesOffered: '0',
  },
  academies: [],
  plans: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    updateKPI: (state, action) => {
      const { key, value } = action.payload;
      if (state.kpis.hasOwnProperty(key)) {
        state.kpis[key] = value;
      }
    },
    addAcademy: (state, action) => {
      state.academies.unshift(action.payload);
      state.kpis.totalAcademies += 1;
    },
    updateAcademy: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.academies.findIndex(academy => academy.id === id);
      if (index !== -1) {
        state.academies[index] = { ...state.academies[index], ...updates };
      }
    },
    removeAcademy: (state, action) => {
      const id = action.payload;
      state.academies = state.academies.filter(academy => academy.id !== id);
      state.kpis.totalAcademies = Math.max(0, state.kpis.totalAcademies - 1);
    },
    addPlan: (state, action) => {
      state.plans.push(action.payload);
      state.kpis.totalPlans += 1;
    },
    updatePlan: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.plans.findIndex(plan => plan.id === id);
      if (index !== -1) {
        state.plans[index] = { ...state.plans[index], ...updates };
      }
    },
    removePlan: (state, action) => {
      const id = action.payload;
      state.plans = state.plans.filter(plan => plan.id !== id);
      state.kpis.totalPlans = Math.max(0, state.kpis.totalPlans - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpis = action.payload.kpis || state.kpis;
        state.academies = action.payload.academies || state.academies;
        state.plans = action.payload.plans || state.plans;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch dashboard data';
      });
  },
});

// Export actions
export const {
  clearDashboardError,
  updateKPI,
  addAcademy,
  updateAcademy,
  removeAcademy,
  addPlan,
  updatePlan,
  removePlan,
} = dashboardSlice.actions;

// Export selectors
export const selectDashboardData = (state) => state.dashboard;
export const selectKPIs = (state) => state.dashboard.kpis;
export const selectAcademies = (state) => state.dashboard.academies;
export const selectPlans = (state) => state.dashboard.plans;
export const selectDashboardLoading = (state) => state.dashboard.isLoading;
export const selectDashboardError = (state) => state.dashboard.error;
export const selectLastFetched = (state) => state.dashboard.lastFetched;

// Export reducer
export default dashboardSlice.reducer; 