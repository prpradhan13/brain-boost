import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateDeskAndCard } from "@/src/utils/query/deskQuery";
import {
  multiFlashCardSchema,
  MultiFlashCardSchema,
} from "@/src/validation/form";
import { useQueryClient } from "@tanstack/react-query";
import { DeskType } from "@/src/types/desk.type";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "@/src/stores/authStore";

const createFlashCardModal = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MultiFlashCardSchema>({
    resolver: zodResolver(multiFlashCardSchema),
    defaultValues: {
      cards: [{ question: "", answer: "" }],
    },
  });
  const { mutate, isPending } = useCreateDeskAndCard();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards",
  });

  const handleCancel = () => {
    reset();
  };

  const handleSave = (data: MultiFlashCardSchema) => {
    mutate(data, {
      onSuccess: (newDesk) => {
        queryClient.setQueryData(["allDesk", user?.id], (old: DeskType[]) => {
          return old ? [newDesk, ...old] : [newDesk];
        });
        reset();
        router.back();
      },
      onError: (error) => {
        console.error("Error creating desk and cards:", error);
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 p-6">
      <ScrollView>
        <View>
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="bg-[#fff] w-11 h-11 rounded-full items-center justify-center"
            >
              <Feather name="chevron-left" size={24} color="black" />
            </Pressable>
            <View className="flex-row items-center gap-6">
              <Pressable
                onPress={handleCancel}
                disabled={isPending}
                className="bg-[#fff] w-11 h-11 rounded-xl items-center justify-center"
              >
                <Feather name="x" size={24} color="#000" />
              </Pressable>
              <Pressable
                onPress={handleSubmit(handleSave)}
                disabled={isPending}
                className="bg-[#fff] w-11 h-11 rounded-xl items-center justify-center"
              >
                {isPending ? (
                  <Feather name="loader" size={24} color="#000" />
                ) : (
                  <Feather name="check" size={24} color="#000" />
                )}
              </Pressable>
            </View>
          </View>

          <Text className="text-2xl font-bold mt-6 text-white">
            Create Flashcard
          </Text>
          <Text className="text-base text-[#A1A1AA] mt-2">
            Create flashcards to help you learn
          </Text>
        </View>

        <Controller
          control={control}
          name="subject"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mt-6 text-base text-white border-b border-[#A1A1AA] pb-2"
              placeholder="Enter subject name"
              placeholderTextColor="#A1A1AA"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.subject && (
          <Text className="text-red-500">{errors.subject.message}</Text>
        )}

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mt-6 text-base text-white border-b border-[#A1A1AA] pb-2"
              placeholder="Enter description (optional)"
              placeholderTextColor="#A1A1AA"
              value={value ?? ""}
              onChangeText={onChange}
            />
          )}
        />
        {errors.description && (
          <Text className="text-red-500">{errors.description.message}</Text>
        )}

        {fields.map((field, index) => (
          <View
            key={field.id}
            className="mt-6 bg-[#212121] rounded-2xl p-6 relative"
          >
            {fields.length > 1 && (
              <Pressable
                className="absolute right-3 top-3 z-10"
                onPress={() => remove(index)}
              >
                <Feather name="trash-2" size={20} color="#EF4444" />
              </Pressable>
            )}

            <Controller
              control={control}
              name={`cards.${index}.question`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="text-base text-white border-b border-[#A1A1AA] pb-2"
                  placeholder="Enter your question"
                  placeholderTextColor="#A1A1AA"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.cards?.[index]?.question && (
              <Text className="text-red-500">
                {errors.cards[index]?.question?.message}
              </Text>
            )}

            <Controller
              control={control}
              name={`cards.${index}.answer`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="text-base text-white border-b border-[#A1A1AA] pb-2 mt-3"
                  placeholder="Enter your answer"
                  placeholderTextColor="#A1A1AA"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.cards?.[index]?.answer && (
              <Text className="text-red-500">
                {errors.cards[index]?.answer?.message}
              </Text>
            )}
          </View>
        ))}

        <Pressable
          className="bg-[#333] mt-6 rounded-full p-4 items-center"
          onPress={() => append({ question: "", answer: "" })}
        >
          <Text className="text-base text-white font-semibold">
            Add one more flashcard
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default createFlashCardModal;
