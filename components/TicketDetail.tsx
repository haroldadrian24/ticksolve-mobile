import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  Calendar,
  AlertCircle,
} from "lucide-react-native";
import { useRouter } from "expo-router";


interface TicketDetailProps {
  ticket?: {
    id: string;
    title: string;
    description: string;
    status: "open" | "in-progress" | "resolved" | "closed" | "pending";
    priority: "low" | "medium" | "high";
    category: string;
    createdAt: string;
    updatedAt: string;
  };
  onEdit?: (ticketId: string) => void;
  onDelete?: (ticketId: string) => void;
  onBack?: () => void;
}

const TicketDetail = ({
  ticket = {
    id: "1",
    title: "Cannot access student portal",
    description:
      'I am unable to log into the student portal. It shows an error message saying "Invalid credentials" even though I am sure my password is correct.',
    status: "open",
    priority: "high",
    category: "Access Issues",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T10:30:00Z",
  },
  onEdit = () => {},
  onDelete = () => {},
  onBack = () => {},
}: TicketDetailProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = () => {
    // Show native alert for confirmation
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this ticket? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            onDelete(ticket.id);
            onBack();
          },
          style: "destructive",
        },
      ],
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500";
      case "in-progress":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
        <TouchableOpacity
          onPress={onBack}
          className="p-2 rounded-full bg-gray-100"
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4">Ticket Details</Text>
        <View className="flex-row ml-auto">
          <TouchableOpacity
            onPress={() => onEdit(ticket.id)}
            className="p-2 rounded-full bg-gray-100 mr-2"
          >
            <Edit size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            className="p-2 rounded-full bg-red-100"
          >
            <Trash2 size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Title */}
        <Text className="text-2xl font-bold mb-2">{ticket.title}</Text>

        {/* Status and Priority */}
        <View className="flex-row mb-4">
          <View
            className={`rounded-full px-3 py-1 mr-2 ${getStatusColor(ticket.status)}`}
          >
            <Text className="text-white font-medium capitalize">
              {ticket.status}
            </Text>
          </View>
          <View
            className={`rounded-full px-3 py-1 ${getPriorityColor(ticket.priority)}`}
          >
            <Text className="text-white font-medium capitalize">
              {ticket.priority} Priority
            </Text>
          </View>
        </View>

        {/* Category */}
        <View className="mb-4 bg-gray-100 p-3 rounded-lg">
          <Text className="text-gray-500 mb-1">Category</Text>
          <Text className="font-medium">{ticket.category}</Text>
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className="text-gray-500 mb-1">Description</Text>
          <View className="bg-gray-100 p-3 rounded-lg">
            <Text className="text-base">{ticket.description}</Text>
          </View>
        </View>

        {/* Timestamps */}
        <View className="mb-4 bg-gray-100 p-3 rounded-lg">
          <View className="flex-row items-center mb-2">
            <Calendar size={16} color="#6b7280" />
            <Text className="text-gray-500 ml-2">
              Created: {formatDate(ticket.createdAt)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={16} color="#6b7280" />
            <Text className="text-gray-500 ml-2">
              Last Updated: {formatDate(ticket.updatedAt)}
            </Text>
          </View>
        </View>

        {/* Additional Information */}
        <View className="mb-4 bg-blue-50 p-4 rounded-lg flex-row items-start">
          <AlertCircle size={20} color="#3b82f6" />
          <Text className="text-blue-700 ml-2 flex-1">
            For urgent assistance, please contact the IT helpdesk directly at
            extension 1234.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TicketDetail;
