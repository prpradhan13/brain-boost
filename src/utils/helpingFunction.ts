import Toast from "react-native-toast-message";

interface UpdateStatusToastProps {
    type: "info" | "success" | "error";
    message: string;
}


export const updateStatusToast = ({ message, type }: UpdateStatusToastProps) => {
    Toast.show({
        type: type,
        text1: message,
        position: "bottom",
        bottomOffset: 50
    })
}