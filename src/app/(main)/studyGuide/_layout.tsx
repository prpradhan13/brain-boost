import React from 'react'
import { Stack } from 'expo-router';

const studyGuideLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="[id]" options={{ headerShown: false }} />
        <Stack.Screen name="guideQna/[id]" options={{ headerShown: false }} />
    </Stack>
  )
}

export default studyGuideLayout;