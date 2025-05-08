import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
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
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient
      colors={['#1a1a1a', '#2d1b69']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 p-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => router.back()}
                className="bg-white/10 w-11 h-11 rounded-full items-center justify-center"
              >
                <Feather name="chevron-left" size={24} color="white" />
              </Pressable>
              <View className="flex-row items-center gap-4">
                <Pressable
                  onPress={handleCancel}
                  disabled={isPending}
                  className="bg-white/10 w-11 h-11 rounded-full items-center justify-center"
                >
                  <Feather name="x" size={24} color="white" />
                </Pressable>
                <Pressable
                  onPress={handleSubmit(handleSave)}
                  disabled={isPending}
                  className="bg-indigo-600 w-11 h-11 rounded-full items-center justify-center"
                >
                  {isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Feather name="check" size={24} color="white" />
                  )}
                </Pressable>
              </View>
            </View>

            <Text className="text-3xl font-bold mt-8 text-white">
              Create Flashcard
            </Text>
            <Text className="text-lg text-gray-300 mt-2 leading-6">
              Create flashcards to help you learn and memorize important concepts
            </Text>
          </View>

          <Controller
            control={control}
            name="subject"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="mt-8 text-base text-white bg-white/10 border border-white/20 rounded-xl px-4 py-4"
                placeholder="Enter subject name"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.subject && (
            <Text className="text-red-400 mt-1">{errors.subject.message}</Text>
          )}

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="mt-4 text-base text-white bg-white/10 border border-white/20 rounded-xl px-4 py-4"
                placeholder="Enter description (optional)"
                placeholderTextColor="#9ca3af"
                value={value ?? ""}
                onChangeText={onChange}
              />
            )}
          />
          {errors.description && (
            <Text className="text-red-400 mt-1">{errors.description.message}</Text>
          )}

          {fields.map((field, index) => (
            <View
              key={field.id}
              className="mt-6 bg-white/10 border border-white/20 rounded-2xl p-6 relative"
            >
              {fields.length > 1 && (
                <Pressable
                  className="absolute right-4 top-4 z-10 bg-white/10 p-2 rounded-full"
                  onPress={() => remove(index)}
                >
                  <Feather name="trash-2" size={18} color="#EF4444" />
                </Pressable>
              )}

              <Controller
                control={control}
                name={`cards.${index}.question`}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="text-base text-white bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                    placeholder="Enter your question"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.cards?.[index]?.question && (
                <Text className="text-red-400 mt-1">
                  {errors.cards[index]?.question?.message}
                </Text>
              )}

              <Controller
                control={control}
                name={`cards.${index}.answer`}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="text-base text-white bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-4"
                    placeholder="Enter your answer"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.cards?.[index]?.answer && (
                <Text className="text-red-400 mt-1">
                  {errors.cards[index]?.answer?.message}
                </Text>
              )}
            </View>
          ))}

          <Pressable
            className="bg-white/10 border border-white/20 mt-6 rounded-xl p-4 items-center flex-row justify-center gap-2"
            onPress={() => append({ question: "", answer: "" })}
          >
            <Feather name="plus" size={20} color="white" />
            <Text className="text-base text-white font-semibold">
              Add one more flashcard
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default createFlashCardModal;
