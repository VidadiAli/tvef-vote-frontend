import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/axios";
import type { Country } from "../../types/country";

interface CountriesState {
  items: Country[];
  loading: boolean;
  selectedCountryId: string;
}

const initialState: CountriesState = {
  items: [],
  loading: false,
  selectedCountryId: "",
};

export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async () => {
    const res = await api.get<Country[]>("/country/getAllCountries");
    return res.data;
  }
);

const countriesSlice = createSlice({
  name: "countries",
  initialState,
  reducers: {
    setSelectedCountryId: (state, action) => {
      state.selectedCountryId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCountries.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSelectedCountryId } = countriesSlice.actions;
export default countriesSlice.reducer;