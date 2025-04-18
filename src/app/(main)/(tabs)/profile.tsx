import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const profile = () => {
  return (
    <SafeAreaView className="flex-1 p-6 justify-center items-center">
      <View className="w-20 h-20 bg-[#fff] rounded-full justify-center items-center">
        <Text className="text-2xl font-semibold">PP</Text>
      </View>

      <Pressable className="bg-[#212121] p-4 rounded-xl mt-6 w-full">
        <Text className="text-white text-xl font-semibold">Edit Profile</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/createFlashCardModal")}
        className="bg-[#212121] p-4 rounded-xl mt-6 w-full"
      >
        <Text className="text-white text-xl font-semibold">
          Create Flashcards
        </Text>
      </Pressable>
      <Pressable className="bg-[#212121] p-4 rounded-xl mt-6 w-full">
        <Text className="text-white text-xl font-semibold">Create Todo</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/studyModal")} className="bg-[#212121] p-4 rounded-xl mt-6 w-full">
        <Text className="text-white text-xl font-semibold">Generate Study Guide</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default profile;
