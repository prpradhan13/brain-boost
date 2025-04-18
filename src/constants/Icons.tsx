import { Feather } from "@expo/vector-icons";

export const icons = {
  index: (props: any) => <Feather name="home" size={24} {...props} />,
  todo: (props: any) => <Feather name="list" size={24} {...props} />,
  profile: (props: any) => <Feather name="user" size={24} {...props} />,
};
