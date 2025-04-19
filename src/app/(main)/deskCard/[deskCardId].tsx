import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useGetDeskCardByDeskId } from "@/src/utils/query/deskQuery";
import { SafeAreaView } from "react-native-safe-area-context";
import FlashCard from "@/src/components/desk/FlashCard";
import { Feather } from "@expo/vector-icons";
import CardQnWithAns from "@/src/components/desk/CardQnWithAns";

const DeskCardDetails = () => {
  const [moreDropDownOpen, setMoreDropDownOpen] = useState(false);
  const { deskCardId } = useLocalSearchParams();
  const { data, isLoading } = useGetDeskCardByDeskId(deskCardId as string);

  const handlePressBack = () => {
    router.back();
  };

  const handlePressAddCard = () => {
    setMoreDropDownOpen(false)
  }

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
      <View className="p-6 flex-row justify-between">
        <TouchableOpacity
          className="bg-[#fff] rounded-full w-11 h-11 justify-center items-center"
          onPress={handlePressBack}
        >
          <Feather name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#fff] rounded-xl w-11 h-11 justify-center items-center relative"
          onPress={() => setMoreDropDownOpen((prev) => !prev)}
        >
          <Feather name="more-vertical" size={24} color="black" />
        </TouchableOpacity>

        {moreDropDownOpen && (
          <View className="absolute right-6 -bottom-16 bg-white py-2 px-4 rounded-xl gap-2 z-10">
            <Pressable onPress={handlePressAddCard}>
              <Text className="text-lg">Add Cards</Text>
            </Pressable>
            <Pressable>
              <Text className="text-lg text-red-500">Delete</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View className="px-6">
        <Text className="text-white text-3xl font-semibold">{data.desk.subject_name}</Text>
        {data.desk.description && (
          <Text className="text-gray-400">{data.desk.description}</Text>
        )}
      </View>

      <View className="mt-4">
        <FlatList
          data={data.cards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FlashCard flashCardItem={item} />}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-6 gap-4"
        />

        <View className="p-6">
          <Text className="text-white font-medium text-lg">All Cards</Text>

          <FlatList
            data={data.cards}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CardQnWithAns cardData={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-4 mt-4"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DeskCardDetails;
