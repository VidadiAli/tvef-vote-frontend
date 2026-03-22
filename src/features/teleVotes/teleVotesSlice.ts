import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showResponse } from "../ui/uiSlice";
import type { SemiFinalType } from "../../types/common";
import { api } from "../../services/axios";

export interface CountryItem {
  _id: string;
  countryName: string;
}

export interface TeleUserItem {
  _id: string;
  userName: string;
  edition: number;
  semiFinal: SemiFinalType;
}

export interface TeleVoteItem {
  teleCountry: string;
  voteCount: number;
}

interface AddTeleVotePayload {
  teleUser: string;
  teleVotes: TeleVoteItem[];
  edition: number;
  semiFinal: SemiFinalType;
}

interface TeleVotesState {
  countries: CountryItem[];
  teleUsers: TeleUserItem[];
  loadingCountries: boolean;
  loadingTeleUsers: boolean;
  createLoading: boolean;
}

const initialState: TeleVotesState = {
  countries: [],
  teleUsers: [],
  loadingCountries: false,
  loadingTeleUsers: false,
  createLoading: false,
};

export const getAllCountries = createAsyncThunk(
  "teleVotes/getAllCountries",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/country/getAllCountries");
      console.log(res.data)
      return res.data;
    } catch (error: any) {
      thunkAPI.dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: error?.response?.data?.message || "Ölkələr yüklənmədi",
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getTeleUsersForVotes = createAsyncThunk(
  "teleVotes/getTeleUsersForVotes",
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
          message: error?.response?.data?.message || "Tele userlər yüklənmədi",
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addTeleVote = createAsyncThunk(
  "teleVotes/addTeleVote",
  async (payload: AddTeleVotePayload, thunkAPI) => {
    try {
      const res = await api.post("/teleVotes/addTeleVote", payload);

      thunkAPI.dispatch(
        showResponse({
          open: true,
          type: "success",
          title: "Uğurlu",
          message: "Tele vote əlavə edildi",
        })
      );

      return res.data;
    } catch (error: any) {
      thunkAPI.dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: error?.response?.data?.message || "Tele vote əlavə olunmadı",
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const teleVotesSlice = createSlice({
  name: "teleVotes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCountries.pending, (state) => {
        state.loadingCountries = true;
      })
      .addCase(getAllCountries.fulfilled, (state, action) => {
        state.loadingCountries = false;
        state.countries = action.payload;
      })
      .addCase(getAllCountries.rejected, (state) => {
        state.loadingCountries = false;
      })
      .addCase(getTeleUsersForVotes.pending, (state) => {
        state.loadingTeleUsers = true;
      })
      .addCase(getTeleUsersForVotes.fulfilled, (state, action) => {
        state.loadingTeleUsers = false;
        state.teleUsers = action.payload;
      })
      .addCase(getTeleUsersForVotes.rejected, (state) => {
        state.loadingTeleUsers = false;
      })
      .addCase(addTeleVote.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(addTeleVote.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(addTeleVote.rejected, (state) => {
        state.createLoading = false;
      });
  },
});

export default teleVotesSlice.reducer;