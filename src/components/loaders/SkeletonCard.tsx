import { View } from "react-native";

const SkeletonCard = () => {
  return (
    <View className="bg-[#2c2c2c] p-3 rounded-xl w-80 min-h-28 justify-between animate-pulse">
      <View className="h-5 bg-[#3a3a3a] rounded w-1/2 mb-4" />
      <View className="h-4 bg-[#3a3a3a] rounded w-1/3" />
    </View>
  );
};

export default SkeletonCard;
