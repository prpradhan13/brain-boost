import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useGetDeskCardByDeskId } from "@/src/utils/query/deskQuery";
import { SafeAreaView } from "react-native-safe-area-context";
import CardQnWithAns from "@/src/components/desk/CardQnWithAns";
import ListHeaderForQna from "@/src/components/desk/ListHeaderForQna";

const DeskCardDetails = () => {
  const [moreDropDownOpen, setMoreDropDownOpen] = useState(false);
  const { deskCardId } = useLocalSearchParams();
  const { data, isLoading } = useGetDeskCardByDeskId(deskCardId as string);

  const handlePressAddCard = () => {
    setMoreDropDownOpen(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 p-6 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <SafeAreaView className="flex-1 p-6 justify-center items-center">
        <Text className="text-white text-xl">Not Found</Text>
      </SafeAreaView>
    );
  }

  return (
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
          <View className="px-4 mt-4">
            <CardQnWithAns cardData={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
};

export default DeskCardDetails;
