import { Mood } from '../types';

export const moods: Mood[] = [
  {
    emoji: '😊',
    label: 'Happy',
    description: 'Feeling joyful and content',
    songIds: ['1', '4', '8']
  },
  {
    emoji: '😔',
    label: 'Sad',
    description: 'Feeling down or melancholic',
    songIds: ['3', '6']
  },
  {
    emoji: '😤',
    label: 'Angry',
    description: 'Feeling frustrated or upset',
    songIds: ['2', '7']
  },
  {
    emoji: '😌',
    label: 'Relaxed',
    description: 'Feeling calm and peaceful',
    songIds: ['5', '3']
  },
  {
    emoji: '🥳',
    label: 'Excited',
    description: 'Feeling energetic and enthusiastic',
    songIds: ['4', '8', '2']
  },
  {
    emoji: '😴',
    label: 'Tired',
    description: 'Feeling sleepy or low energy',
    songIds: ['3', '5']
  },
  {
    emoji: '🥺',
    label: 'Sentimental',
    description: 'Feeling nostalgic or emotional',
    songIds: ['6', '1']
  }
];