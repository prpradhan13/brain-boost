import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import useAuthStore from "@/src/stores/authStore";
import {
  StudyGuideCardType,
  StudyGuideType,
} from "@/src/types/studyGuide.type";
import * as Crypto from 'expo-crypto';
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

interface FileInfo {
  fileName: string;
  filePath: string;
}

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

  return useQuery<StudyGuideCardType[]>({
    queryKey: ["aiGeneratedGuide", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Unauthorized access!!");
      const { data, error } = await supabase
        .from("ai_generated_guide")
        .select("id, created_at, user_id, subject_name")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      return data || [];
    },
    enabled: !!userId,
  });
};

export const useGetAIGeneratedGuideById = (studyGuideId: number) => {
  return useQuery<StudyGuideType>({
    queryKey: ["aiGeneratedGuide", studyGuideId],
    queryFn: async () => {
      if (!studyGuideId)
        throw new Error("Cannot find study guide, Id is missing!!");
      const { data, error } = await supabase
        .from("ai_generated_guide")
        .select("study_guide")
        .eq("id", studyGuideId)
        .single();

      if (error) throw new Error(error.message);

      return data.study_guide;
    },
    enabled: !!studyGuideId,
  });
};

export const usePDFUpload = () => {
  return useMutation({
    mutationFn: async ({ fileInfo }: { fileInfo: FileInfo }) => {
      const { fileName, filePath } = fileInfo;

      try {
        const base64 = await FileSystem.readAsStringAsync(filePath, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const { error } = await supabase.storage
          .from("files")
          .upload(`${Crypto.randomUUID()}/${fileName}`, decode(base64), {
            contentType: "application/pdf",
            upsert: false,
          });

        if (error) {
          console.error("Supabase upload error:", error.message);
          throw new Error("Failed to upload file");
        }
      } catch (err) {
        console.error("Upload error:", err);
        throw new Error("Failed to upload file");
      }
    }
  });
};
