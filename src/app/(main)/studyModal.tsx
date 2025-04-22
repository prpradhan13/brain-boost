import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
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
          type: "application/pdf",
          copyToCacheDirectory: false,
          multiple: false,
        });

      if (result.canceled) {
        alert("File selection cancelled");
        return;
      }

      const pickedFile = result.assets[0];
      const newPath = `${FileSystem.cacheDirectory}${pickedFile.name}`;

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
    <SafeAreaView className="flex-1 p-6">
      <View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="rounded-lg bg-white w-11 h-11 justify-center items-center"
        >
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <View className="mt-10">
          <Text className="text-4xl font-bold text-white">
            Create Study Guide
          </Text>
          <Text className="text-lg text-gray-500 mt-2">
            Enter a subject you'd like to study. We'll build a personalized
            guide for you.
          </Text>
        </View>
      </View>

      <View className="gap-4 mt-10">
        <Text className="text-lg text-[#fff] font-medium">Subject Name</Text>
        <Controller
          control={control}
          name="subjectName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="e.g. Algebra, WW2, Gravity"
              placeholderTextColor="#c2c2c2"
              className="border border-gray-300 rounded-xl px-4 py-3 text-base text-white"
            />
          )}
        />
        {errors.subjectName && (
          <Text className="text-red-500 text-sm">
            {errors.subjectName.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isPending || pdfFileLoading || filePath !== ""}
          className={`bg-indigo-600 rounded-xl py-4 ${
            isPending || filePath !== "" ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isPending ? "Generating..." : "Generate Guide"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-[#c2c2c2] text-center text-lg font-semibold my-4">
        OR
      </Text>

      <View className="w-full">
        <View className="flex-row gap-4">
          <Pressable
            disabled={pdfFileLoading || isPending}
            onPress={handlePickFile}
            className="w-1/2 bg-[#222222] h-32 rounded-xl items-center justify-center gap-2"
          >
            <Feather name="plus" size={24} color="#fff" />
            <Text className="text-lg text-[#fff] font-semibold">
              Upload PDF
            </Text>
          </Pressable>
          <Pressable className="w-1/2 bg-[#222222] h-32 rounded-xl items-center justify-center gap-2">
            <Feather name="plus" size={24} color="#fff" />
            <Text className="text-lg text-[#fff] font-semibold">
              Upload Image
            </Text>
          </Pressable>
        </View>

        {fileName && (
          <View className="bg-[#212121] p-2 rounded-xl w-full mt-4">
            <Text className="text-lg font-medium text-white">{fileName}</Text>
          </View>
        )}

        {filePath && (
          <Pressable
            className={`bg-indigo-600 rounded-xl py-4 mt-4 ${
              pdfFileLoading ? "opacity-50" : ""
            }`}
            onPress={handleGenerate}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Generate Guide
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default studyModal;
