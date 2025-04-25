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
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 p-4 bg-black">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="w-full h-full"
          >
            <View className="flex-row justify-between items-center">
              <Pressable
                onPress={handleClose}
                disabled={isPending}
                className="bg-white rounded-xl w-11 h-11 items-center justify-center"
              >
                <Feather name="x" size={22} color="black" />
              </Pressable>
              <Pressable
                onPress={handleSubmit(handleSave)}
                disabled={isPending}
                className="bg-white rounded-xl w-11 h-11 items-center justify-center"
              >
                {isPending ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <Feather name="check" size={22} color="black" />
                )}
              </Pressable>
            </View>

            <View className="bg-[#212121] rounded-xl mt-4 p-2">
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    multiline
                    className="bg-transparent text-white w-full text-2xl"
                    textAlignVertical="top"
                    placeholder="Title"
                    placeholderTextColor={"#A1A1AA"}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.title && (
                <Text className="text-red-500">{errors.title.message}</Text>
              )}
            </View>

            <View className="flex-1 mt-4 bg-[#212121] rounded-xl p-2">
              <Controller
                control={control}
                name="note"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    multiline
                    className=" h-full text-white text-lg flex-wrap"
                    textAlignVertical="top"
                    placeholder="Note"
                    placeholderTextColor={"#A1A1AA"}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.note && (
                <Text className="text-red-500">{errors.note.message}</Text>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateNote;
