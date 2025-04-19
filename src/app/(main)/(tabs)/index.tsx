import { useGetAIGeneratedGuide } from "@/src/utils/query/aiGeneratedQuery";
import { useGetAllDesk } from "@/src/utils/query/deskQuery";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useState } from "react";
import SkeletonCard from "@/src/components/loaders/SkeletonCard";
import { DeskType } from "@/src/types/desk.type";
import { StudyGuideCardType } from "@/src/types/studyGuide.type";

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([deskRefetch(), aiGeneratedGuideRefetch()]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 py-6">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
          />
        }
      >
        <View className="">
          <Text className="text-3xl text-white font-semibold px-4">Desk</Text>
          <FlatList<DeskType>
            data={deskLoading ? new Array(3).fill(null) : deskData}
            keyExtractor={(item, index) => item?.id?.toString?.() || `skeleton-${index}`}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 px-4 mt-2"
            renderItem={({ item }) =>
              deskLoading ? (
                <SkeletonCard />
              ) : (
                <Pressable onPress={() => router.push(`/deskCard/${item.id}`)} className="bg-[#212121] p-3 rounded-xl w-80">
                  <Text className="text-xl font-medium text-white">
                    {item.subject_name}
                  </Text>
                  {item.description && (
                    <Text className="text-[#c2c2c2]">{item.description}</Text>
                  )}
                  <Text className="mt-4 text-white">
                    {dayjs(item.created_at).format("DD/MM/YYYY")}
                  </Text>
                </Pressable>
              )
            }
          />
        </View>

        <View className="mt-4">
          <Text className="text-3xl text-white font-semibold px-4">
            Study Guides - AI
          </Text>
          <FlatList<StudyGuideCardType>
            data={aiGeneratedGuideLoading ? new Array(3).fill(null) : aiGeneratedGuideData}
            keyExtractor={(item, index) => item?.id?.toString?.() || `skeleton-${index}`}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 px-4 mt-2"
            renderItem={({ item }) =>
              aiGeneratedGuideLoading ? (
                <SkeletonCard />
              ) : (
                <Pressable onPress={() => router.push(`/studyGuide/${item.id}`)} className="bg-[#212121] p-3 rounded-xl w-80">
                  <Text className="text-xl font-medium text-white">
                    {item.subject_name}
                  </Text>
                  <Text className="mt-4 text-white">
                    {dayjs(item.created_at).format("DD/MM/YYYY")}
                  </Text>
                </Pressable>
              )
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
