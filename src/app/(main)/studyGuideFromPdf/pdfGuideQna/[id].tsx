import { View, Text, FlatList } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { Chapter, QnA, StudyMaterialType } from "@/src/types/studyGuide.type";
import { SafeAreaView } from "react-native-safe-area-context";
import CardQnWithAns from "@/src/components/desk/CardQnWithAns";
import ListHeaderForQna from "@/src/components/desk/ListHeaderForQna";

const GuideQnaScreen = () => {
  const { id } = useLocalSearchParams();
  const studyGuideId = id as string;
  const queryClient = useQueryClient();

  const pdfStudyGuideQueryData = queryClient.getQueryData<StudyMaterialType>([
    "pdfGeneratedGuideById",
    studyGuideId,
  ]);
  
  if (!pdfStudyGuideQueryData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-xl">No data found</Text>
      </View>
    );
  }

  const extractQnA = pdfStudyGuideQueryData.chapters.reduce(
    (acc: QnA[], items: Chapter) => {
      const quiz = items.questions.map((item) => ({
        question: item.question,
        answer: item.answer,
      }));

      return [...acc, ...quiz];
    },
    []
  );

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={extractQnA}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={() => (
          <ListHeaderForQna
            extractQnA={extractQnA}
            studyGuideTitle={pdfStudyGuideQueryData.title}
            onPressBack={() => router.back()}
          />
        )}
        renderItem={({ item }) => (
          <View className="px-4 mt-4">
            <CardQnWithAns cardData={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
};

export default GuideQnaScreen;
