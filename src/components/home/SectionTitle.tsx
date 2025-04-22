import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

const SectionTitle = ({ title, icon }: { title: string; icon?: string }) => (
  <View className="flex-row items-center gap-2 px-4 mt-6 mb-2">
    <Feather name={icon as any} size={24} color="#fff" />
    <Text className="text-2xl font-bold text-white">{title}</Text>
  </View>
);

export default SectionTitle;
