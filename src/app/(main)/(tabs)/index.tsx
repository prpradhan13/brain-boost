import {
  useGetAIGeneratedGuide,
  useGetPDFGeneratedGuide,
} from "@/src/utils/query/aiGeneratedQuery";
import { useGetAllDesk } from "@/src/utils/query/deskQuery";
import { FlatList, RefreshControl, ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import SkeletonCard from "@/src/components/loaders/SkeletonCard";
import SectionTitle from "@/src/components/home/SectionTitle";
import Card from "@/src/components/home/Card";
import ListEmpty from "@/src/components/desk/ListEmpty";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: deskData,
    isLoading: deskLoading,
    refetch: deskRefetch,
  } = useGetAllDesk();

  const {
    data: aiGeneratedGuideData,
    isLoading: aiGeneratedGuideLoading,
    refetch: aiGeneratedGuideRefetch,
  } = useGetAIGeneratedGuide();

  const {
    data: aiGeneratedGuideDataFromPDF,
    isLoading: aiGeneratedGuideLoadingFromPDF,
    refetch: aiGeneratedGuideRefetchFromPDF,
  } = useGetPDFGeneratedGuide();

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      deskRefetch(),
      aiGeneratedGuideRefetch(),
      aiGeneratedGuideRefetchFromPDF(),
    ]);
    setRefreshing(false);
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d1b69']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-3xl font-bold text-white">Welcome back!</Text>
          <Text className="text-lg text-gray-300 mt-2">
            Continue your learning journey
          </Text>
          <Pressable 
            className="flex-row items-center bg-white/10 border border-white/20 mt-6 px-4 py-4 rounded-xl"
            onPress={() => router.push("/search")}
          >
            <Feather name="search" size={20} color="#9ca3af" />
            <Text className="text-gray-400 ml-3 text-base">Search study guides...</Text>
          </Pressable>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#9ca3af"
              progressViewOffset={20}
            />
          }
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          {/* Desk Section */}
          <View className="mt-8">
            <SectionTitle title="Your Desks" icon="book" />
            <FlatList
              data={deskLoading ? new Array(3).fill(null) : deskData}
              keyExtractor={(item, index) =>
                item?.id?.toString?.() || `skeleton-${index}`
              }
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-4 px-6"
              renderItem={({ item }) =>
                deskLoading ? (
                  <SkeletonCard />
                ) : (
                  <Card
                    title={item.subject_name}
                    description={item.description}
                    date={item.created_at}
                    onPress={() => router.push(`/deskCard/${item.id}`)}
                  />
                )
              }
              ListEmptyComponent={() => (
                <ListEmpty 
                  title="No desks yet" 
                  description="Create your first desk to get started"
                />
              )}
            />
          </View>

          {/* AI Study Guides Section */}
          <View className="mt-8">
            <SectionTitle title="AI Study Guides" icon="book-open" />
            <FlatList
              data={
                aiGeneratedGuideLoading
                  ? new Array(3).fill(null)
                  : aiGeneratedGuideData
              }
              keyExtractor={(item, index) =>
                item?.id?.toString?.() || `skeleton-${index}`
              }
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName={`gap-4 px-6 ${
                aiGeneratedGuideData?.length === 0 && "w-full"
              }`}
              ListEmptyComponent={() => (
                <ListEmpty 
                  title="No AI study guides" 
                  description="Generate your first AI study guide"
                />
              )}
              renderItem={({ item }) =>
                aiGeneratedGuideLoading ? (
                  <SkeletonCard />
                ) : (
                  <Card
                    title={item.subject_name}
                    date={item.created_at}
                    onPress={() => router.push(`/studyGuide/${item.id}`)}
                  />
                )
              }
            />
          </View>

          {/* PDF Study Guides Section */}
          <View className="mt-8 mb-8">
            <SectionTitle title="PDF Study Guides" icon="file-text" />
            <FlatList
              data={
                aiGeneratedGuideLoadingFromPDF
                  ? new Array(3).fill(null)
                  : aiGeneratedGuideDataFromPDF
              }
              keyExtractor={(item, index) =>
                item?.id?.toString?.() || `skeleton-${index}`
              }
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName={`gap-4 px-6 ${
                aiGeneratedGuideDataFromPDF?.length === 0 && "w-full"
              }`}
              ListEmptyComponent={() => (
                <ListEmpty 
                  title="No PDF study guides" 
                  description="Upload a PDF to create a study guide"
                />
              )}
              renderItem={({ item }) =>
                aiGeneratedGuideLoadingFromPDF ? (
                  <SkeletonCard />
                ) : (
                  <Card
                    title={item.content.title}
                    date={item.created_at}
                    onPress={() => router.push(`/studyGuideFromPdf/${item.id}`)}
                  />
                )
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
