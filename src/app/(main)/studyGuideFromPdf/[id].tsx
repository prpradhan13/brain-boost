import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Linking,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useGetPDFGeneratedGuideById } from "@/src/utils/query/aiGeneratedQuery";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AlertModal from "@/src/components/modal/AlertModal";

const StudyGuideFromPdf = () => {
  const [modalVisible, setModalVisible] = useState(false);
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

  const handleRemoveStudyGuide = () => {};

  return (
    <SafeAreaView className="flex-1 bg-black px-2 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center">
          <Pressable
            onPress={() => router.back()}
            className="bg-white rounded-xl w-11 h-11 justify-center items-center"
          >
            <Feather name="chevron-left" size={22} color="black" />
          </Pressable>

          <Pressable
            onPress={() => router.push(`studyGuideFromPdf/pdfGuideQna/${id}`)}
            className="bg-white rounded-xl w-11 h-11 justify-center items-center"
          >
            <Feather name="layers" size={22} color="black" />
          </Pressable>
        </View>

        <Text className="text-white text-4xl font-bold pt-6">
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
          </View>
        ))}

        <View className="px-5 mt-8">
          <Text className="text-white text-2xl font-bold mb-2">
            📘 Glossary
          </Text>
          {guide?.glossary?.map((item, i) => (
            <View key={i} className="mb-2">
              <Text className="text-white text-lg font-semibold">
                {item.term}
              </Text>
              <Text className="text-[#c2c2c2] text-base">
                {item.definition}
              </Text>
            </View>
          ))}
        </View>

        <View className="px-5 mt-8">
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

        <View className="border border-[#ff0000] bg-[#ef44447b] p-4 rounded-xl my-4">
          <Text className="text-white font-medium text-lg">Denger zone</Text>
          <Text className="text-[#dbdbdb]">
            This action remove this content and it can not be undo.
          </Text>

          <TouchableOpacity
            className="bg-[#ff0000] p-2 rounded-xl mt-4"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white text-center">Remove</Text>
          </TouchableOpacity>
        </View>

        {modalVisible && (
          <AlertModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            alertTitle="Remove Study Guide"
            alertMessage="Are you sure you want to remove this study guide? This action cannot be undone."
            handleContinue={handleRemoveStudyGuide}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudyGuideFromPdf;
