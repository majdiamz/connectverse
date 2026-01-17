
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Building, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBusinessInfo, getSupportMessages, sendSupportMessage } from "@/lib/data";
import type { BusinessInfo, SupportMessage } from "@/lib/data";
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

const supportUser = {
  name: "Support Team",
  avatarUrl: "https://picsum.photos/seed/support/100/100",
}

export default function SupportPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useAuth();

  const fetchMessages = async () => {
      try {
          const fetchedMessages = await getSupportMessages();
          setMessages(fetchedMessages);
      } catch (error) {
          console.error("Failed to fetch support messages", error);
      }
  };
  
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [messagesData, infoData] = await Promise.all([
                getSupportMessages(),
                getBusinessInfo()
            ]);
            setMessages(messagesData);
            setBusinessInfo(infoData);
        } catch (error) {
            console.error("Failed to fetch support page data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const optimisticMessage: SupportMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
        await sendSupportMessage(newMessage.trim());
        fetchMessages(); // Refetch messages to get the real one from server
    } catch (error) {
        console.error("Failed to send message", error);
        setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id)); // remove optimistic message on failure
    }
  };

  if (loading || userLoading) return <div>Loading...</div>;

  return (
    <div className="h-[calc(100vh-10rem)] grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={supportUser.avatarUrl} alt={supportUser.name} />
                        <AvatarFallback>{supportUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>Support Team</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                        {messages.map((message) => (
                        <div key={message.id} className={cn("flex items-end gap-2", message.sender === 'user' ? 'justify-end' : '')}>
                            {message.sender === 'support' && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={supportUser.avatarUrl} />
                                <AvatarFallback>{supportUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            )}
                            <div className={cn(
                            "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2",
                            message.sender === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-muted rounded-bl-none'
                            )}>
                            <p className="text-sm">{message.text}</p>
                            </div>
                            {message.sender === 'user' && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatarUrl} />
                                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            )}
                        </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <div className="relative w-full">
                    <Input 
                        placeholder="Type a message..." 
                        className="pr-14" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-10"
                        onClick={handleSendMessage}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
        {businessInfo && (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{businessInfo.companyName}</span>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{businessInfo.address}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">{businessInfo.phone}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">{businessInfo.email}</span>
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
