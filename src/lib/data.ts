
export type Channel = "whatsapp" | "messenger" | "instagram" | "tiktok";

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export type CustomerStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'demo';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  joined: string;
  tags: string[];
  channel: Channel;
  status: CustomerStatus;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'customer';
}

export interface Conversation {
  id: string;
  customer: Customer;
  channel: Channel;
  messages: Message[];
  unreadCount: number;
}

export interface PlatformStats {
  platform: Channel;
  totalConversations: number;
  newLeads: number;
  responseRate: number;
  conversionRate: number;
}

export const currentUser: User = {
  id: "user_01",
  name: "Alex Green",
  avatarUrl: "https://picsum.photos/seed/user/100/100",
};

const customers: Customer[] = [
  { id: "cust_01", name: "Sarah Johnson", email: "sarah.j@example.com", phone: "+1-555-0101", avatarUrl: "https://picsum.photos/seed/101/100/100", joined: "2023-05-12", tags: ["priority"], channel: "whatsapp", status: 'new' },
  { id: "cust_02", name: "Michael Chen", email: "m.chen@example.com", phone: "+1-555-0102", avatarUrl: "https://picsum.photos/seed/102/100/100", joined: "2023-05-15", tags: ["interested"], channel: "messenger", status: 'contacted' },
  { id: "cust_03", name: "Emily Rodriguez", email: "emily.r@example.com", phone: "+1-555-0103", avatarUrl: "https://picsum.photos/seed/103/100/100", joined: "2023-05-20", tags: ["follow_up"], channel: "instagram", status: 'qualified' },
  { id: "cust_04", name: "David Lee", email: "david.lee@example.com", phone: "+1-555-0104", avatarUrl: "https://picsum.photos/seed/104/100/100", joined: "2023-06-01", tags: [], channel: "tiktok", status: 'demo' },
  { id: "cust_05", name: "Jessica Williams", email: "jess.w@example.com", phone: "+1-555-0105", avatarUrl: "https://picsum.photos/seed/105/100/100", joined: "2023-06-05", tags: ["new_lead"], channel: "whatsapp", status: 'new' },
];

export const conversations: Conversation[] = [
  {
    id: "conv_01",
    customer: customers[0],
    channel: "whatsapp",
    unreadCount: 2,
    messages: [
      { id: "msg_01a", text: "Hello! I'm interested in your services. Can you tell me more?", sender: 'customer', timestamp: "10:30 AM" },
      { id: "msg_01b", text: "Hi Sarah! Absolutely. We offer a range of solutions. What specifically are you looking for?", sender: 'user', timestamp: "10:31 AM" },
      { id: "msg_01c", text: "I'm looking for a tool to manage my social media messages.", sender: 'customer', timestamp: "10:32 AM" },
      { id: "msg_01d", text: "You've come to the right place! ConnectVerse is perfect for that.", sender: 'user', timestamp: "10:33 AM" },
    ],
  },
  {
    id: "conv_02",
    customer: customers[1],
    channel: "messenger",
    unreadCount: 0,
    messages: [
      { id: "msg_02a", text: "Hi, I saw your ad and wanted to get pricing details.", sender: 'customer', timestamp: "Yesterday" },
      { id: "msg_02b", text: "Hi Michael, thanks for reaching out. I can send you our pricing sheet. What's the best email for you?", sender: 'user', timestamp: "Yesterday" },
    ],
  },
  {
    id: "conv_03",
    customer: customers[2],
    channel: "instagram",
    unreadCount: 1,
    messages: [
      { id: "msg_03a", text: "Your product looks amazing! 🔥", sender: 'customer', timestamp: "3 days ago" },
    ],
  },
  {
    id: "conv_04",
    customer: customers[3],
    channel: "tiktok",
    unreadCount: 0,
    messages: [
      { id: "msg_04a", text: "Can I schedule a demo for next week?", sender: 'customer', timestamp: "4 days ago" },
      { id: "msg_04b", text: "Definitely, David. I've sent a calendar invite to your email. Talk to you then!", sender: 'user', timestamp: "4 days ago" },
    ],
  },
  {
    id: "conv_05",
    customer: customers[4],
    channel: "whatsapp",
    unreadCount: 0,
    messages: [
      { id: "msg_05a", text: "Is this the right number for customer support?", sender: 'customer', timestamp: "5 days ago" },
      { id: "msg_05b", text: "Hi Jessica, yes it is! How can I help you today?", sender: 'user', timestamp: "5 days ago" },
    ],
  },
];

const platformStats: PlatformStats[] = [
  { platform: 'whatsapp', totalConversations: 25, newLeads: 5, responseRate: 95, conversionRate: 20 },
  { platform: 'messenger', totalConversations: 15, newLeads: 3, responseRate: 90, conversionRate: 15 },
  { platform: 'instagram', totalConversations: 10, newLeads: 2, responseRate: 88, conversionRate: 18 },
  { platform: 'tiktok', totalConversations: 8, newLeads: 2, responseRate: 85, conversionRate: 25 },
];

export const businessInfo = {
  companyName: "ConnectVerse Inc.",
  address: "123 Main Street, Anytown, USA 12345",
  phone: "+1 (555) 123-4567",
  email: "contact@connectverse.com",
};

export const getCustomers = () => {
  return customers;
}

export const getConversations = () => {
  return conversations;
}

export const getDashboardStats = () => {
  return {
    totalConversations: 58,
    newLeads: 12,
    responseRate: 92,
    openConversations: 3,
  };
};

export const getConversationData = () => {
  return [
    { month: 'Jan', new: 12, resolved: 20 },
    { month: 'Feb', new: 18, resolved: 25 },
    { month: 'Mar', new: 25, resolved: 30 },
    { month: 'Apr', new: 22, resolved: 28 },
    { month: 'May', new: 30, resolved: 35 },
    { month: 'Jun', new: 28, resolved: 32 },
  ];
};

export const getPlatformStats = () => {
    return platformStats;
}
