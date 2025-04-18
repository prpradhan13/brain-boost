import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useCreateGuideByAI } from "@/src/utils/query/aiGeneratedQuery";
import { Controller, useForm } from "react-hook-form";
import { SubjectForm, subjectSchema } from "@/src/validation/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";

const studyModal = () => {
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
          disabled={isPending}
          className={`bg-indigo-600 rounded-xl py-4 ${
            isPending ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isPending ? "Generating..." : "Generate Guide"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default studyModal;
