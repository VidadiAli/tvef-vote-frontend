export interface Participant {
  _id: string;
  participantName: string;
  hasYoutubeLink: boolean,
  youtubeLink: string,
  semiFinal: string;
  edition: number;
  country: {
    _id: string;
    countryName: string;
    countryImageUrl: string;
  };
}