import useAuthStore from "@/src/stores/authStore";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text className="text-white text-xl">Hello</Text>
      <Button title="Logout" onPress={logout} />
    </SafeAreaView>
  );
}
