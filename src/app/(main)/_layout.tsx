import React from "react";
import { Redirect, Stack } from "expo-router";
import useAuthStore from "@/src/stores/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="studyGuide" options={{ headerShown: false }} />
        <Stack.Screen name="studyGuideFromPdf" options={{ headerShown: false }} />
        <Stack.Screen name="studyModal" options={{ headerShown: false, presentation: "modal", animation: "slide_from_bottom" }} />
        <Stack.Screen name="createFlashCardModal" options={{ headerShown: false }} />
        <Stack.Screen name="deskCard/[deskCardId]" options={{ headerShown: false }} />
        <Stack.Screen name="note/[nId]" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
};

export default MainLayout;
