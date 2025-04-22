import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useGetAIGeneratedGuideById } from "@/src/utils/query/aiGeneratedQuery";
import Feather from "@expo/vector-icons/Feather";

const StudyGuideDetails = () => {
  const { id } = useLocalSearchParams();
  const guideId = Number(id);
  const { data, isLoading, isError } = useGetAIGeneratedGuideById(guideId);

  if (isLoading) {
    return <Text className="text-white text-center mt-10">Loading...</Text>;
  }

  if (isError || !data) {
    return (
      <Text className="text-red-500 text-center mt-10">
        Failed to load study guide.
      </Text>
    );
  }

  return (
    <SafeAreaView className="flex-1 px-2 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-4">
          <Pressable
            onPress={() => router.back()}
            className="bg-white p-2 rounded-xl w-11 h-11 justify-center items-center"
          >
            <Feather name="chevron-left" size={22} color="black" />
          </Pressable>

          <Pressable
            onPress={() => router.push(`/studyGuide/guideQna/${guideId}`)}
            className="bg-white p-2 rounded-xl w-11 h-11 justify-center items-center"
          >
            <Feather name="layers" size={24} color="black" />
          </Pressable>
        </View>

        <Text className="text-white text-3xl font-bold mt-4">{data.title}</Text>
        <Text className="text-gray-300 mb-6 mt-2">{data.summary}</Text>

        {data.sections.map((section, index) => (
          <View key={index} className="mb-6 bg-[#1f1f1f] p-4 rounded-2xl">
            <Text className="text-white text-xl font-semibold mb-1">
              {section.title}
            </Text>
            <Text className="text-gray-300 mb-2">{section.summary}</Text>

            <Text className="text-white font-semibold mb-1">Key Points:</Text>
            {section.key_points.map((point, i) => (
              <Text key={i} className="text-gray-400 ml-2">
                • {point}
              </Text>
            ))}
          </View>
        ))}

        <View className="mb-10">
          <Text className="text-white text-xl font-semibold mb-2">
            Resources
          </Text>
          {data.resources.map((res, i) => (
            <View key={i} className="mb-2">
              <Text className="text-gray-200 font-medium">{res.title}</Text>
              <Pressable
                onPress={() => Linking.openURL(res.url)}
                className="text-blue-400 underline"
              >
                <Text className="text-blue-400 underline">{res.url}</Text>
              </Pressable>
              <Text className="text-gray-400 text-xs">{res.type}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudyGuideDetails;
