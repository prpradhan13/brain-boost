export type DeskType = {
    id: string;
    subject_name: string;
    description: string;
    created_at: string;
    creator_id: string;
}

export type FlashCardType = {
    id: string;
    question: string;
    answer: string;
    createdA_at: string;
    desk_id: string
}