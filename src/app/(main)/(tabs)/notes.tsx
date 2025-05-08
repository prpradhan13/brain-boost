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
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient
      colors={['#1a1a1a', '#2d1b69']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 px-6">
        <View className="mt-2">
          <Text className="text-3xl font-bold text-white">Notes</Text>
          <Text className="text-lg text-gray-300 mt-2">
            Keep track of your thoughts and ideas
          </Text>
        </View>

        <Pressable
          className="bg-white/10 border border-white/20 rounded-xl p-4 mt-6 flex-row items-center justify-center gap-2"
          onPress={() => setCreateNoteModalOpen(true)}
          android_ripple={{ color: "#ffffff20" }}
        >
          <Feather name="plus" size={20} color="white" />
          <Text className="font-semibold text-lg text-white">New note</Text>
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
            <View className="flex-1 items-center justify-center mt-10">
              <Feather name="file-text" size={48} color="#9ca3af" />
              <Text className="text-gray-400 text-lg mt-4">No notes found</Text>
              <Text className="text-gray-500 text-base mt-2 text-center">
                Create your first note to get started
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const NoteCard = ({ note }: { note: NotesType }) => {
  return (
    <Pressable
      android_ripple={{ color: "#ffffff20" }}
      style={{ width: "48%", height: 200 }}
      className="bg-white/10 border border-white/20 rounded-xl p-4 overflow-hidden"
      onPress={() => router.push(`/note/${note.id}`)}
    >
      <Text className="text-lg font-semibold text-white mb-2" numberOfLines={1}>
        {note.title?.trim() || "Untitled"}
      </Text>
      <Text 
        className="text-gray-300 text-base" 
        numberOfLines={6}
      >
        {note.note}
      </Text>
    </Pressable>
  );
};

export default NotesScreen;
