export type Player = {
  id: string;
  clientId: string;
  connected: boolean;
  username: string;
  avatar?: string;
  points: number;
};

export type Answer = {
  clientId: string;
  answerId: number;
  points: number;
  timestamp: number;
};

export type Quizz = {
  subject: string;
  questions: {
    question: string;
    image?: string;
    video?: string;
    audio?: string;
    answers: string[];
    solution: number;
    cooldown: number;
    time: number;
  }[];
};

export type QuizzWithId = Quizz & { id: string };

export type GameUpdateQuestion = {
  current: number;
  total: number;
};
