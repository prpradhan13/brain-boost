import { Feather } from "@expo/vector-icons";

export const icons = {
  index: (props: any) => <Feather name="home" size={24} {...props} />,
  notes: (props: any) => <Feather name="book-open" size={24} {...props} />,
  profile: (props: any) => <Feather name="user" size={24} {...props} />,
};
