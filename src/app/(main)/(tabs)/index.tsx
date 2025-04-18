import { useGetAIGeneratedGuide } from "@/src/utils/query/aiGeneratedQuery";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {

  const { data } = useGetAIGeneratedGuide();

  console.log(data);
  

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text className="text-white text-xl">Hello</Text>  
    </SafeAreaView>
  );
}
