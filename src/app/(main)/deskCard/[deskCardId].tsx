import {
  View,
  Text,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useGetDeskCardByDeskId } from "@/src/utils/query/deskQuery";
import { SafeAreaView } from "react-native-safe-area-context";
import CardQnWithAns from "@/src/components/desk/CardQnWithAns";
import ListHeaderForQna from "@/src/components/desk/ListHeaderForQna";
import DefaultLoader from "@/src/components/loaders/DefaultLoader";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";

const DeskCardDetails = () => {
  const [moreDropDownOpen, setMoreDropDownOpen] = useState(false);
  const { deskCardId } = useLocalSearchParams();
  const { data, isLoading } = useGetDeskCardByDeskId(deskCardId as string);

  const handlePressAddCard = () => {
    setMoreDropDownOpen(false);
  };

  if (isLoading) return <DefaultLoader />;

  if (!data || Object.keys(data).length === 0) {
    return (
      <LinearGradient
        colors={['#1a1a1a', '#2d1b69']}
        className="flex-1"
      >
        <SafeAreaView className="flex-1 p-6 justify-center items-center">
          <Feather name="alert-circle" size={48} color="#ef4444" />
          <Text className="text-red-400 text-lg font-medium mt-4">
            Not Found
          </Text>
          <Text className="text-gray-400 text-base mt-2 text-center px-6">
            Please check the desk card ID or go back to the desk
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d1b69']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <FlatList
          data={data.cards}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <ListHeaderForQna
              extractQnA={data.cards}
              studyGuideTitle={data.desk.subject_name}
              onPressBack={() => router.back()}
            />
          )}
          renderItem={({ item }) => (
            <View className="px-6 mt-4">
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                className="rounded-2xl overflow-hidden border border-white/20"
              >
                <CardQnWithAns cardData={item} />
              </LinearGradient>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-20"
          ItemSeparatorComponent={() => <View className="h-4" />}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default DeskCardDetails;
