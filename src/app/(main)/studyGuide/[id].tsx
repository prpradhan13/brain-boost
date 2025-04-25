import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  useDeleteAIGeneratedGuide,
  useGetAIGeneratedGuideById,
} from "@/src/utils/query/aiGeneratedQuery";
import Feather from "@expo/vector-icons/Feather";
import AlertModal from "@/src/components/modal/AlertModal";
import { useQueryClient } from "@tanstack/react-query";
import { StudyGuideCardType } from "@/src/types/studyGuide.type";
import Toast from "react-native-toast-message";
import useAuthStore from "@/src/stores/authStore";
import DefaultLoader from "@/src/components/loaders/DefaultLoader";

const StudyGuideDetails = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const userId = user?.id;
  const guideId = Number(id);

  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useGetAIGeneratedGuideById(guideId);
  const { mutate, isPending } = useDeleteAIGeneratedGuide();

  if (isLoading) return <DefaultLoader />;

  if (isError || !data) {
    return (
      <Text className="text-red-500 text-center mt-10">
        Failed to load study guide.
      </Text>
    );
  }

  const handleRemoveStudyGuide = () => {
    mutate(guideId, {
      onSuccess: (returnedId) => {
        queryClient.setQueryData(
          ["aiGeneratedGuide", userId],
          (oldData: StudyGuideCardType[] | undefined) => {
            if (!oldData) return [];
            const updatedData = oldData.filter((old) => old.id !== returnedId);

            return updatedData;
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
        alert("Error removing study guide:" + error);
        setModalVisible(false);
      },
    });
  };

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

        <View className="border border-[#ff0000] bg-[#ef44447b] p-4 rounded-xl mb-4">
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

export default StudyGuideDetails;
