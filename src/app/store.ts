import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import countriesReducer from "../features/countries/countriesSlice";
import votingReducer from "../features/voting/votingSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    countries: countriesReducer,
    voting: votingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;