import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupSchema } from "@/src/validation/auth";
import { supabase } from "@/src/utils/lib/supabase";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupSchema) => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            username: data.username,
          },
        },
      });

      if (error) {
        Toast.show({
          type: "error",
          text1: "Sign up Failed",
          text2: error.message,
        });
      } else if (!session) {
        Toast.show({
          type: "info",
          text1: "Please check your inbox for email verification!",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Sign up successful",
        });
      }
    } catch (err: unknown) {
      Toast.show({
        type: "error",
        text1: "Internal server error",
      });
      throw new Error(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center p-4">
      <Text className="text-white text-3xl font-semibold">Create an account</Text>
      <View className="w-full gap-4 mt-10">
        <View>
          <Text className="text-white">Full name</Text>
          <View className="flex-row gap-2 items-center border border-gray-300 px-3 py-1 rounded-xl">
            <Feather name="user" size={20} color="#c2c2c2" />
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor={"#c2c2c2"}
              onChangeText={(text) => setValue("fullName", text)}
              {...register("fullName", { required: true })}
              className="text-white text-lg"
            />
          </View>
          {errors.fullName && <Text>{errors.fullName.message}</Text>}
        </View>

        <View>
          <Text className="text-white">Username</Text>
          <View className="flex-row gap-2 items-center border border-gray-300 px-3 py-1 rounded-xl">
            <Feather name="user" size={20} color="#c2c2c2" />
            <TextInput
              placeholder="Enter your username"
              placeholderTextColor={"#c2c2c2"}
              onChangeText={(text) => setValue("username", text)}
              {...register("username", { required: true })}
              className="text-white text-lg"
            />
          </View>
          {errors.username && <Text>{errors.username.message}</Text>}
        </View>

        <View>
          <Text className="text-white">Email</Text>
          <View className="flex-row gap-2 items-center border border-gray-300 px-3 py-1 rounded-xl">
            <Feather name="mail" size={20} color="#c2c2c2" />
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor={"#c2c2c2"}
              autoCapitalize="none"
              onChangeText={(text) => setValue("email", text)}
              {...register("email", { required: true })}
              className="text-white text-lg"
            />
          </View>

          {errors.email && <Text>{errors.email.message}</Text>}
        </View>

        <View className="">
          <Text className="text-white text-lg font-medium">Password</Text>
          <View className="flex-row justify-between items-center px-3 py-1 border border-gray-300 rounded-xl overflow-hidden">
            <View className="flex-row gap-2 items-center">
              <Feather name="lock" size={20} color="#c2c2c2" />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={"#c2c2c2"}
                secureTextEntry={passwordVisible}
                onChangeText={(text) => setValue("password", text)}
                {...register("password", { required: true })}
                className="w-[80%] text-white text-lg"
              />
            </View>

            <Pressable onPress={() => setPasswordVisible((prev) => !prev)}>
              {passwordVisible ? (
                <Feather name="eye" size={20} color="#fff" />
              ) : (
                <Feather name="eye-off" size={20} color="#fff" />
              )}
            </Pressable>
          </View>
          {errors.password && (
            <Text className="text-red-500">{errors.password.message}</Text>
          )}
        </View>

        <Pressable
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
          className="bg-[#eee] p-3 rounded-xl mt-2"
        >
          {loading ? (
            <ActivityIndicator color={"#000"} size={24} />
          ) : (
            <Text className="text-lg font-medium text-center">Sign up</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
