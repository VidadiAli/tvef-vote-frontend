import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/axios";

export interface AdminProfile {
  _id: string;
  userName: string;
  email?: string;
  role?: string;
}

interface AdminState {
  profile: AdminProfile | null;
  loading: boolean;
  checked: boolean;
}

const initialState: AdminState = {
  profile: null,
  loading: false,
  checked: false,
};

export const getMyProfile = createAsyncThunk<
  AdminProfile,
  void,
  { rejectValue: string }
>("admin/getMyProfile", async (_, thunkAPI) => {
  try {
    const res = await api.get("/admin/getMyProfile");
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Profil gətirilə bilmədi"
    );
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminProfile: (state) => {
      state.profile = null;
      state.checked = true;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyProfile.pending, (state) => {
        state.loading = true;
        state.checked = false;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.profile = action.payload;
      })
      .addCase(getMyProfile.rejected, (state) => {
        state.loading = false;
        state.checked = true;
        state.profile = null;
      });
  },
});

export const { clearAdminProfile } = adminSlice.actions;
export default adminSlice.reducer;