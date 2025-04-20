import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react-native";


type TicketStatus = "open" | "in-progress" | "resolved" | "closed" | "pending";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: string;
  updatedAt: string;
};

type TicketListProps = {
  tickets?: Ticket[];
  isLoading?: boolean;
  onTicketPress?: (ticket: Ticket) => void;
  emptyMessage?: string;
};

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case "open":
      return "text-red-500";
    case "closed":
      return "text-green-500";
    case "pending":
      return "text-yellow-500";
    default:
      return "text-gray-500";
  }
};

const getStatusIcon = (status: TicketStatus) => {
  switch (status) {
    case "open":
      return <AlertCircle size={16} className="text-red-500" />;
    case "closed":
      return <CheckCircle size={16} className="text-green-500" />;
    case "pending":
      return <Clock size={16} className="text-yellow-500" />;
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TicketItem = ({
  ticket,
  onPress,
}: {
  ticket: Ticket;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 mb-2 rounded-lg shadow-sm border border-gray-100 flex-row justify-between items-center"
    >
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-800">
          {ticket.title}
        </Text>
        <View className="flex-row items-center mt-1">
          {getStatusIcon(ticket.status)}
          <Text className={`text-xs ml-1 ${getStatusColor(ticket.status)}`}>
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </Text>
          <Text className="text-xs text-gray-500 ml-4">
            {formatDate(ticket.createdAt)}
          </Text>
        </View>
      </View>
      <ChevronRight size={20} className="text-gray-400" />
    </TouchableOpacity>
  );
};

const TicketList = ({
  tickets = [
    {
      id: "1",
      title: "Wi-Fi not working in dorm",
      description: "Cannot connect to the campus Wi-Fi in Building B, Room 204",
      status: "open",
      priority: "high",
      category: "Network",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Projector malfunction in Lecture Hall A",
      description: "The projector in Lecture Hall A is showing a blue screen",
      status: "pending",
      priority: "medium",
      category: "Equipment",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      title: "Student portal login issue",
      description:
        "Unable to login to the student portal with correct credentials",
      status: "closed",
      priority: "medium",
      category: "Software",
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  ],
  isLoading = false,
  onTicketPress = () => {},
  emptyMessage = "No tickets found",
}: TicketListProps) => {
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0891b2" />
        <Text className="mt-4 text-gray-500">Loading tickets...</Text>
      </View>
    );
  }

  if (tickets.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Text className="text-gray-500 text-center">{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TicketItem ticket={item} onPress={() => onTicketPress(item)} />
        )}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TicketList;
