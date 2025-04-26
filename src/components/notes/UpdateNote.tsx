import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  Modal,
} from "react-native";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { NotesType } from "@/src/types/notes.type";
import { Controller, useForm } from "react-hook-form";
import { noteForm, NoteSchema } from "@/src/validation/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateNote } from "@/src/utils/query/notesQuery";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { updateStatusToast } from "@/src/utils/helpingFunction";

interface UpdateNoteProps {
  noteId: number;
  visible: boolean;
  setVisible: (value: boolean) => void;
}

const UpdateNote = ({ noteId, visible, setVisible }: UpdateNoteProps) => {
  const queryClient = useQueryClient();

  const noteDataFromQueryCache = queryClient.getQueryData<NotesType>([
    "note",
    noteId,
  ]);

  const {
    reset,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm<NoteSchema>({
    resolver: zodResolver(noteForm),
    defaultValues: {
      title: noteDataFromQueryCache?.title ?? "Untitled",
      note: noteDataFromQueryCache?.note ?? "No Notes",
    },
  });

  const { mutate, isPending } = useUpdateNote();

  const handleClose = () => {
    const { title, note } = getValues();
    if (
      title !== noteDataFromQueryCache?.title ||
      note !== noteDataFromQueryCache?.note
    ) {
      Alert.alert("Discard changes?", "You have unsaved changes.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            reset();
            setVisible(false);
          },
        },
      ]);
    } else {
      reset();
      setVisible(false);
    }
  };

  const handleSave = (data: NoteSchema) => {
    const initialValues = {
      title: noteDataFromQueryCache?.title ?? "Untitled",
      note: noteDataFromQueryCache?.note ?? "No Notes",
    }

    const noChanges = Object.keys(initialValues).every(
      (key) => data[key as keyof NoteSchema] === initialValues[key as keyof typeof initialValues]
    )

    if (noChanges) {
      setVisible(false);
      updateStatusToast({
        type: "info",
        message: "No Changes Detect"
      })
      return;
    }

    mutate(
      { ...data, id: noteId },
      {
        onSuccess: (returnedData) => {
          queryClient.setQueryData<NotesType>(["note", noteId], (oldData) => {
            if (!oldData) return returnedData;
            return { ...oldData, ...returnedData };
          });
          reset();
          setVisible(false);
          
        },
        onError: (error) => {
          updateStatusToast({
            type: "error",
            message: "Opps! Cannot update note."
          })
          console.log("Error", error); 
        }
      }
    );
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={() => setVisible(false)}
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 p-4 bg-black">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
};

export default UpdateNote;
