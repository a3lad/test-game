export type GameState = 'start' | 'playing' | 'win' | 'lose';
export type Location = 'coffee' | 'grocery' | 'bookstore' | 'flower';

export interface WordFragment {
  id: string;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  isTarget: boolean;
  isInterruption: boolean;
}

export interface Level {
  prompt: string;
  targetSentence: string[];
  timeLimit: number;
  location: Location;
}

export const LEVELS: Level[] = [
  {
    prompt: "What can I get you?",
    targetSentence: ["I", "would", "like", "a", "large", "latte"],
    timeLimit: 30,
    location: 'coffee',
  },
  {
    prompt: "Anything else with that?",
    targetSentence: ["No", "thank", "you", "that", "is", "all"],
    timeLimit: 25,
    location: 'coffee',
  },
  {
    prompt: "Paper or plastic?",
    targetSentence: ["Paper", "please", "it", "is", "better"],
    timeLimit: 25,
    location: 'grocery',
  },
  {
    prompt: "Would you like your receipt?",
    targetSentence: ["No", "thanks", "I", "do", "not", "need", "it"],
    timeLimit: 15,
    location: 'grocery',
  },
  {
    prompt: "Are you looking for a specific genre?",
    targetSentence: ["I", "want", "a", "mystery", "novel", "please"],
    timeLimit: 25,
    location: 'bookstore',
  },
  {
    prompt: "We have that in paperback or hardcover.",
    targetSentence: ["I", "will", "take", "the", "paperback", "copy"],
    timeLimit: 20,
    location: 'bookstore',
  },
  {
    prompt: "What kind of flowers are you looking for?",
    targetSentence: ["I", "would", "like", "a", "dozen", "red", "roses"],
    timeLimit: 25,
    location: 'flower',
  },
  {
    prompt: "Would you like some baby's breath with that?",
    targetSentence: ["Yes", "that", "would", "look", "very", "nice"],
    timeLimit: 20,
    location: 'flower',
  }
];
