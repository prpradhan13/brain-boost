import { View, Text, ActivityIndicator, ScrollView, Linking } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useGetPDFGeneratedGuideById } from "@/src/utils/query/aiGeneratedQuery";
import { SafeAreaView } from "react-native-safe-area-context";

const StudyGuideFromPdf = () => {
  const { id } = useLocalSearchParams();
  const { data: guide, isLoading } = useGetPDFGeneratedGuideById(id as string);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading Guide...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Text className="text-white text-4xl font-bold px-4 pt-6">
          {guide?.title}
        </Text>

        {guide?.chapters?.map((chapter, index) => (
          <View
            key={index}
            className="bg-[#1e1e1e] rounded-2xl p-5 mt-6 shadow-lg"
          >
            <Text className="text-white text-2xl font-bold mb-2">
              {chapter.title}
            </Text>
            <Text className="text-[#c2c2c2] text-base mb-4">
              {chapter.summary}
            </Text>

            <Text className="text-xl text-white font-semibold mb-2">
              🔑 Key Concepts
            </Text>
            {chapter.concepts?.map((concept, idx) => (
              <View key={idx} className="mb-3">
                <Text className="text-lg text-white font-bold">
                  {concept.term}
                </Text>
                <Text className="text-[#c2c2c2] text-base">
                  {concept.definition}
                </Text>
                <Text className="text-[#9e9e9e] text-sm italic mt-1">
                  Example: {concept.example}
                </Text>
              </View>
            ))}

            <Text className="text-xl text-white font-semibold mt-6 mb-2">
              📌 Important Points
            </Text>
            {chapter.important_points?.map((point, i) => (
              <Text key={i} className="text-[#c2c2c2] text-base">
                • {point}
              </Text>
            ))}

            <Text className="text-xl text-white font-semibold mt-6 mb-2">
              ❓ Review Questions
            </Text>
            {chapter.questions?.map((q, qIndex) => (
              <View key={qIndex} className="mb-3">
                <Text className="text-[#dbdbdb] text-base font-medium">
                  Q: {q.question}
                </Text>
                <Text className="text-green-600 text-base mt-1">
                  A: {q.answer}
                </Text>
              </View>
            ))}
          </View>
        ))}

        <View className="px-5 mt-8">
          <Text className="text-white text-2xl font-bold mb-2">📘 Glossary</Text>
          {guide?.glossary?.map((item, i) => (
            <View key={i} className="mb-2">
              <Text className="text-white text-lg font-semibold">
                {item.term}
              </Text>
              <Text className="text-[#c2c2c2] text-base">{item.definition}</Text>
            </View>
          ))}
        </View>

        <View className="px-5 mt-8 mb-10">
          <Text className="text-white text-2xl font-bold mb-2">
            📚 Recommended Reading
          </Text>
          {guide?.recommended_reading?.map((article, i) => (
            <Text
              key={i}
              className="text-[#4ea8de] text-base mb-1"
              onPress={() => Linking.openURL(article.url)}
            >
              • {article.title}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudyGuideFromPdf;
