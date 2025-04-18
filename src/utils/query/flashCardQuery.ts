import { useQuery } from "@tanstack/react-query"
import { supabase } from "../lib/supabase"
import Toast from "react-native-toast-message";
import { FlashCardType } from "@/src/types/desk.type";


export const useGetFlashCardByDeskId = (deskId: string) => {
    return useQuery<FlashCardType[]>({
        queryKey: ["flashCardOfDesk", deskId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("flash_card")
                .select("*, desk: desk_id(subject_name, description)")
                .eq("desk_id", deskId);

            
            if (error) {
                Toast.show({
                    type: "error",
                    text1: error.message || "Server error"
                })
                throw new Error(error.message)
            };

            return data || [];
        },
        enabled: !!deskId
    })
}