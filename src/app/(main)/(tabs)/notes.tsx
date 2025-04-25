import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetNotes } from '@/src/utils/query/notesQuery';
import CreateNote from '@/src/components/notes/CreateNote';

const Todo = () => {
  const [createNoteModalOpen, setCreateNoteModalOpen] = useState(false);
  const { data: notes, isLoading } = useGetNotes();

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
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
    </SafeAreaView>
  )
}

export default Todo;