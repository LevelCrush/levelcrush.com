export interface LFGActivity {
  activity: string;
  startTime: number;
  joinID: string;
  description: string;
  amountNeeded: number;
  amountJoined: number;
  whoJoined: string[];
  metadata?: { [key: string]: unknown };
}

export default LFGActivity;
