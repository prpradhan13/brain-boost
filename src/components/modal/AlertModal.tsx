import { View, Text, Modal } from "react-native";
import React from "react";

interface AlertModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  alertTitle: string;
  alertMessage: string;
  handleContinue: () => void;
}

const AlertModal = ({
  modalVisible,
  setModalVisible,
  alertMessage,
  alertTitle,
  handleContinue=() => {},
}: AlertModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-[#000000aa]">
        <View className="bg-white rounded-lg p-4 w-4/5">
          <Text className="text-black text-xl font-bold text-center">
            {alertTitle}
          </Text>
          <Text className="text-black text-center">{alertMessage}</Text>

          <View className="flex-row mt-4">
            <Text
              className="text-blue-500 w-1/2 text-center text-lg font-semibold border-r border-gray-300"
              onPress={() => {
                handleContinue();
                setModalVisible(false);
              }}
            >
              Continue
            </Text>
            <Text
              className="text-red-500 w-1/2 text-center text-lg font-semibold"
              onPress={() => setModalVisible(false)}
            >
              Cancel
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
