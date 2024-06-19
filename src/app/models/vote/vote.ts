export interface Vote {
  _id: string;
  voter: string;
  optionNumber: number;
  votingProcess: string;
  timestamp: Date;
}
