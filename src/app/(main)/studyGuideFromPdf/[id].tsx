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
import { LinearGradient } from "expo-linear-gradient";

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
          text1: "Study guide removed successfully",
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
    <LinearGradient
      colors={['#1a1a1a', '#2d1b69']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="px-6 py-6"
        >
          {/* Header Section */}
          <View className="flex-row justify-between items-center mb-6">
            <Pressable
              onPress={() => router.back()}
              className="bg-white/10 border border-white/20 rounded-full p-3 justify-center items-center"
            >
              <Feather name="chevron-left" size={24} color="#FFFFFF" />
            </Pressable>

            <Pressable
              onPress={() => router.push(`/studyGuideFromPdf/pdfGuideQna/${studyGuideId}`)}
              className="bg-white/10 border border-white/20 rounded-full p-3 justify-center items-center"
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
              className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-6"
            >
              <Text className="text-white text-2xl font-bold mb-4">
                {chapter.title}
              </Text>
              <Text className="text-gray-300 text-base leading-relaxed mb-6">
                {chapter.summary}
              </Text>

              <View className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                <View className="flex-row items-center mb-4">
                  <MaterialCommunityIcons name="key-variant" size={24} color="#4EA8DE" />
                  <Text className="text-xl text-white font-semibold ml-2">
                    Key Concepts
                  </Text>
                </View>
                {chapter.concepts?.map((concept, idx) => (
                  <View key={idx} className="mb-4 last:mb-0">
                    <Text className="text-lg text-white font-bold mb-1">
                      {concept.term}
                    </Text>
                    <Text className="text-gray-300 text-base mb-2">
                      {concept.definition}
                    </Text>
                    <Text className="text-gray-400 text-sm italic">
                      Example: {concept.example}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="bg-white/5 border border-white/10 rounded-xl p-4">
                <View className="flex-row items-center mb-4">
                  <MaterialCommunityIcons name="pin" size={24} color="#4EA8DE" />
                  <Text className="text-xl text-white font-semibold ml-2">
                    Important Points
                  </Text>
                </View>
                {chapter.important_points?.map((point, i) => (
                  <View key={i} className="flex-row items-start mb-2">
                    <View className="w-2 h-2 rounded-full bg-indigo-500 mt-2 mr-3" />
                    <Text className="text-gray-300 text-base flex-1 leading-relaxed">
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Glossary Section */}
          <View className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <MaterialCommunityIcons name="book-open-variant" size={28} color="#4EA8DE" />
              <Text className="text-2xl text-white font-bold ml-2">
                Glossary
              </Text>
            </View>
            {guide?.glossary?.map((item, i) => (
              <View key={i} className="mb-4 last:mb-0">
                <Text className="text-white text-lg font-semibold mb-1">
                  {item.term}
                </Text>
                <Text className="text-gray-300 text-base">
                  {item.definition}
                </Text>
              </View>
            ))}
          </View>

          {/* Recommended Reading Section */}
          <View className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <MaterialCommunityIcons name="bookmark-multiple" size={28} color="#4EA8DE" />
              <Text className="text-2xl text-white font-bold ml-2">
                Recommended Reading
              </Text>
            </View>
            {guide?.recommended_reading?.map((article, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => Linking.openURL(article.url)}
                className="flex-row items-center mb-3 bg-white/5 border border-white/10 p-4 rounded-xl"
              >
                <MaterialCommunityIcons name="link-variant" size={20} color="#4EA8DE" />
                <Text className="text-indigo-400 text-base ml-2 flex-1">
                  {article.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="border border-red-500/30 bg-red-500/10 p-6 rounded-2xl mb-8">
            <View className="flex-row items-center mb-3">
              <Feather name="alert-triangle" size={24} color="#ef4444" />
              <Text className="text-white font-semibold text-xl ml-2">
                Danger Zone
              </Text>
            </View>
            <Text className="text-gray-300 mb-4">
              This action will permanently remove this content and cannot be undone.
            </Text>

            <TouchableOpacity
              className="bg-red-500/90 p-4 rounded-xl"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-white text-center font-medium">
                Remove Study Guide
              </Text>
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
    </LinearGradient>
  );
};

export default StudyGuideFromPdf;
