import useAuthStore from "@/src/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { NotesType } from "@/src/types/notes.type";


export const useGetNotes = () => {
    const { user } = useAuthStore();
    const userId = user?.id;

    return useQuery<NotesType[]>({
        queryKey: ["notes"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("notes")
                .select("*")
                .eq("creator_id", userId)
                .order("created_at", { ascending: false });

            if (error) throw new Error(error.message);

            return data || [];
        },
        enabled: !!userId,
    })
}