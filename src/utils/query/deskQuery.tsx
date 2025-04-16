import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import Toast from "react-native-toast-message";
import { DeskType } from "@/src/types/desk.types";

export const useGetAllDesk = (userId: string) => {
    return useQuery<DeskType[]>({
        queryKey: ["allDesk", userId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("desk")
            .select("*")
            .eq("creator_id", userId)

            if (error) {
                Toast.show({
                    type: "error",
                    text1: error.message || "Internal server error"
                })
                throw new Error(error.message || "Internal server error")
            }

            return data || [];
        },
        enabled: !!userId
    });
}