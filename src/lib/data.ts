
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
  { id: "cust_06", name: "James Brown", email: "james.b@example.com", phone: "+1-555-0106", avatarUrl: "https://picsum.photos/seed/106/100/100", joined: "2023-06-10", tags: [], channel: "messenger", status: 'new' },
  { id: "cust_07", name: "Mary Miller", email: "mary.m@example.com", phone: "+1-555-0107", avatarUrl: "https://picsum.photos/seed/107/100/100", joined: "2023-06-11", tags: ["priority"], channel: "instagram", status: 'contacted' },
  { id: "cust_08", name: "John Davis", email: "john.d@example.com", phone: "+1-555-0108", avatarUrl: "https://picsum.photos/seed/108/100/100", joined: "2023-06-12", tags: [], channel: "tiktok", status: 'qualified' },
  { id: "cust_09", name: "Patricia Garcia", email: "patricia.g@example.com", phone: "+1-555-0109", avatarUrl: "https://picsum.photos/seed/109/100/100", joined: "2023-06-15", tags: ["follow_up"], channel: "whatsapp", status: 'demo' },
  { id: "cust_10", name: "Robert Wilson", email: "robert.w@example.com", phone: "+1-555-0110", avatarUrl: "https://picsum.photos/seed/110/100/100", joined: "2023-06-18", tags: ["interested"], channel: "messenger", status: 'new' },
  { id: "cust_11", name: "Jennifer Martinez", email: "jennifer.m@example.com", phone: "+1-555-0111", avatarUrl: "https://picsum.photos/seed/111/100/100", joined: "2023-06-20", tags: [], channel: "instagram", status: 'unqualified' },
  { id: "cust_12", name: "Linda Anderson", email: "linda.a@example.com", phone: "+1-555-0112", avatarUrl: "https://picsum.photos/seed/112/100/100", joined: "2023-06-21", tags: [], channel: "tiktok", status: 'new' },
  { id: "cust_13", name: "William Thomas", email: "william.t@example.com", phone: "+1-555-0113", avatarUrl: "https://picsum.photos/seed/113/100/100", joined: "2023-06-22", tags: ["priority"], channel: "whatsapp", status: 'contacted' },
  { id: "cust_14", name: "Elizabeth Taylor", email: "elizabeth.t@example.com", phone: "+1-555-0114", avatarUrl: "https://picsum.photos/seed/114/100/100", joined: "2023-06-25", tags: [], channel: "messenger", status: 'qualified' },
  { id: "cust_15", name: "Richard Moore", email: "richard.m@example.com", phone: "+1-555-0115", avatarUrl: "https://picsum.photos/seed/115/100/100", joined: "2023-06-28", tags: ["follow_up", "interested"], channel: "instagram", status: 'demo' },
  { id: "cust_16", name: "Susan Jackson", email: "susan.j@example.com", phone: "+1-555-0116", avatarUrl: "https://picsum.photos/seed/116/100/100", joined: "2023-07-01", tags: [], channel: "tiktok", status: 'new' },
  { id: "cust_17", name: "Joseph White", email: "joseph.w@example.com", phone: "+1-555-0117", avatarUrl: "https://picsum.photos/seed/117/100/100", joined: "2023-07-02", tags: ["new_lead"], channel: "whatsapp", status: 'contacted' },
  { id: "cust_18", name: "Jessica Harris", email: "jessica.h@example.com", phone: "+1-555-0118", avatarUrl: "https://picsum.photos/seed/118/100/100", joined: "2023-07-03", tags: [], channel: "messenger", status: 'qualified' },
  { id: "cust_19", name: "Thomas Martin", email: "thomas.m@example.com", phone: "+1-555-0119", avatarUrl: "https://picsum.photos/seed/119/100/100", joined: "2023-07-04", tags: ["priority"], channel: "instagram", status: 'unqualified' },
  { id: "cust_20", name: "Sarah Thompson", email: "sarah.t@example.com", phone: "+1-555-0120", avatarUrl: "https://picsum.photos/seed/120/100/100", joined: "2023-07-05", tags: [], channel: "tiktok", status: 'new' },
  { id: "cust_21", name: "Charles Garcia", email: "charles.g@example.com", phone: "+1-555-0121", avatarUrl: "https://picsum.photos/seed/121/100/100", joined: "2023-07-06", tags: ["interested"], channel: "whatsapp", status: 'contacted' },
  { id: "cust_22", name: "Karen Martinez", email: "karen.m@example.com", phone: "+1-555-0122", avatarUrl: "https://picsum.photos/seed/122/100/100", joined: "2023-07-07", tags: [], channel: "messenger", status: 'qualified' },
  { id: "cust_23", name: "Christopher Robinson", email: "christopher.r@example.com", phone: "+1-555-0123", avatarUrl: "https://picsum.photos/seed/123/100/100", joined: "2023-07-08", tags: ["follow_up"], channel: "instagram", status: 'demo' },
  { id: "cust_24", name: "Nancy Clark", email: "nancy.c@example.com", phone: "+1-555-0124", avatarUrl: "https://picsum.photos/seed/124/100/100", joined: "2023-07-09", tags: [], channel: "tiktok", status: 'new' },
  { id: "cust_25", name: "Daniel Rodriguez", email: "daniel.r@example.com", phone: "+1-555-0125", avatarUrl: "https://picsum.photos/seed/125/100/100", joined: "2023-07-10", tags: [], channel: "whatsapp", status: 'unqualified' },
  { id: "cust_26", name: "Lisa Lewis", email: "lisa.l@example.com", phone: "+1-555-0126", avatarUrl: "https://picsum.photos/seed/126/100/100", joined: "2023-07-11", tags: ["new_lead"], channel: "messenger", status: 'new' },
  { id: "cust_27", name: "Matthew Lee", email: "matthew.l@example.com", phone: "+1-555-0127", avatarUrl: "https://picsum.photos/seed/127/100/100", joined: "2023-07-12", tags: [], channel: "instagram", status: 'contacted' },
  { id: "cust_28", name: "Betty Walker", email: "betty.w@example.com", phone: "+1-555-0128", avatarUrl: "https://picsum.photos/seed/128/100/100", joined: "2023-07-13", tags: ["priority"], channel: "tiktok", status: 'qualified' },
  { id: "cust_29", name: "Anthony Hall", email: "anthony.h@example.com", phone: "+1-555-0129", avatarUrl: "https://picsum.photos/seed/129/100/100", joined: "2023-07-14", tags: [], channel: "whatsapp", status: 'demo' },
  { id: "cust_30", name: "Dorothy Allen", email: "dorothy.a@example.com", phone: "+1-555-0130", avatarUrl: "https://picsum.photos/seed/130/100/100", joined: "2023-07-15", tags: ["follow_up"], channel: "messenger", status: 'new' },
  { id: "cust_31", name: "Paul Young", email: "paul.y@example.com", phone: "+1-555-0131", avatarUrl: "https://picsum.photos/seed/131/100/100", joined: "2023-07-16", tags: [], channel: "instagram", status: 'contacted' },
  { id: "cust_32", name: "Sandra Hernandez", email: "sandra.h@example.com", phone: "+1-555-0132", avatarUrl: "https://picsum.photos/seed/132/100/100", joined: "2023-07-17", tags: ["interested"], channel: "tiktok", status: 'qualified' },
  { id: "cust_33", name: "Mark King", email: "mark.k@example.com", phone: "+1-555-0133", avatarUrl: "https://picsum.photos/seed/133/100/100", joined: "2023-07-18", tags: [], channel: "whatsapp", status: 'unqualified' },
  { id: "cust_34", name: "Ashley Wright", email: "ashley.w@example.com", phone: "+1-555-0134", avatarUrl: "https://picsum.photos/seed/134/100/100", joined: "2023-07-19", tags: ["new_lead"], channel: "messenger", status: 'new' },
  { id: "cust_35", name: "Donald Lopez", email: "donald.l@example.com", phone: "+1-555-0135", avatarUrl: "https://picsum.photos/seed/135/100/100", joined: "2023-07-20", tags: [], channel: "instagram", status: 'contacted' },
  { id: "cust_36", name: "Kimberly Hill", email: "kimberly.h@example.com", phone: "+1-555-0136", avatarUrl: "https://picsum.photos/seed/136/100/100", joined: "2023-07-21", tags: ["priority"], channel: "tiktok", status: 'qualified' },
  { id: "cust_37", name: "Steven Scott", email: "steven.s@example.com", phone: "+1-555-0137", avatarUrl: "https://picsum.photos/seed/137/100/100", joined: "2023-07-22", tags: [], channel: "whatsapp", status: 'demo' },
  { id: "cust_38", name: "Carol Green", email: "carol.g@example.com", phone: "+1-555-0138", avatarUrl: "https://picsum.photos/seed/138/100/100", joined: "2023-07-23", tags: ["follow_up"], channel: "messenger", status: 'new' },
  { id: "cust_39", name: "George Adams", email: "george.a@example.com", phone: "+1-555-0139", avatarUrl: "https://picsum.photos/seed/139/100/100", joined: "2023-07-24", tags: [], channel: "instagram", status: 'contacted' },
  { id: "cust_40", name: "Michelle Baker", email: "michelle.b@example.com", phone: "+1-555-0140", avatarUrl: "https://picsum.photos/seed/140/100/100", joined: "2023-07-25", tags: ["interested"], channel: "tiktok", status: 'qualified' },
  { id: "cust_41", name: "Ronald Gonzalez", email: "ronald.g@example.com", phone: "+1-555-0141", avatarUrl: "https://picsum.photos/seed/141/100/100", joined: "2023-07-26", tags: [], channel: "whatsapp", status: 'unqualified' },
  { id: "cust_42", name: "Amanda Nelson", email: "amanda.n@example.com", phone: "+1-555-0142", avatarUrl: "https://picsum.photos/seed/142/100/100", joined: "2023-07-27", tags: ["new_lead"], channel: "messenger", status: 'new' },
  { id: "cust_43", name: "Timothy Carter", email: "timothy.c@example.com", phone: "+1-555-0143", avatarUrl: "https://picsum.photos/seed/143/100/100", joined: "2023-07-28", tags: [], channel: "instagram", status: 'contacted' },
  { id: "cust_44", name: "Barbara Mitchell", email: "barbara.m@example.com", phone: "+1-555-0144", avatarUrl: "https://picsum.photos/seed/144/100/100", joined: "2023-07-29", tags: ["priority"], channel: "tiktok", status: 'qualified' },
  { id: "cust_45", name: "Jason Perez", email: "jason.p@example.com", phone: "+1-555-0145", avatarUrl: "https://picsum.photos/seed/145/100/100", joined: "2023-07-30", tags: [], channel: "whatsapp", status: 'demo' },
  { id: "cust_46", name: "Melissa Roberts", email: "melissa.r@example.com", phone: "+1-555-0146", avatarUrl: "https://picsum.photos/seed/146/100/100", joined: "2023-07-31", tags: ["follow_up"], channel: "messenger", status: 'new' },
  { id: "cust_47", name: "Kevin Turner", email: "kevin.t@example.com", phone: "+1-555-0147", avatarUrl: "https://picsum.photos/seed/147/100/100", joined: "2023-08-01", tags: [], channel: "instagram", status: 'contacted' },
  { id: "cust_48", name: "Laura Phillips", email: "laura.p@example.com", phone: "+1-555-0148", avatarUrl: "https://picsum.photos/seed/148/100/100", joined: "2023-08-02", tags: ["interested"], channel: "tiktok", status: 'qualified' },
  { id: "cust_49", name: "Brian Campbell", email: "brian.c@example.com", phone: "+1-555-0149", avatarUrl: "https://picsum.photos/seed/149/100/100", joined: "2023-08-03", tags: [], channel: "whatsapp", status: 'unqualified' },
  { id: "cust_50", name: "Cynthia Parker", email: "cynthia.p@example.com", phone: "+1-555-0150", avatarUrl: "https://picsum.photos/seed/150/100/100", joined: "2023-08-04", tags: ["new_lead"], channel: "messenger", status: 'new' },
  { id: "cust_51", name: "Edward Evans", email: "edward.e@example.com", phone: "+1-555-0151", avatarUrl: "https://picsum.photos/seed/151/100/100", joined: "2023-08-05", tags: [], channel: "instagram", status: 'contacted' },
  { id: "cust_52", name: "Deborah Edwards", email: "deborah.e@example.com", phone: "+1-555-0152", avatarUrl: "https://picsum.photos/seed/152/100/100", joined: "2023-08-06", tags: ["priority"], channel: "tiktok", status: 'qualified' },
  { id: "cust_53", name: "Stephanie Collins", email: "stephanie.c@example.com", phone: "+1-555-0153", avatarUrl: "https://picsum.photos/seed/153/100/100", joined: "2023-08-07", tags: [], channel: "whatsapp", status: 'demo' },
  { id: "cust_54", name: "Jeff Stewart", email: "jeff.s@example.com", phone: "+1-555-0154", avatarUrl: "https://picsum.photos/seed/154/100/100", joined: "2023-08-08", tags: ["follow_up"], channel: "messenger", status: 'new' },
  { id: "cust_55", name: "Sharon Sanchez", email: "sharon.s@example.com", phone: "+1-555-0155", avatarUrl: "https://picsum.photos/seed/155/100/100", joined: "2023-08-09", tags: ["interested"], channel: "instagram", status: 'unqualified' },
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
  // Only return conversations for the first 5 customers for demo purposes
  const customerIdsWithConversations = new Set(conversations.map(c => c.customer.id));
  const customersWithConversations = customers.filter(c => customerIdsWithConversations.has(c.id));
  const customersWithoutConversations = customers.filter(c => !customerIdsWithConversations.has(c.id));

  const newConversations = customersWithoutConversations.map((customer, index) => ({
    id: `conv_${String(conversations.length + index + 1).padStart(2, '0')}`,
    customer: customer,
    channel: customer.channel,
    unreadCount: 0,
    messages: [
      { id: `msg_${String(conversations.length + index + 1).padStart(2, '0')}a`, text: "Hi there!", sender: 'customer' as 'customer', timestamp: `${index + 2} hours ago` }
    ]
  }));
  
  return [...conversations, ...newConversations];
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
