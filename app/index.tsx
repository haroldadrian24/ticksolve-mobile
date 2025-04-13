import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Lock, User, AlertCircle } from "lucide-react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ studentId: "", password: "" });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { studentId: "", password: "" };

    if (!studentId.trim()) {
      newErrors.studentId = "Student ID is required";
      isValid = false;
    } else if (!/^\d+$/.test(studentId)) {
      newErrors.studentId = "Student ID must contain only numbers";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      // In a real app, you would authenticate with a server here
      // For now, we'll just navigate to the dashboard
      router.replace("/dashboard");
    } else {
      Alert.alert("Validation Error", "Please check the form for errors");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-10">
        <View className="items-center mb-10">
          <Text className="text-3xl font-bold text-#1c1c1c-600">TickSolve</Text>
          <Text className="text-gray-500 mt-2 text-center">
            Login to manage your support tickets
          </Text>
        </View>

        <View className="space-y-6 w-full">
          <View>
            <Text className="text-gray-700 mb-2 font-medium">Student ID</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
              <User size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-800"
                placeholder="Enter your student ID"
                keyboardType="numeric"
                value={studentId}
                onChangeText={setStudentId}
                autoCapitalize="none"
              />
            </View>
            {errors.studentId ? (
              <View className="flex-row items-center mt-1">
                <AlertCircle size={16} color="#EF4444" />
                <Text className="text-red-500 ml-1">{errors.studentId}</Text>
              </View>
            ) : null}
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
              <Lock size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-800"
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            {errors.password ? (
              <View className="flex-row items-center mt-1">
                <AlertCircle size={16} color="#EF4444" />
                <Text className="text-red-500 ml-1">{errors.password}</Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            className="mt-4 bg-[#1c1c1c] py-3 rounded-lg items-center"
            onPress={handleLogin}
          >
            <Text className="text-white font-bold text-lg">Login</Text>
          </TouchableOpacity>

          <TouchableOpacity className="mt-4 items-center">
            <Text className="text-gray-600">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 items-center">
          <Text className="text-gray-500 text-sm">
            © {new Date().getFullYear()} TickSolve - Student Support System
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
