import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Plus, History, User, LogOut } from "lucide-react-native";
import TicketList from "../components/TicketList";
import TicketForm from "../components/TicketForm";
import TicketDetail from "../components/TicketDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ticket } from "../types/Ticket";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Load tickets from storage on component mount
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const storedTickets = await AsyncStorage.getItem("tickets");
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
      }
    } catch (error) {
      console.error("Failed to load tickets:", error);
    }
  };

  const saveTickets = async (updatedTickets: Ticket[]) => {
    try {
      await AsyncStorage.setItem("tickets", JSON.stringify(updatedTickets));
      setTickets(updatedTickets);
    } catch (error) {
      console.error("Failed to save tickets:", error);
    }
  };

  // Mock function for logout
  const handleLogout = () => {
    router.replace("/");
  };

  // Handle ticket selection
  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  // Close ticket detail view
  const handleCloseDetail = () => {
    setSelectedTicket(null);
  };

  // Handle creating a new ticket
  const handleCreateTicket = (
    ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">,
  ) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTickets = [...tickets, newTicket];
    saveTickets(updatedTickets);
    setShowTicketForm(false);
  };

  // Handle editing a ticket
  const handleEditTicket = (ticketId: string) => {
    const ticketToEdit = tickets.find((ticket) => ticket.id === ticketId);
    if (ticketToEdit) {
      setSelectedTicket(ticketToEdit);
      setIsEditing(true);
      setShowTicketForm(true);
    }
  };

  // Handle updating a ticket
  const handleUpdateTicket = (
    updatedTicketData: Omit<
      Ticket,
      "id" | "createdAt" | "updatedAt" | "status"
    >,
  ) => {
    if (!selectedTicket) return;

    const updatedTicket: Ticket = {
      ...selectedTicket,
      ...updatedTicketData,
      updatedAt: new Date().toISOString(),
    };

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id ? updatedTicket : ticket,
    );

    saveTickets(updatedTickets);
    setShowTicketForm(false);
    setIsEditing(false);
    setSelectedTicket(updatedTicket);
  };

  // Handle deleting a ticket
  const handleDeleteTicket = (ticketId: string) => {
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
            const updatedTickets = tickets.filter(
              (ticket) => ticket.id !== ticketId,
            );
            saveTickets(updatedTickets);
            setSelectedTicket(null);
          },
          style: "destructive",
        },
      ],
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        {/* Main Content Area */}
        <View className="flex-1 px-4 pt-4 bg-gray-50">
        

          {activeTab === "dashboard" && !selectedTicket && !showTicketForm && (
  <>
    <Text className="text-2xl font-semibold mb-4 text-gray-700">
        Dashboard    
    </Text>
    <View className="flex-1">
      <TicketList
        tickets={tickets}
        onTicketPress={handleTicketSelect}
        emptyMessage="No tickets yet."
      />
    </View>
  </>
)}

{activeTab === "history" && !selectedTicket && !showTicketForm && (
  <>
    <Text className="text-2xl font-semibold mb-4 text-gray-700">
      Ticket History
    </Text>
    <View className="flex-1">
      <TicketList
        tickets={tickets}
        onTicketPress={handleTicketSelect}
        emptyMessage="No ticket history available."
      />
    </View>
  </>
)}

          {activeTab === "profile" && !selectedTicket && !showTicketForm && (
            <View className="flex-1 justify-center items-center">
              <View className="w-24 h-24 rounded-full bg-gray-300 mb-4 items-center justify-center">
                <User size={40} color="#1c1c1c" />
              </View>
              <Text className="text-xl font-semibold mb-2">Student Name</Text>
              <Text className="text-gray-600 mb-1">ID: ST12345</Text>
              <Text className="text-gray-600 mb-6">student@example.com</Text>

              <TouchableOpacity className="bg-[#1c1c1c] py-2 px-6 rounded-lg">
                <Text className="text-white font-semibold">Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Ticket Detail View */}
          {selectedTicket && !showTicketForm && (
            <TicketDetail
              ticket={selectedTicket}
              onBack={handleCloseDetail}
              onEdit={handleEditTicket}
              onDelete={handleDeleteTicket}
            />
          )}

          {/* Ticket Form */}
          {showTicketForm && (
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-semibold text-gray-700">
                  {isEditing ? "Edit Ticket" : "Create New Ticket"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowTicketForm(false);
                    setIsEditing(false);
                  }}
                >
                  <Text className="text-#1c1c1c-500">Cancel</Text>
                </TouchableOpacity>
              </View>
              <TicketForm
                initialValues={
                  isEditing && selectedTicket
                    ? {
                        title: selectedTicket.title,
                        description: selectedTicket.description,
                        priority: selectedTicket.priority,
                        category: selectedTicket.category,
                      }
                    : undefined
                }
                onSubmit={isEditing ? handleUpdateTicket : handleCreateTicket}
                isEditing={isEditing}
              />
            </View>
          )}

          {/* Floating Action Button */}
          {!showTicketForm && !selectedTicket && (
            <TouchableOpacity
              className="absolute bottom-20 right-6 w-14 h-14 rounded-full bg-[#1c1c1c] items-center justify-center shadow-lg"
              onPress={() => {
                setIsEditing(false);
                setShowTicketForm(true);
              }}
            >
              <Plus size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom Navigation Bar */}
        <View className="flex-row justify-around items-center py-4 bg-white border-t border-gray-200">
          <TouchableOpacity
            className={`items-center ${activeTab === "dashboard" ? "opacity-100" : "opacity-50"}`}
            onPress={() => setActiveTab("dashboard")}
          >
            <View className="w-6 h-6 mb-1 items-center justify-center">
              <Text className="text-2xl">🏠</Text>
            </View>
            <Text
              className={`text-xs ${activeTab === "dashboard" ? "font-semibold" : ""}`}
            >
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`items-center ${activeTab === "history" ? "opacity-100" : "opacity-50"}`}
            onPress={() => setActiveTab("history")}
          >
            <History size={24} color="#1c1c1c" />
            <Text
              className={`text-xs ${activeTab === "history" ? "font-semibold" : ""}`}
            >
              History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`items-center ${activeTab === "profile" ? "opacity-100" : "opacity-50"}`}
            onPress={() => setActiveTab("profile")}
          >
            <User size={24} color="#1c1c1c" />
            <Text
              className={`text-xs ${activeTab === "profile" ? "font-semibold" : ""}`}
            >
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center opacity-50"
            onPress={handleLogout}
          >
            <LogOut size={24} color="#1c1c1c" />
            <Text className="text-xs">Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
