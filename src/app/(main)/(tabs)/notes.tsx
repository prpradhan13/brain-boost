import { View, Text, Pressable, ActivityIndicator, ScrollView, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetNotes } from '@/src/utils/query/notesQuery';
import CreateNote from '@/src/components/notes/CreateNote';
import { NotesType } from '@/src/types/notes.type';

const NotesScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [createNoteModalOpen, setCreateNoteModalOpen] = useState(false);
  const { data: notes, isLoading, refetch } = useGetNotes();

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <SafeAreaView className='flex-1 p-4'>
      <Pressable
        className='bg-gray-200 rounded-xl w-full p-2 items-center justify-center'
        onPress={() => setCreateNoteModalOpen(true)}
        android_ripple={{ color: '#00000020' }}
      >
        <Text className='font-medium'>New note</Text>
      </Pressable>

      {!notes || notes.length === 0 && (
        <View className='flex-1 items-center justify-center'>
          <Text className='text-white text-lg'>No notes found</Text>
        </View>
      )}

      {createNoteModalOpen && (
        <CreateNote visible={createNoteModalOpen} setVisible={setCreateNoteModalOpen} />
      )}

      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <NoteCard note={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </SafeAreaView>
  )
};

const NoteCard = ({ note }: { note: NotesType }) => {
  return (
    <View className='bg-gray-200 rounded-xl p-4 mt-4'>
      {note.title ? (
        <Text className='text-lg font-medium'>{note.title}</Text>
      ) : (
        <Text className='text-lg font-medium'>Untitled</Text>
      )}
      <Text className='text-gray-600'>{note.note}</Text>
    </View>
  )
}

export default NotesScreen;