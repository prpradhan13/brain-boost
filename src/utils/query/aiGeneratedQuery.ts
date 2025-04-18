import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import useAuthStore from "@/src/stores/authStore";

export const useCreateGuideByAI = () => {
  return useMutation({
    mutationFn: async ({ subjectName }: { subjectName: string }) => {
      const { error } = await supabase.functions.invoke("ai-generated-guide", {
        body: { subjectName },
      });

      if (error) {
        throw new Error(error.message);
      }
    },
  });
};

export const useGetAIGeneratedGuide = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: ["aiGeneratedGuide", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Unauthorized access!!");
      const { data, error } = await supabase
        .from("ai_generated_guide")
        .select("*")
        .eq("user_id", userId);

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!userId,
  });
};
