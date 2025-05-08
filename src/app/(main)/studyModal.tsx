import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useCreateGuideByAI,
  usePDFUpload,
} from "@/src/utils/query/aiGeneratedQuery";
import { Controller, useForm } from "react-hook-form";
import { SubjectForm, subjectSchema } from "@/src/validation/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const studyModal = () => {
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectForm>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      subjectName: "",
    },
  });

  const { mutate, isPending } = useCreateGuideByAI();
  const { mutate: pdfFileMutate, isPending: pdfFileLoading } = usePDFUpload();

  const onSubmit = (data: SubjectForm) => {
    mutate(
      { subjectName: data.subjectName },
      {
        onSuccess: (data) => {
          router.back();
          Toast.show({
            type: "success",
            text1: "Successfuly created",
          });
        },
        onError: (err) => {
          console.error("Failed:", err);
          Toast.show({
            type: "error",
            text1: err.message || "Something went wrong!",
          });
        },
      }
    );
  };

  const handlePickFile = async () => {
    try {
      const result: DocumentPicker.DocumentPickerResult =
        await DocumentPicker.getDocumentAsync({
          type: "text/plain",
          copyToCacheDirectory: false,
          multiple: false,
        });

      if (result.canceled) {
        alert("File selection cancelled");
        return;
      }

      const pickedFile = result.assets[0];
      const newPath = `${FileSystem.cacheDirectory}${pickedFile.name}`;
      const fileType = pickedFile.mimeType;
      const fileSize = pickedFile.size;

      if (fileType !== "text/plain") {
        alert("Only .txt files are allowed");
        return;
      }

      if (fileSize && fileSize > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit");
        return;
      }
      
      await FileSystem.copyAsync({
        from: pickedFile.uri,
        to: newPath,
      });

      setFileName(pickedFile.name);
      setFilePath(newPath);
    } catch (err) {
      console.log("Error picking file:", err);
    }
  };

  const handleGenerate = () => {
    if (!filePath && !fileName) {
      alert("Please select a file first");
      return;
    }

    const fileInfo = {
      fileName,
      filePath,
    };

    pdfFileMutate(
      { fileInfo },
      {
        onSuccess: () => {
          alert("File uploaded successfully");
          setFileName("");
          setFilePath("");
        },
        onError: (error) => {
          setFileName("");
          setFilePath("");
          alert("Failed to upload file");
          console.error("Error uploading file:", error);
        },
      }
    );
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d1b69']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 p-6">
        <View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-full bg-white/10 w-11 h-11 justify-center items-center"
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>

          <View className="mt-8">
            <Text className="text-4xl font-bold text-white">
              Create Study Guide
            </Text>
            <Text className="text-lg text-gray-300 mt-2 leading-6">
              Enter a subject you'd like to study. We'll build a personalized
              guide for you.
            </Text>
          </View>
        </View>

        <View className="gap-4 mt-8">
          <Text className="text-lg text-white font-semibold">Subject Name</Text>
          <Controller
            control={control}
            name="subjectName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="e.g. Algebra, WW2, Gravity"
                placeholderTextColor="#9ca3af"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-base text-white"
              />
            )}
          />
          {errors.subjectName && (
            <Text className="text-red-400 text-sm">
              {errors.subjectName.message}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isPending || pdfFileLoading || filePath !== ""}
            className={`bg-indigo-600 rounded-xl py-4 mt-2 ${
              isPending || filePath !== "" ? "opacity-50" : ""
            }`}
          >
            {isPending ? (
              <View className="flex-row items-center justify-center gap-2">
                <ActivityIndicator color="white" />
                <Text className="text-white text-center font-semibold text-lg">
                  Generating...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Generate Guide
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-4 my-6">
          <View className="flex-1 h-[1px] bg-white/20" />
          <Text className="text-gray-400 text-base font-medium">OR</Text>
          <View className="flex-1 h-[1px] bg-white/20" />
        </View>

        <View className="w-full">
          <View className="flex-row gap-4">
            <Pressable
              disabled={pdfFileLoading || isPending}
              onPress={handlePickFile}
              className="w-1/2 bg-white/10 border border-white/20 h-32 rounded-xl items-center justify-center gap-2"
            >
              <Feather name="file-text" size={28} color="#fff" />
              <Text className="text-lg text-white font-semibold">
                Upload .txt
              </Text>
            </Pressable>
            <Pressable className="w-1/2 bg-white/10 border border-white/20 h-32 rounded-xl items-center justify-center gap-2">
              <Feather name="image" size={28} color="#fff" />
              <Text className="text-lg text-white font-semibold">
                Upload Image
              </Text>
            </Pressable>
          </View>

          {fileName && (
            <View className="bg-white/10 border border-white/20 p-4 rounded-xl w-full mt-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Feather name="file-text" size={20} color="#fff" />
                <Text className="text-base font-medium text-white">{fileName}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                setFileName("");
                setFilePath("");
              }}>
                <Feather name="x" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {filePath && (
            <Pressable
              className={`bg-indigo-600 rounded-xl py-4 mt-4 ${
                pdfFileLoading ? "opacity-50" : ""
              }`}
              onPress={handleGenerate}
            >
              {pdfFileLoading ? (
                <View className="flex-row items-center justify-center gap-2">
                  <ActivityIndicator color="white" />
                  <Text className="text-white text-center font-semibold text-lg">
                    Processing...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Generate Guide
                </Text>
              )}
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default studyModal;
