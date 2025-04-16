import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/src/validation/auth";
import { supabase } from "@/src/utils/lib/supabase";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: error.message,
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Login successful",
        });
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: error.errors[0].message,
        });
      } else if (error instanceof Error) {
        Toast.show({
          type: "error",
          text1: "Unexpected error",
          text2:
            error.message || "An unexpected error occurred. Please try again.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "An unknown error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center p-6">
      <Text className="text-white text-3xl font-semibold">Welcome Back!</Text>
      <View className="w-full gap-4 mt-10">
        <View>
          <Text className="text-white text-lg font-medium">Email</Text>
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
          {errors.email && (
            <Text className="text-red-500">{errors.email.message}</Text>
          )}
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
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className={`p-3 rounded-xl mt-2 ${
            loading ? "bg-white/70" : "bg-[#eee]"
          }`}
        >
          {loading ? (
            <ActivityIndicator color={"#000"} size={24} />
          ) : (
            <Text className="text-lg font-medium text-center">Log in</Text>
          )}
        </Pressable>
      </View>

      <Link
        href={"/(auth)/signup"}
        className="text-blue-500 mt-4 font-medium text-lg"
      >
        Create an account?
      </Link>
    </SafeAreaView>
  );
};

export default Login;
