"use client";

import { useState } from "react";
import type { Conversation, Message, Customer } from "@/lib/data";
import { getConversations, currentUser } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChannelIcon } from "@/components/icons";
import { Paperclip, Send, Search, MessageSquareDashed, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const conversationsData = getConversations();

const ConversationList = ({ onSelectConversation }: { onSelectConversation: (conv: Conversation) => void; }) => (
  <Card className="flex flex-col h-full">
    <CardHeader className="p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search conversations..." className="pl-9" />
      </div>
    </CardHeader>
    <Separator />
    <ScrollArea className="flex-1">
      <div className="p-2">
        {conversationsData.map((conv) => (
          <button
            key={conv.id}
            className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent"
            onClick={() => onSelectConversation(conv)}
          >
            <div className="relative">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={conv.customer.avatarUrl} alt={conv.customer.name} />
                <AvatarFallback>{conv.customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background">
                <ChannelIcon channel={conv.channel} className="h-3 w-3" />
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="font-semibold truncate">{conv.customer.name}</p>
                <p className="text-xs text-muted-foreground">{conv.messages[conv.messages.length - 1].timestamp}</p>
              </div>
              <p className="text-sm text-muted-foreground truncate">{conv.messages[conv.messages.length - 1].text}</p>
            </div>
            {conv.unreadCount > 0 && (
              <div className="flex h-full items-center">
                <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">{conv.unreadCount}</Badge>
              </div>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  </Card>
);

const MessageView = ({ conversation }: { conversation: Conversation | null }) => (
  <div className="flex flex-col h-full bg-card border-x">
    {conversation ? (
      <>
        <div className="flex items-center gap-3 border-b p-4">
            <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.customer.avatarUrl} alt={conversation.customer.name} />
                <AvatarFallback>{conversation.customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{conversation.customer.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ChannelIcon channel={conversation.channel} className="h-3 w-3" />
                    <span>{conversation.channel.charAt(0).toUpperCase() + conversation.channel.slice(1)}</span>
                </div>
            </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {conversation.messages.map((message) => (
              <div key={message.id} className={cn("flex items-end gap-2", message.sender === 'user' ? 'justify-end' : '')}>
                {message.sender === 'customer' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={conversation.customer.avatarUrl} />
                    <AvatarFallback>{conversation.customer.name.charAt(0)}</AvatarFallback>
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
                    <AvatarImage src={currentUser.avatarUrl} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="relative">
            <Input placeholder="Type a message..." className="pr-20" />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <MessageSquareDashed className="h-16 w-16 text-muted-foreground/50" />
        <h3 className="text-xl font-semibold">No conversation selected</h3>
        <p className="text-muted-foreground">Select a conversation from the list to start chatting.</p>
      </div>
    )}
  </div>
);

const CustomerProfile = ({ customer }: { customer: Customer | null }) => (
  <Card className="hidden lg:flex lg:flex-col h-full">
    {customer ? (
      <>
        <CardHeader className="items-center p-6">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={customer.avatarUrl} alt={customer.name} />
            <AvatarFallback>{customer.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">{customer.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 px-6">
            <Separator />
            <div className="space-y-2 text-sm">
                <h4 className="font-semibold">Contact Details</h4>
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{customer.phone}</span>
                </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
                <h4 className="font-semibold">Tags</h4>
                <div className="flex flex-wrap gap-2">
                    {customer.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
            </div>
        </CardContent>
      </>
    ) : (
      <div className="flex flex-1 items-center justify-center text-center">
        <p className="text-muted-foreground">Customer details will appear here.</p>
      </div>
    )}
  </Card>
);

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversationsData[0]);

  return (
    <div className="h-[calc(100vh-10rem)] grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr_300px]">
      <ConversationList onSelectConversation={setSelectedConversation} />
      <MessageView conversation={selectedConversation} />
      <CustomerProfile customer={selectedConversation?.customer ?? null} />
    </div>
  );
}
