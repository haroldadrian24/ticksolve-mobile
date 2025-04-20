import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { AlertTriangle, Check } from "lucide-react-native";
import { Ticket } from "../types/Ticket";


interface TicketFormProps {
  initialValues?: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    category: string;
  };
  onSubmit?: (values: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    category: string;
  }) => void;
  isEditing?: boolean;
}

const TicketForm = ({
  initialValues = {
    title: "",
    description: "",
    priority: "medium",
    category: "General",
  },
  onSubmit = () => {},
  isEditing = false,
}: TicketFormProps) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ["General", "Technical", "Academic", "Financial", "Other"];

  const handleChange = (field: string, value: string) => {
    setValues({ ...values, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handlePriorityChange = (priority: "low" | "medium" | "high") => {
    setValues({ ...values, priority });
  };

  const handleCategoryChange = (category: string) => {
    setValues({ ...values, category });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!values.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!values.description.trim()) {
      newErrors.description = "Description is required";
    } else if (values.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(values);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
          <Text className="text-2xl font-bold mb-6">
            {isEditing ? "Edit Ticket" : "Create New Ticket"}
          </Text>

          {/* Title */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-1">Title</Text>
            <TextInput
              className={`border rounded-lg p-3 ${errors.title ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter ticket title"
              value={values.title}
              onChangeText={(text) => handleChange("title", text)}
            />
            {errors.title && (
              <View className="flex-row items-center mt-1">
                <AlertTriangle size={16} color="#EF4444" />
                <Text className="text-red-500 ml-1 text-xs">{errors.title}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-1">Description</Text>
            <TextInput
              className={`border rounded-lg p-3 h-24 ${errors.description ? "border-red-500" : "border-gray-300"}`}
              placeholder="Describe your issue"
              value={values.description}
              onChangeText={(text) => handleChange("description", text)}
              multiline
              textAlignVertical="top"
            />
            {errors.description && (
              <View className="flex-row items-center mt-1">
                <AlertTriangle size={16} color="#EF4444" />
                <Text className="text-red-500 ml-1 text-xs">{errors.description}</Text>
              </View>
            )}
          </View>

          {/* Priority */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">Priority</Text>
            <View className="flex-row space-x-2">
              {(["low", "medium", "high"] as const).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  className={`flex-1 py-2 px-3 rounded-lg border ${
                    values.priority === priority ? "border-[#1c1c1c]" : "border-gray-300"
                  }`}
                  onPress={() => handlePriorityChange(priority)}
                >
                  <Text
                    className={`text-center capitalize ${
                      values.priority === priority ? "text-black font-medium" : "text-gray-700"
                    }`}
                  >
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category */}
          <View className="mb-6">
            <Text className="text-sm font-medium mb-2">Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  className={`py-2 px-4 rounded-lg border ${
                    values.category === category ? "border-[#1c1c1c]" : "border-gray-300"
                  }`}
                  onPress={() => handleCategoryChange(category)}
                >
                  <Text
                    className={`text-center ${
                      values.category === category ? "text-black font-medium" : "text-gray-700"
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            className="bg-[#1c1c1c] py-3 px-4 rounded-lg mb-6"
            onPress={handleSubmit}
          >
            <View className="flex-row justify-center items-center">
              <Check size={20} color="white" />
              <Text className="text-white font-medium ml-2">
                {isEditing ? "Update Ticket" : "Submit Ticket"}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default TicketForm;
