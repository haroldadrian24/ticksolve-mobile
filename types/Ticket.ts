export type TicketStatus = "open" | "in-progress" | "resolved" | "closed" | "pending";

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: string;
  updatedAt: string;
};
