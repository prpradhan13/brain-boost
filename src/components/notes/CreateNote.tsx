import { View, Text, Modal, Pressable } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

interface CreateNoteProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const CreateNote = ({ visible, setVisible }: CreateNoteProps) => {
  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className="flex-1 p-4 bg-black">
        <View className="flex-row justify-between items-center">
          <Pressable
            onPress={handleClose}
            className="bg-white rounded-xl w-11 h-11 items-center justify-center"
          >
            <Feather name="x" size={22} color="black" />
          </Pressable>
          <Pressable className="bg-white rounded-xl w-11 h-11 items-center justify-center">
            <Feather name="check" size={22} color="black" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default CreateNote;
