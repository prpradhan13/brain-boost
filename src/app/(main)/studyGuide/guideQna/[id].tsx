import { View, Text, FlatList } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { QnA, Section, StudyGuideType } from "@/src/types/studyGuide.type";
import { SafeAreaView } from "react-native-safe-area-context";
import CardQnWithAns from "@/src/components/desk/CardQnWithAns";
import ListHeaderForQna from "@/src/components/desk/ListHeaderForQna";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";

const GuideQnaScreen = () => {
  const { id } = useLocalSearchParams();
  const studyGuideId = Number(id);
  const queryClient = useQueryClient();

  const studyGuideQueryData = queryClient.getQueryData<StudyGuideType>([
    "aiGeneratedGuide",
    studyGuideId,
  ]);

  if (!studyGuideQueryData) {
    return (
      <LinearGradient
        colors={['#1a1a1a', '#2d1b69']}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center">
          <Feather name="alert-circle" size={48} color="#ef4444" />
          <Text className="text-red-400 text-lg font-medium mt-4">
            No data found
          </Text>
          <Text className="text-gray-400 text-base mt-2 text-center px-6">
            Please try again or go back to the study guide
          </Text>
        </View>
      </LinearGradient>
    );
  }

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
    <LinearGradient
      colors={['#1a1a1a', '#2d1b69']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <FlatList
          data={extractQnA}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={() => (
            <ListHeaderForQna
              extractQnA={extractQnA}
              studyGuideTitle={studyGuideQueryData.title}
              onPressBack={() => router.back()}
            />
          )}
          renderItem={({ item }) => (
            <View className="px-6 mt-4">
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                className="rounded-2xl overflow-hidden border border-white/20"
              >
                <CardQnWithAns cardData={item} />
              </LinearGradient>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-20"
          ItemSeparatorComponent={() => <View className="h-4" />}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default GuideQnaScreen;
