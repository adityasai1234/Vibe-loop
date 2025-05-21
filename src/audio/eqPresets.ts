export const EQ_BANDS = [60, 170, 350, 1000, 3500, 10000] as const;

export const PRESETS = {
  Flat:        [ 0,  0,  0,  0,  0,  0 ],
  "Bass Boost":[ 6,  5,  3,  0, -2, -4 ],
  Podcast:     [-2, -1,  0,  2,  3,  4 ],
  Classical:   [ 0,  0,  1,  3,  2,  1 ],
} as const;
export type EqPreset = keyof typeof PRESETS;