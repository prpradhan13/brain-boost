import { View, Text } from 'react-native'
import React from 'react'

interface CardQnWithAnsProps {
  cardData: {
    question: string;
    answer: string;
  };
}

const CardQnWithAns = ({ cardData }: CardQnWithAnsProps) => {
  return (
    <View className="bg-[#212121] rounded-2xl p-5">
      <Text className="text-white text-xl font-semibold">
        {cardData.question}
      </Text>
      <Text className="text-green-400 mt-2">{cardData.answer}</Text>
    </View>
  )
}

export default CardQnWithAns