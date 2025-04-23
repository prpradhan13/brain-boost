export type Section = {
  title: string;
  summary: string;
  key_points: string[];
  quiz: QuizQuestion[];
};

export type QuizQuestion = {
  question: string;
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

export type PDFDocumentType = {
  id: number;
  created_at: string;
  created_by: string;
  name: string;
  storage_object_id: string;
}

export type Chapter = {
  title: string;
  summary: string;
  concepts: Concept[];
  important_points: string[];
  questions: Question[];
};

type Concept = {
  term: string;
  definition: string;
  example: string;
};

type Question = {
  question: string;
  answer: string;
};

type GlossaryEntry = {
  term: string;
  definition: string;
};

type RecommendedReading = {
  title: string;
  type: "article";
  url: string;
};

export type StudyMaterialType = {
  title: string;
  chapters: Chapter[];
  glossary: GlossaryEntry[];
  recommended_reading: RecommendedReading[];
};

export type GeneratedPDFType =  {
  id: number;
  document_id: string;
  content: StudyMaterialType;
  created_at: string;
  user_id: string;
}

export type QnA = {
  question: string;
  answer: string;
};