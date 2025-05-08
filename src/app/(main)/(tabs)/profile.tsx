import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import useAuthStore from "@/src/stores/authStore";
import { LinearGradient } from "expo-linear-gradient";

const profile = () => {
  const { logout } = useAuthStore();

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d1b69']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        {/* Profile Header */}
        <View className="px-6 pt-6 pb-12">
          <View className="items-center">
            <View className="w-24 h-24 bg-white/10 border border-white/20 rounded-full justify-center items-center">
              <Text className="text-3xl font-bold text-white">PP</Text>
            </View>
            <Text className="text-white text-2xl font-bold mt-4">Profile</Text>
            <Text className="text-gray-300 mt-1">Manage your account</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-6 -mt-6">
          <Pressable 
            className="bg-white/10 border border-white/20 p-4 rounded-xl flex-row items-center mb-4"
            android_ripple={{ color: "#ffffff20" }}
          >
            <View className="w-10 h-10 bg-indigo-500/20 rounded-full justify-center items-center">
              <Feather name="user" size={20} color="#818cf8" />
            </View>
            <Text className="text-white text-lg font-semibold ml-4">Edit Profile</Text>
            <Feather name="chevron-right" size={20} color="#9ca3af" className="ml-auto" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/createFlashCardModal")}
            className="bg-white/10 border border-white/20 p-4 rounded-xl flex-row items-center mb-4"
            android_ripple={{ color: "#ffffff20" }}
          >
            <View className="w-10 h-10 bg-purple-500/20 rounded-full justify-center items-center">
              <Feather name="file-text" size={20} color="#a78bfa" />
            </View>
            <Text className="text-white text-lg font-semibold ml-4">Create Flashcards</Text>
            <Feather name="chevron-right" size={20} color="#9ca3af" className="ml-auto" />
          </Pressable>

          <Pressable 
            onPress={() => router.push("/studyModal")}
            className="bg-white/10 border border-white/20 p-4 rounded-xl flex-row items-center mb-4"
            android_ripple={{ color: "#ffffff20" }}
          >
            <View className="w-10 h-10 bg-emerald-500/20 rounded-full justify-center items-center">
              <Feather name="book" size={20} color="#34d399" />
            </View>
            <Text className="text-white text-lg font-semibold ml-4">Generate Study Guide</Text>
            <Feather name="chevron-right" size={20} color="#9ca3af" className="ml-auto" />
          </Pressable>

          <Pressable 
            onPress={logout}
            className="bg-white/10 border border-white/20 p-4 rounded-xl flex-row items-center mt-4"
            android_ripple={{ color: "#ffffff20" }}
          >
            <View className="w-10 h-10 bg-red-500/20 rounded-full justify-center items-center">
              <Feather name="log-out" size={20} color="#f87171" />
            </View>
            <Text className="text-red-400 text-lg font-semibold ml-4">Logout</Text>
            <Feather name="chevron-right" size={20} color="#9ca3af" className="ml-auto" />
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default profile;
