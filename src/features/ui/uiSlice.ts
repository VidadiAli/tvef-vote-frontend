import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ApiResponseState } from "../../types/common";

const initialState: ApiResponseState = {
  open: false,
  type: "info",
  title: "",
  message: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showResponse: (_, action: PayloadAction<ApiResponseState>) => action.payload,
    hideResponse: () => initialState,
  },
});

export const { showResponse, hideResponse } = uiSlice.actions;
export default uiSlice.reducer;