import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showResponse } from "../ui/uiSlice";
import type { SemiFinalType } from "../../types/common";
import { api } from "../../services/axios";

export interface TeleUser {
  _id: string;
  userName: string;
  edition: number;
  semiFinal: SemiFinalType;
}

interface TeleUsersState {
  users: TeleUser[];
  loading: boolean;
  createLoading: boolean;
}

const initialState: TeleUsersState = {
  users: [],
  loading: false,
  createLoading: false,
};

export const getTeleUsers = createAsyncThunk(
  "teleUsers/getTeleUsers",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/teleVotes/getTeleUsers");
      return res.data;
    } catch (error: any) {
      thunkAPI.dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: error?.response?.data?.message || "İstifadəçilər yüklənmədi",
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addTeleUser = createAsyncThunk(
  "teleUsers/addTeleUser",
  async (
    payload: { userName: string; semiFinal: SemiFinalType },
    thunkAPI
  ) => {
    try {
      const res = await api.post("/teleVotes/addTeleUser", {
        ...payload,
        edition: 11,
      });

      thunkAPI.dispatch(
        showResponse({
          open: true,
          type: "success",
          title: "Uğurlu",
          message: "İstifadəçi əlavə edildi",
        })
      );

      return res.data;
    } catch (error: any) {
      thunkAPI.dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: error?.response?.data?.message || "Əlavə edilə bilmədi",
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const teleUsersSlice = createSlice({
  name: "teleUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeleUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeleUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(addTeleUser.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(addTeleUser.fulfilled, (state, action) => {
        state.createLoading = false;
        state.users.unshift(action.payload);
      })
      .addCase(addTeleUser.rejected, (state) => {
        state.createLoading = false;
      });
  },
});

export default teleUsersSlice.reducer;