import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Card from "@/src/components/home/Card";
import { useGetAIGeneratedGuide, useGetPDFGeneratedGuide } from "@/src/utils/query/aiGeneratedQuery";
import { useGetAllDesk } from "@/src/utils/query/deskQuery";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: deskData } = useGetAllDesk();
  const { data: aiGeneratedGuideData } = useGetAIGeneratedGuide();
  const { data: aiGeneratedGuideDataFromPDF } = useGetPDFGeneratedGuide();

  const allData = [
    ...(deskData || []).map(item => ({
      ...item,
      type: 'desk',
      title: item.subject_name,
    })),
    ...(aiGeneratedGuideData || []).map(item => ({
      ...item,
      type: 'ai',
      title: item.subject_name,
    })),
    ...(aiGeneratedGuideDataFromPDF || []).map(item => ({
      ...item,
      type: 'pdf',
      title: item.content.title,
    })),
  ];

  const filteredData = allData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemPress = (item: any) => {
    switch (item.type) {
      case 'desk':
        router.push(`/deskCard/${item.id}`);
        break;
      case 'ai':
        router.push(`/studyGuide/${item.id}`);
        break;
      case 'pdf':
        router.push(`/studyGuideFromPdf/${item.id}`);
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="px-4 py-4">
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={() => router.back()}
            className="bg-indigo-500 rounded-xl w-11 h-11 justify-center items-center"
          >
            <Feather name="chevron-left" size={22} color="white" />
          </Pressable>
          <Text className="text-2xl font-bold text-indigo-200">Search</Text>
        </View>

        <View className="mt-4 flex-row items-center bg-indigo-950/50 px-4 py-3 rounded-xl border border-indigo-500/20">
          <Feather name="search" size={20} color="#818cf8" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search study guides..."
            placeholderTextColor="#818cf8"
            className="flex-1 text-indigo-200 ml-2 text-base"
          />
        </View>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerClassName="px-4"
        renderItem={({ item }) => (
          <Card
            title={item.title}
            date={item.created_at}
            onPress={() => handleItemPress(item)}
          />
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-indigo-300/70 text-lg">
              {searchQuery ? "No results found" : "Start typing to search..."}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
} 