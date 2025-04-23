import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import FlashCard from './FlashCard'
import { QnA } from '@/src/types/studyGuide.type'

interface ListHeaderForQnaProps {
    extractQnA: QnA[]
    studyGuideTitle: string;
    onPressBack: () => void;
}

const ListHeaderForQna = ({ extractQnA, onPressBack, studyGuideTitle }: ListHeaderForQnaProps) => {
  return (
    <>
      <View className="p-6 flex-row justify-between">
        <TouchableOpacity
          className="bg-[#fff] rounded-xl w-11 h-11 justify-center items-center"
          onPress={onPressBack}
        >
          <Feather name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="px-6">
        <Text className="text-white text-3xl font-semibold">
          {studyGuideTitle}
        </Text>
      </View>

      <View className="mt-4">
        <FlatList
          data={extractQnA}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <FlashCard flashCardItem={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 gap-4"
        />
      </View>

      <View className="px-4 mt-4">
        <Text className="text-white font-medium text-lg">All Cards</Text>
      </View>
    </>
  )
}

export default ListHeaderForQna