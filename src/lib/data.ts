
export type Channel = "whatsapp" | "messenger" | "instagram" | "tiktok";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export type CustomerStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'demo' | 'won';

export interface Deal {
  id: string;
  name: string;
  status: 'Won' | 'Lost' | 'In Progress';
  amount: number;
  closeDate: string;
}

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
  dealName: string;
  dealHistory: Deal[];
}

export interface NewCustomer {
    name: string;
    email: string;
    phone?: string;
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

export interface Email {
    id: string;
    from: {
        name: string;
        email: string;
        avatar: string;
    };
    subject: string;
    body: string;
    timestamp: string;
    isRead: boolean;
    folder: 'inbox' | 'sent' | 'drafts' | 'trash';
}

export interface NewEmail {
    subject: string;
    body: string;
    to: string; // Assuming 'to' is needed for sending
}

export interface DashboardStats {
    totalConversations: number;
    newLeads: number;
    responseRate: number;
    openConversations: number;
}

export interface ConversationTrendPoint {
    month: string;
    new: number;
    resolved: number;
}

export interface DealStageValue {
    stage: string;
    amount: number;
}

export interface BusinessInfo {
    companyName: string;
    address: string;
    phone: string;
    email: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API call failed with status ${response.status}: ${error}`);
    }
    return response.json();
}

// Dashboard
export const getDashboardStats = (): Promise<DashboardStats> => fetch(`${API_BASE_URL}/dashboard/stats`).then(handleResponse);
export const getConversationData = (): Promise<ConversationTrendPoint[]> => fetch(`${API_BASE_URL}/dashboard/conversation-trends`).then(handleResponse);
export const getDealsByStage = (): Promise<DealStageValue[]> => fetch(`${API_BASE_URL}/dashboard/deals-by-stage`).then(handleResponse);
export const getPlatformStats = (): Promise<PlatformStats[]> => fetch(`${API_BASE_URL}/dashboard/platform-stats`).then(handleResponse);

// Customers
export const getCustomers = (params?: URLSearchParams): Promise<{ customers: Customer[], totalPages: number, currentPage: number }> => 
    fetch(`${API_BASE_URL}/customers?${params?.toString() || ''}`).then(handleResponse);

export const addCustomer = (customer: NewCustomer): Promise<Customer> => 
    fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
    }).then(handleResponse);

export const updateCustomer = (customerId: string, customer: Partial<NewCustomer>): Promise<Customer> => 
    fetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
    }).then(handleResponse);

export const updateCustomerStatus = (customerId: string, status: CustomerStatus): Promise<Customer> => 
    fetch(`${API_BASE_URL}/customers/${customerId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    }).then(handleResponse);

// Deals
export const addDealToCustomer = (customerId: string, deal: Omit<Deal, 'id' | 'status' | 'closeDate'>): Promise<Deal> => 
    fetch(`${API_BASE_URL}/customers/${customerId}/deals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deal),
    }).then(handleResponse);

// Conversations
export const getConversations = (params?: URLSearchParams): Promise<{ conversations: Conversation[], totalPages: number, currentPage: number }> => 
    fetch(`${API_BASE_URL}/conversations?${params?.toString() || ''}`).then(handleResponse);
    
export const getConversation = (conversationId: string): Promise<Conversation> =>
    fetch(`${API_BASE_URL}/conversations/${conversationId}`).then(handleResponse);

export const sendMessage = (conversationId: string, text: string): Promise<Message> =>
    fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    }).then(handleResponse);
    
export const markConversationAsRead = (conversationId: string): Promise<void> =>
    fetch(`${API_BASE_URL}/conversations/${conversationId}/read`, {
        method: 'PUT',
    }).then(res => { if(!res.ok) throw new Error('Failed to mark as read')});

// Emails
export const getEmails = (folder: Email['folder']): Promise<Email[]> => 
    fetch(`${API_BASE_URL}/emails?folder=${folder}`).then(handleResponse);

export const sendEmail = (email: NewEmail): Promise<Email> =>
    fetch(`${API_BASE_URL}/emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email),
    }).then(handleResponse);

export const updateEmail = (emailId: string, updates: Partial<Pick<Email, 'isRead'>>): Promise<Email> =>
    fetch(`${API_BASE_URL}/emails/${emailId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    }).then(handleResponse);

// Integrations
export interface Integration {
  name: string;
  channel: Channel;
  description: string;
  status: 'connected' | 'disconnected';
}
export const getIntegrations = (): Promise<Integration[]> => fetch(`${API_BASE_URL}/integrations`).then(handleResponse);
export const connectIntegration = (channel: Channel, apiKey: string): Promise<void> => 
    fetch(`${API_BASE_URL}/integrations/${channel}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
    }).then(res => { if(!res.ok) throw new Error('Failed to connect integration')});

// Settings
export const getBusinessInfo = (): Promise<BusinessInfo> => fetch(`${API_BASE_URL}/settings/business-info`).then(handleResponse);
export const updateBusinessInfo = (info: BusinessInfo): Promise<BusinessInfo> =>
    fetch(`${API_BASE_URL}/settings/business-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
    }).then(handleResponse);

// Status
export interface ServiceStatusItem {
  name: string;
  status: "operational" | "degraded" | "outage";
  lastChecked: string;
}
export interface UpdateLog {
  version: string;
  date: string;
  description: string;
  changes: string[];
}
export const getServiceStatus = (): Promise<ServiceStatusItem[]> => fetch(`${API_BASE_URL}/status/services`).then(handleResponse);
export const getUpdateLogs = (): Promise<UpdateLog[]> => fetch(`${API_BASE_URL}/status/update-logs`).then(handleResponse);

// Support
export interface SupportMessage {
    id: number;
    text: string;
    sender: 'user' | 'support';
    timestamp: string;
}
export const getSupportMessages = (): Promise<SupportMessage[]> => fetch(`${API_BASE_URL}/support/messages`).then(handleResponse);
export const sendSupportMessage = (text: string): Promise<SupportMessage> =>
    fetch(`${API_BASE_URL}/support/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    }).then(handleResponse);

// FAQ
export interface FaqItem {
    question: string;
    answer: string;
}
export const getFaqs = (): Promise<FaqItem[]> => fetch(`${API_BASE_URL}/faq`).then(handleResponse);
