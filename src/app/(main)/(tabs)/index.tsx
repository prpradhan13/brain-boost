import {
  useGetAIGeneratedGuide,
  useGetPDFGeneratedGuide,
} from "@/src/utils/query/aiGeneratedQuery";
import { useGetAllDesk } from "@/src/utils/query/deskQuery";
import {
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import SkeletonCard from "@/src/components/loaders/SkeletonCard";
import SectionTitle from "@/src/components/home/SectionTitle";
import Card from "@/src/components/home/Card";

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
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
          />
        }
      >
        <SectionTitle title="Desk" icon="book" />
        <FlatList
          data={deskLoading ? new Array(3).fill(null) : deskData}
          keyExtractor={(item, index) =>
            item?.id?.toString?.() || `skeleton-${index}`
          }
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-4 px-4"
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
        />

        <SectionTitle title="Study Guides - AI" icon="book-open" />
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
          contentContainerClassName="gap-4 px-4"
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

        <SectionTitle title="Study Guides - PDF" icon="file-text" />
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
          contentContainerClassName="gap-4 px-4 mb-10"
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
      </ScrollView>
    </SafeAreaView>
  );
}
