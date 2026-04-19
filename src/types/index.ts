export interface PooPin {
  id: string;
  latitude: number;
  longitude: number;
  createdAt: number; // Unix timestamp ms
  expiresAt: number; // Unix timestamp ms — createdAt + 48h
  deviceId: string;
  removalVotes: string[]; // array of deviceIds that voted to remove
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export type CardinalDirection =
  | 'ahead'
  | 'ahead-right'
  | 'right'
  | 'behind-right'
  | 'behind'
  | 'behind-left'
  | 'left'
  | 'ahead-left';
