import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { StudyGuideType } from "@/src/types/studyGuide.type";
import { Section } from "@/src/types/studyGuide.type";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import FlashCard from "@/src/components/desk/FlashCard";
import CardQnWithAns from "@/src/components/desk/CardQnWithAns";

type QnA = {
  question: string;
  answer: string;
};

const GuideQnaScreen = () => {
  const { id } = useLocalSearchParams();
  const guideId = Number(id);
  const queryClient = useQueryClient();

  const studyGuideQueryData = queryClient.getQueryData<StudyGuideType>([
    "aiGeneratedGuide",
    guideId,
  ]);

  if (!studyGuideQueryData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-xl">No data found</Text>
      </View>
    );
  }

  const handlePressBack = () => {
    router.back();
  };

  const extractQnA = studyGuideQueryData.sections.reduce(
    (acc: QnA[], items: Section) => {
      const quiz = items.quiz.map((item) => ({
        question: item.question,
        answer: item.answer,
      }));

      return [...acc, ...quiz];
    },
    []
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="p-6 flex-row justify-between">
        <TouchableOpacity
          className="bg-[#fff] rounded-xl w-11 h-11 justify-center items-center"
          onPress={handlePressBack}
        >
          <Feather name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="px-6">
        <Text className="text-white text-3xl font-semibold">
          {studyGuideQueryData.title}
        </Text>
      </View>

      <View className="mt-4">
        <FlatList
          data={extractQnA}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <FlashCard flashCardItem={item} />}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-6 gap-4"
        />
      </View>
      <View className="p-6">
        <Text className="text-white font-medium text-lg">All Cards</Text>

        <FlatList
          data={extractQnA}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <CardQnWithAns cardData={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-4 mt-4"
        />
      </View>
    </SafeAreaView>
  );
};

export default GuideQnaScreen;
