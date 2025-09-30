
export enum Speaker {
  A = 'A',
  B = 'B',
}

export interface Message {
  speaker: Speaker;
  text: string;
}
