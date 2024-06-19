export interface Voting {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isApproved: boolean;
  isStarted: boolean;
  isFinished: boolean;
  contractAddress: string;
  organizer: string;
  status: boolean;
}
