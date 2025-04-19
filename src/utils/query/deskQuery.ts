import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import Toast from "react-native-toast-message";
import { DeskType, FlashCardType } from "@/src/types/desk.type";
import useAuthStore from "@/src/stores/authStore";
import { MultiFlashCardSchema } from "@/src/validation/form";

export const useGetAllDesk = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery<DeskType[]>({
    queryKey: ["allDesk", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Unauthorized access!!");

      const { data, error } = await supabase
        .from("desk")
        .select("*")
        .eq("creator_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        Toast.show({
          type: "error",
          text1: error.message || "Internal server error",
        });
        throw new Error(error.message || "Internal server error");
      }

      return data || [];
    },
    enabled: !!userId,
  });
};

export const useGetDeskCardByDeskId = (deskId: string) => {
  return useQuery<{
    desk: DeskType;
    cards: FlashCardType[];
  }>({
    queryKey: ["desk", deskId],
    queryFn: async () => {
      const { data: deskData, error: deskError } = await supabase
        .from("desk")
        .select("*")
        .eq("id", deskId)
        .single();

      if (deskError) throw new Error(deskError.message || "Failed to get desk");

      const { data: cardsData, error: cardsError } = await supabase
        .from("flash_cards")
        .select("*")
        .eq("desk_id", deskId);

      if (cardsError)
        throw new Error(cardsError.message || "Failed to get cards");

      return {
        desk: deskData,
        cards: cardsData || [],
      };
    },
    enabled: !!deskId,
  });
};

export const useCreateDeskAndCard = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (formData: MultiFlashCardSchema) => {
      const { subject, description, cards } = formData;

      const { data: deskData, error: deskError } = await supabase
        .from("desk")
        .insert({
          subject_name: subject,
          description,
          creator_id: userId,
        })
        .select("*")
        .single();

      if (deskError) {
        throw new Error(deskError.message || "Desk creation failed");
      }

      const deskId = deskData.id;

      const flashCardsToInsert = cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        desk_id: deskId,
      }));

      const { error: cardError } = await supabase
        .from("flash_cards")
        .insert(flashCardsToInsert);

      if (cardError) {
        throw new Error(cardError.message || "Failed to create flash cards");
      }

      return deskData as DeskType;
    },
  });
};
