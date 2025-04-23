import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";

interface AlertModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  alertTitle: string;
  alertMessage: string;
  handleContinue: () => void;
  pendingState?: boolean;
}

const AlertModal = ({
  modalVisible,
  setModalVisible,
  alertMessage,
  alertTitle,
  handleContinue = () => {},
  pendingState = false,
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
            <TouchableOpacity
              className="w-1/2 border-r border-gray-300"
              disabled={pendingState}
              onPress={() => {
                handleContinue();
                setModalVisible(false);
              }}
            >
              {pendingState ? (
                <ActivityIndicator size="small" color={"#3b82f6"} />
              ) : (
                <Text className="text-blue-500 text-lg font-semibold text-center">Continue</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/2"
              disabled={pendingState}
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-red-500 text-lg font-semibold text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
