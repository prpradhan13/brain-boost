export type Section = {
  title: string;
  summary: string;
  key_points: string[];
  quiz: QuizQuestion[];
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type Resource = {
  type: "video" | "article" | "book";
  title: string;
  url: string;
};

export type StudyGuideType = {
  title: string;
  summary: string;
  sections: Section[];
  resources: Resource[];
};

export type StudyGuideCardType = {
  id: number;
  created_at: string;
  user_id: string;
  subject_name: string;
}
