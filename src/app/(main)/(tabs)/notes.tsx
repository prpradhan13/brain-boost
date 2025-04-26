import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetNotes } from "@/src/utils/query/notesQuery";
import CreateNote from "@/src/components/notes/CreateNote";
import { NotesType } from "@/src/types/notes.type";
import DefaultLoader from "@/src/components/loaders/DefaultLoader";
import { router } from "expo-router";

const NotesScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [createNoteModalOpen, setCreateNoteModalOpen] = useState(false);
  const { data: notes, isLoading, refetch } = useGetNotes();

  if (isLoading) return <DefaultLoader />;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      <Pressable
        className="bg-gray-200 rounded-xl w-full p-2 items-center justify-center"
        onPress={() => setCreateNoteModalOpen(true)}
        android_ripple={{ color: "#00000020" }}
      >
        <Text className="font-medium text-lg">New note</Text>
      </Pressable>

      {createNoteModalOpen && (
        <CreateNote
          visible={createNoteModalOpen}
          setVisible={setCreateNoteModalOpen}
        />
      )}

      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginTop: 12,
        }}
        renderItem={({ item }) => <NoteCard note={item} />}
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="text-white text-lg">No notes found</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

const NoteCard = ({ note }: { note: NotesType }) => {
  return (
    <Pressable
      android_ripple={{ color: "#00000020" }}
      style={{ width: "48%", height: 200 }}
      className="bg-gray-200 rounded-xl p-3 overflow-hidden"
      onPress={() => router.push(`/note/${note.id}`)}
    >
      <Text className="text-lg font-semibold text-black mb-1">
        {note.title?.trim() || "Untitled"}
      </Text>
      <Text className="text-gray-700 number-of-lines-5">{note.note}</Text>
    </Pressable>
  );
};

export default NotesScreen;
