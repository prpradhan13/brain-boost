import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteForm, NoteSchema } from "@/src/validation/form";
import { useCreateNote } from "@/src/utils/query/notesQuery";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/src/stores/authStore";
import { NotesType } from "@/src/types/notes.type";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

interface CreateNoteProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const CreateNote = ({ visible, setVisible }: CreateNoteProps) => {
  const {
    reset,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm<NoteSchema>({
    resolver: zodResolver(noteForm),
    defaultValues: {
      title: "",
      note: "",
    },
  });
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;
  const { mutate, isPending } = useCreateNote();

  const handleClose = () => {
    const { title, note } = getValues();

    if (title?.trim() !== "" || note.trim() !== "") {
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. Are you sure you want to discard them?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              reset();
              setVisible(false);
            },
          },
        ]
      );
    } else {
      reset();
      setVisible(false);
    }
  };

  const handleSave = (data: NoteSchema) => {
    mutate(data, {
      onSuccess: (returnedData) => {
        queryClient.setQueryData(["notes", userId], (oldData: NotesType[] | undefined) => {
          return oldData ? [returnedData, ...oldData] : [returnedData];
        });
        reset();
        setVisible(false);
      },
      onError: (error) => {
        console.error("Error creating note:", error);
      },
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#1a1a1a', '#2d1b69']}
          className="flex-1"
        >
          <SafeAreaView className="flex-1">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              className="flex-1 px-6"
            >
              <View className="flex-row justify-between items-center">
                <Pressable
                  onPress={handleClose}
                  disabled={isPending}
                  className="bg-white/10 rounded-full w-11 h-11 items-center justify-center"
                >
                  <Feather name="x" size={22} color="white" />
                </Pressable>
                <Pressable
                  onPress={handleSubmit(handleSave)}
                  disabled={isPending}
                  className="bg-indigo-600 rounded-full w-11 h-11 items-center justify-center"
                >
                  {isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Feather name="check" size={22} color="white" />
                  )}
                </Pressable>
              </View>

              <View className="mt-6">
                <Text className="text-3xl font-bold text-white">New Note</Text>
                <Text className="text-lg text-gray-300 mt-2">
                  Write down your thoughts and ideas
                </Text>
              </View>

              <View className="mt-6 bg-white/10 border border-white/20 rounded-xl p-4">
                <Controller
                  control={control}
                  name="title"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      multiline
                      className="bg-transparent text-white w-full text-2xl font-semibold"
                      textAlignVertical="top"
                      placeholder="Title"
                      placeholderTextColor="#9ca3af"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.title && (
                  <Text className="text-red-400 mt-1">{errors.title.message}</Text>
                )}
              </View>

              <View className="flex-1 mt-4 bg-white/10 border border-white/20 rounded-xl p-4">
                <Controller
                  control={control}
                  name="note"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      multiline
                      className="h-full text-white text-lg flex-wrap"
                      textAlignVertical="top"
                      placeholder="Start writing your note here..."
                      placeholderTextColor="#9ca3af"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.note && (
                  <Text className="text-red-400 mt-1">{errors.note.message}</Text>
                )}
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateNote;
