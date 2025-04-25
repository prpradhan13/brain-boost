import useAuthStore from "@/src/stores/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { NotesType } from "@/src/types/notes.type";
import { NoteSchema } from "@/src/validation/form";


export const useGetNotes = () => {
    const { user } = useAuthStore();
    const userId = user?.id;

    return useQuery<NotesType[]>({
        queryKey: ["notes", userId],
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
};

export const useCreateNote = () => {
    const { user } = useAuthStore();
    const userId = user?.id;

    return useMutation({
        mutationFn: async (note: NoteSchema) => {
            if (!userId) throw new Error("User not found");
            const { title, note: noteContent } = note;
            if (!noteContent) throw new Error("Note content is required");

            const { data, error } = await supabase
                .from("notes")
                .insert({
                    title: title || null,
                    note: noteContent,
                    creator_id: userId,
                })
                .select("*")
                .single();

            if (error) throw new Error(error.message);
            
            return data;
        }
    })
}