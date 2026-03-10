import { createSlice } from "@reduxjs/toolkit";
import type { SemiFinalType } from "../../types/common";

interface VotingState {
  selectedSemiFinal: SemiFinalType;
  edition: number;
  selectedVotes: Record<string, number>;
}

const initialState: VotingState = {
  selectedSemiFinal: "s1",
  edition: 11,
  selectedVotes: {},
};

const votingSlice = createSlice({
  name: "voting",
  initialState,
  reducers: {
    setSelectedSemiFinal: (state, action) => {
      state.selectedSemiFinal = action.payload;
    },
    setVotePoint: (state, action) => {
      const { participantId, points } = action.payload;
      state.selectedVotes[participantId] = points;
    },
    clearVotes: (state) => {
      state.selectedVotes = {};
    },
  },
});

export const { setSelectedSemiFinal, setVotePoint, clearVotes } =
  votingSlice.actions;

export default votingSlice.reducer;