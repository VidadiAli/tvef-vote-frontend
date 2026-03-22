import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import countriesReducer from "../features/countries/countriesSlice";
import votingReducer from "../features/voting/votingSlice";
import teleUsersReducer from "../features/teleUsers/teleUsersSlice";
import teleVotesReducer from "../features/teleVotes/teleVotesSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    countries: countriesReducer,
    voting: votingReducer,
    teleUsers: teleUsersReducer,
    teleVotes: teleVotesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;