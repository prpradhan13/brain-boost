import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
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
import { LinearGradient } from "expo-linear-gradient";

const StudyGuideDetails = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const userId = user?.id;
  const guideId = Number(id);

  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useGetAIGeneratedGuideById(guideId);
  const { mutate, isPending } = useDeleteAIGeneratedGuide();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (isLoading) return <DefaultLoader />;

  if (isError || !data) {
    return (
      <LinearGradient
        colors={['#1a1a1a', '#2d1b69']}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center">
          <Feather name="alert-circle" size={48} color="#ef4444" />
          <Text className="text-red-400 text-lg font-medium mt-4">
            Failed to load study guide
          </Text>
          <Text className="text-gray-400 text-base mt-2 text-center px-6">
            Please try again later or contact support if the problem persists
          </Text>
        </View>
      </LinearGradient>
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
          text1: "Study guide removed successfully",
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
    <LinearGradient
      colors={['#1a1a1a', '#2d1b69']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="px-6 py-4"
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <View className="flex-row items-center justify-between mb-6">
              <Pressable
                onPress={() => router.back()}
                className="bg-white/10 border border-white/20 p-3 rounded-full justify-center items-center"
              >
                <Feather name="chevron-left" size={24} color="white" />
              </Pressable>

              <Pressable
                onPress={() => router.push(`/studyGuide/guideQna/${guideId}`)}
                className="bg-white/10 border border-white/20 p-3 rounded-full justify-center items-center"
              >
                <Feather name="layers" size={24} color="white" />
              </Pressable>
            </View>

            <Text className="text-white text-4xl font-bold mt-4 leading-tight">
              {data.title}
            </Text>
            <Text className="text-gray-300 text-lg mb-8 mt-3 leading-relaxed">
              {data.summary}
            </Text>

            {data.sections.map((section, index) => (
              <View 
                key={index} 
                className="mb-8 bg-white/10 border border-white/20 p-6 rounded-2xl"
              >
                <Text className="text-white text-2xl font-semibold mb-3">
                  {section.title}
                </Text>
                <Text className="text-gray-300 text-base mb-4 leading-relaxed">
                  {section.summary}
                </Text>

                <Text className="text-white text-lg font-semibold mb-3">
                  Key Points:
                </Text>
                {section.key_points.map((point, i) => (
                  <View key={i} className="flex-row items-start mb-3">
                    <View className="w-2 h-2 rounded-full bg-indigo-500 mt-2 mr-3" />
                    <Text className="text-gray-300 flex-1 leading-relaxed">
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            ))}

            <View className="mb-12">
              <Text className="text-white text-2xl font-semibold mb-4">
                Resources
              </Text>
              {data.resources.map((res, i) => (
                <Pressable
                  key={i}
                  onPress={() => Linking.openURL(res.url)}
                  className="mb-4 bg-white/10 border border-white/20 p-4 rounded-xl"
                >
                  <Text className="text-white font-medium text-lg mb-2">
                    {res.title}
                  </Text>
                  <Text className="text-indigo-400 mb-2">{res.url}</Text>
                  <View className="flex-row items-center">
                    <Feather name="link" size={16} color="#9ca3af" />
                    <Text className="text-gray-400 text-sm ml-2">{res.type}</Text>
                  </View>
                </Pressable>
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
          </Animated.View>
        </ScrollView>

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
      </SafeAreaView>
    </LinearGradient>
  );
};

export default StudyGuideDetails;
