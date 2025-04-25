import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useGetNoteDetails } from "@/src/utils/query/notesQuery";
import DefaultLoader from "@/src/components/loaders/DefaultLoader";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import UpdateNote from "@/src/components/notes/UpdateNote";

const NoteDetailsScreen = () => {
  const [noteUpdateOpen, setNoteUpdateOpen] = useState(false);
  const { nId } = useLocalSearchParams<{ nId: string }>();
  const noteId = Number(nId);

  const { data, isLoading } = useGetNoteDetails(noteId);

  if (isLoading) return <DefaultLoader />;

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-lg">Note not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="flex-row justify-between">
        <TouchableOpacity className="w-11 h-11 items-center justify-center rounded-xl bg-white">
          <Feather name="arrow-left" size={22} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setNoteUpdateOpen(true)}
          className="w-11 h-11 items-center justify-center rounded-xl bg-white"
        >
          <Feather name="rotate-ccw" size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {noteUpdateOpen ? (
          <UpdateNote noteId={noteId} setVisible={setNoteUpdateOpen} visible={noteUpdateOpen} />
        ) : (
          <View className="mt-4 bg-[#212121] rounded-xl p-4">
            <Text className="text-2xl font-medium">
              {data.title?.trim() ?? "Untitled"}
            </Text>
            <Text className="text-lg mt-2">{data.note}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NoteDetailsScreen;
