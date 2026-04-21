export interface PooPin {
  id: string;
  latitude: number;
  longitude: number;
  createdAt: number; // Unix timestamp ms
  expiresAt: number; // Unix timestamp ms — createdAt + 48h
  deviceId: string;
  removalVotes: string[]; // array of deviceIds that voted to remove
  /** Danger level 1-5. 1 = tiny, 5 = enormous. Legacy pins may not have it. */
  level?: number;
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
