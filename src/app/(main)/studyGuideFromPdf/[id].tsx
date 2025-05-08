import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Linking,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  useDeletePDFGeneratedGuide,
  useGetPDFGeneratedGuideById,
} from "@/src/utils/query/aiGeneratedQuery";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AlertModal from "@/src/components/modal/AlertModal";
import { useQueryClient } from "@tanstack/react-query";
import { GeneratedPDFType } from "@/src/types/studyGuide.type";
import useAuthStore from "@/src/stores/authStore";
import Toast from "react-native-toast-message";
import DefaultLoader from "@/src/components/loaders/DefaultLoader";

const StudyGuideFromPdf = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { id: studyGuideId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const userId = user?.id;
  const quryClient = useQueryClient();

  const { data: guide, isLoading } = useGetPDFGeneratedGuideById(studyGuideId);
  const { mutate, isPending } = useDeletePDFGeneratedGuide();

  if (isLoading) return <DefaultLoader />;

  const handleRemoveStudyGuide = () => {
    mutate(studyGuideId, {
      onSuccess: (returnedId) => {
        quryClient.setQueryData(
          ["pdfGeneratedGuide", userId],
          (oldData: GeneratedPDFType[] | undefined) => {
            if (!oldData) return [];
            const newData = oldData.filter((item) => item.id !== returnedId);
            return newData;
          }
        );
        setModalVisible(false);
        router.back();
        Toast.show({
          type: "success",
          text1: "Study guide removed successfully.",
          visibilityTime: 2000,
        });
      },
      onError: (error) => {
        alert("Error removing pdf study guide:" + error);
        setModalVisible(false);
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0A]">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="px-4 py-6"
      >
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="bg-[#1A1A1A] rounded-2xl w-12 h-12 justify-center items-center shadow-lg"
          >
            <Feather name="chevron-left" size={24} color="#FFFFFF" />
          </Pressable>

          <Pressable
            onPress={() => router.push(`/studyGuideFromPdf/pdfGuideQna/${studyGuideId}`)}
            className="bg-[#1A1A1A] rounded-2xl w-12 h-12 justify-center items-center shadow-lg"
          >
            <Feather name="layers" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Title Section */}
        <Text className="text-white text-4xl font-bold mb-8 leading-tight">
          {guide?.title}
        </Text>

        {/* Chapters Section */}
        {guide?.chapters?.map((chapter, index) => (
          <View
            key={index}
            className="bg-[#1A1A1A] rounded-3xl p-6 mb-6 shadow-xl"
          >
            <Text className="text-white text-2xl font-bold mb-4">
              {chapter.title}
            </Text>
            <Text className="text-[#B0B0B0] text-base leading-relaxed mb-6">
              {chapter.summary}
            </Text>

            <View className="bg-[#252525] rounded-2xl p-4 mb-6">
              <Text className="text-xl text-white font-semibold mb-4 flex-row items-center">
                <MaterialCommunityIcons name="key-variant" size={24} color="#4EA8DE" className="mr-2" />
                Key Concepts
              </Text>
              {chapter.concepts?.map((concept, idx) => (
                <View key={idx} className="mb-4 last:mb-0">
                  <Text className="text-lg text-white font-bold mb-1">
                    {concept.term}
                  </Text>
                  <Text className="text-[#B0B0B0] text-base mb-2">
                    {concept.definition}
                  </Text>
                  <Text className="text-[#808080] text-sm italic">
                    Example: {concept.example}
                  </Text>
                </View>
              ))}
            </View>

            <View className="bg-[#252525] rounded-2xl p-4">
              <Text className="text-xl text-white font-semibold mb-4 flex-row items-center">
                <MaterialCommunityIcons name="pin" size={24} color="#4EA8DE" className="mr-2" />
                Important Points
              </Text>
              {chapter.important_points?.map((point, i) => (
                <Text key={i} className="text-[#B0B0B0] text-base mb-2 leading-relaxed">
                  • {point}
                </Text>
              ))}
            </View>
          </View>
        ))}

        {/* Glossary Section */}
        <View className="bg-[#1A1A1A] rounded-3xl p-6 mb-6">
          <Text className="text-2xl text-white font-bold mb-4 flex-row items-center">
            <MaterialCommunityIcons name="book-open-variant" size={28} color="#4EA8DE" className="mr-2" />
            Glossary
          </Text>
          {guide?.glossary?.map((item, i) => (
            <View key={i} className="mb-4 last:mb-0">
              <Text className="text-white text-lg font-semibold mb-1">
                {item.term}
              </Text>
              <Text className="text-[#B0B0B0] text-base">
                {item.definition}
              </Text>
            </View>
          ))}
        </View>

        {/* Recommended Reading Section */}
        <View className="bg-[#1A1A1A] rounded-3xl p-6 mb-6">
          <Text className="text-2xl text-white font-bold mb-4 flex-row items-center">
            <MaterialCommunityIcons name="bookmark-multiple" size={28} color="#4EA8DE" className="mr-2" />
            Recommended Reading
          </Text>
          {guide?.recommended_reading?.map((article, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => Linking.openURL(article.url)}
              className="flex-row items-center mb-3 bg-[#252525] p-3 rounded-xl"
            >
              <MaterialCommunityIcons name="link-variant" size={20} color="#4EA8DE" />
              <Text className="text-[#4EA8DE] text-base ml-2 flex-1">
                {article.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="border border-[#ff0000] bg-[#ef44447b] p-4 mb-10 rounded-xl my-4">
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
            pendingState={isPending}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudyGuideFromPdf;
