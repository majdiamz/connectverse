
'use client';

import { useState, useEffect, Suspense, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Conversation, Message, Customer, CustomerStatus, Deal, User, WhatsAppIntegration } from '@/lib/data';
import { getConversations, markConversationAsRead, updateCustomerStatus, addDealToCustomer, sendMessage, getWhatsAppIntegrations } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ChannelIcon } from '@/components/icons';
import { Paperclip, Send, Search, MessageSquareDashed, Mail, Phone, FilterX, Calendar as CalendarIcon, ArrowUp, KanbanSquare, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, isToday, isYesterday } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';

const MESSAGES_PER_PAGE = 8;

const statusColors: { [key in Customer['status']]: string } = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  qualified: 'bg-green-500',
  unqualified: 'bg-red-500',
  demo: 'bg-purple-500',
  won: 'bg-emerald-500',
};

const funnelStages: CustomerStatus[] = ['new', 'contacted', 'qualified', 'demo', 'won', 'unqualified'];

const dealFormSchema = z.object({
    name: z.string().min(1, 'Deal name is required.'),
    amount: z.coerce.number().min(0, 'Amount must be a positive number.'),
});

type DealFormData = z.infer<typeof dealFormSchema>;


const ConversationList = ({ 
    conversations,
    onSelectConversation, 
    selectedConversationId,
    onNextPage,
    onPrevPage,
    currentPage,
    totalPages
}: { 
    conversations: Conversation[],
    onSelectConversation: (conv: Conversation) => void; 
    selectedConversationId: string | null;
    onNextPage: () => void;
    onPrevPage: () => void;
    currentPage: number;
    totalPages: number;
}) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        if (isToday(date)) {
            return format(date, 'p');
        }
        if (isYesterday(date)) {
            return 'Yesterday';
        }
        return format(date, 'P');
    }

    if (!isMounted) {
        return (
            <Card className="flex flex-col h-full">
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex items-start gap-3 rounded-lg p-3">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarFallback></AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>
        )
    }

    return (
        <div className="flex flex-col gap-2 min-h-0">
            <Card className="flex flex-col h-full">
                <ScrollArea className="flex-1">
                <div className="p-2">
                    {conversations.map((conv) => {
                      const lastMessage = conv.messages[conv.messages.length - 1];
                      const snippet = lastMessage?.text?.length > 30 ? `${lastMessage?.text?.substring(0, 30)}...` : lastMessage?.text;

                      return (
                        <button
                            key={conv.id}
                            className={cn(
                                "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
                                selectedConversationId === conv.id && "bg-accent"
                            )}
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
                                <p className="text-xs text-muted-foreground">{formatTimestamp(lastMessage.timestamp)}</p>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{snippet}</p>
                            </div>
                            {conv.unreadCount > 0 && (
                            <div className="flex h-full items-center">
                                <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">{conv.unreadCount}</Badge>
                            </div>
                            )}
                        </button>
                      )
                    })}
                </div>
                </ScrollArea>
            </Card>
             <div className="flex items-center justify-end space-x-2 py-4 flex-shrink-0">
                <Button
                variant="outline"
                size="sm"
                onClick={onPrevPage}
                disabled={currentPage === 1}
                >
                Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
                </span>
                <Button
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={currentPage === totalPages}
                >
                Next
                </Button>
            </div>
        </div>
    )
};

const MessageView = ({ conversation, onSendMessage, user }: { conversation: Conversation | null, onSendMessage: (text: string) => void, user: User | null }) => {
  const [visibleMessagesCount, setVisibleMessagesCount] = useState(MESSAGES_PER_PAGE);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setVisibleMessagesCount(MESSAGES_PER_PAGE);
    setTimeout(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, 0);
  }, [conversation]);

  const handleLoadMore = () => {
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      scrollPositionRef.current = viewport.scrollHeight - viewport.scrollTop;
    }
    setVisibleMessagesCount(prev => prev + MESSAGES_PER_PAGE);
  };
  
  useEffect(() => {
    if (scrollPositionRef.current !== null) {
      const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight - scrollPositionRef.current;
        scrollPositionRef.current = null;
      }
    }
  }, [visibleMessagesCount]);
  
  const handleSendMessage = () => {
      if (newMessage.trim()) {
          onSendMessage(newMessage.trim());
          setNewMessage("");
      }
  }

  const messages = conversation?.messages || [];
  const displayedMessages = messages.slice(Math.max(0, messages.length - visibleMessagesCount));
  const canLoadMore = visibleMessagesCount < messages.length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "dd/MM/yyyy HH:mm");
  };


  return (
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
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
             <div className="space-y-4">
              {canLoadMore && (
                <div className="text-center">
                  <Button variant="outline" size="sm" onClick={handleLoadMore}>
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Load More
                  </Button>
                </div>
              )}
              {displayedMessages.map((message) => (
                <div key={message.id} className={cn("flex flex-col gap-1", message.sender === 'user' ? 'items-end' : 'items-start')}>
                  <div className={cn("flex items-end gap-2", message.sender === 'user' ? 'flex-row-reverse' : 'flex-row')}>
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
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className={cn("text-xs text-muted-foreground", message.sender === 'user' ? 'pr-10' : 'pl-10')}>
                    {isMounted ? formatTimestamp(message.timestamp) : <span className="h-4 w-20 inline-block bg-muted rounded"></span>}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-20" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button size="icon" className="h-8 w-8" onClick={handleSendMessage}>
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
}

const CreateDealDialog = ({ customer, onDealCreate }: { customer: Customer, onDealCreate: (deal: Omit<Deal, 'id'|'status'|'closeDate'>) => void }) => {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<DealFormData>({
        resolver: zodResolver(dealFormSchema),
        defaultValues: { name: '', amount: 0 }
    });

    const onSubmit = (data: DealFormData) => {
        onDealCreate(data);
        toast({
            title: "Deal Created!",
            description: `${data.name} for $${data.amount.toLocaleString()} has been created for ${customer.name}.`,
        });
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Deal
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create New Deal</DialogTitle>
                        <DialogDescription>
                            Create a new deal for {customer.name}. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Deal Name
                            </Label>
                            <div className="col-span-3">
                                <Input id="name" {...register("name")} className="w-full" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <div className="col-span-3">
                                <Input id="amount" type="number" {...register("amount")} className="w-full" />
                                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save Deal</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


const CustomerProfile = ({ customer, onStatusChange, onDealCreate }: { customer: Customer | null, onStatusChange: (customerId: string, newStatus: CustomerStatus) => void, onDealCreate: (customerId: string, deal: Omit<Deal, 'id' | 'status' | 'closeDate'>) => void }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDealCreate = (deal: Omit<Deal, 'id' | 'status' | 'closeDate'>) => {
        if (customer) {
            onDealCreate(customer.id, deal);
        }
    };

    return (
      <div className="hidden lg:flex lg:flex-col h-full gap-2">
        <Card className="flex-1">
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
                    <h4 className="font-semibold">Funnel Stage</h4>
                    <div className="flex items-center gap-2">
                      <KanbanSquare className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={customer.status}
                        onValueChange={(newStatus) => onStatusChange(customer.id, newStatus as CustomerStatus)}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-xs capitalize">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          {funnelStages.map(stage => (
                            <SelectItem key={stage} value={stage} className="capitalize text-xs">
                              <div className="flex items-center">
                                <div className={cn("w-2 h-2 rounded-full mr-2", statusColors[stage])}></div>
                                {stage}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Separator />
                   <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                          <h4 className="font-semibold">Deals</h4>
                          <CreateDealDialog customer={customer} onDealCreate={handleDealCreate} />
                      </div>
                      <ScrollArea className="h-24">
                          <div className="space-y-2">
                              {customer.dealHistory.map(deal => (
                                  <div key={deal.id} className="text-xs p-2 bg-muted/50 rounded-md">
                                      <div className="flex justify-between font-medium">
                                          <span>{deal.name}</span>
                                          <span>${isMounted ? deal.amount.toLocaleString() : '...'}</span>
                                      </div>
                                      <div className="flex justify-between text-muted-foreground">
                                           <span>{deal.status}</span>
                                          <span>{deal.closeDate}</span>
                                      </div>
                                  </div>
                              ))}
                              {customer.dealHistory.length === 0 && (
                                  <p className="text-xs text-muted-foreground text-center py-4">No deals yet.</p>
                              )}
                          </div>
                      </ScrollArea>
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
      </div>
    );
};


function DateRangePicker({ className, date, onSelect }: React.HTMLAttributes<HTMLDivElement> & { date: DateRange | undefined, onSelect: (date: DateRange | undefined) => void}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Filter by date...</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function InboxPageContent() {
  const searchParams = useSearchParams()
  const [conversationId, setConversationId] = useState(searchParams.get('conversationId'));
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useAuth();
  const [commercialFilter, setCommercialFilter] = useState('');
  const [whatsAppIntegrations, setWhatsAppIntegrations] = useState<WhatsAppIntegration[]>([]);

  // Fetch WhatsApp integrations for filter dropdown
  useEffect(() => {
    if (user?.role === 'admin') {
      getWhatsAppIntegrations().then(setWhatsAppIntegrations).catch(console.error);
    }
  }, [user?.role]);

  // 10-minute polling
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
    }, 600_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
        const params = new URLSearchParams();
        params.append('page', String(currentPage));
        if (search) params.append('search', search);
        if (channelFilter) params.append('channel', channelFilter);
        if (statusFilter) params.append('status', statusFilter);
        if (commercialFilter) params.append('integrationId', commercialFilter);
        
        const data = await getConversations(params);
        setConversations(data.conversations);
        setTotalPages(data.totalPages);

        if (conversationId) {
            const currentConv = data.conversations.find(c => c.id === conversationId);
            if (currentConv) {
                setSelectedConversation(currentConv);
                if (currentConv.unreadCount > 0) {
                    await markConversationAsRead(currentConv.id);
                }
            }
        } else if (data.conversations.length > 0) {
            const firstConv = data.conversations[0];
            setSelectedConversation(firstConv);
            setConversationId(firstConv.id);
             if (firstConv.unreadCount > 0) {
                await markConversationAsRead(firstConv.id);
            }
        }
    } catch (error) {
        console.error("Failed to fetch conversations", error);
    } finally {
        setLoading(false);
    }
  }, [currentPage, search, channelFilter, statusFilter, commercialFilter, conversationId]);

  useEffect(() => {
      fetchConversations();
  }, [fetchConversations]);
  
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const resetFilters = () => {
    setSearch('');
    setChannelFilter('');
    setStatusFilter('');
    setDateFilter(undefined);
    setCommercialFilter('');
    setCurrentPage(1);
  }
  
  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setConversationId(conversation.id);
    if (conversation.unreadCount > 0) {
        try {
            await markConversationAsRead(conversation.id);
            fetchConversations(); // re-fetch to update unread count
        } catch (error) {
            console.error("Failed to mark conversation as read", error);
        }
    }
    const url = new URL(window.location.href);
    url.searchParams.set('conversationId', conversation.id);
    window.history.pushState({ path: url.href }, '', url.href);
  };
  
  const handleStatusChange = async (customerId: string, newStatus: CustomerStatus) => {
    try {
        await updateCustomerStatus(customerId, newStatus);
        fetchConversations(); // Re-fetch to see updated customer status
    } catch (error) {
        console.error("Failed to update status", error);
    }
  };

  const handleDealCreate = async (customerId: string, deal: Omit<Deal, 'id' | 'status' | 'closeDate'>) => {
    try {
        await addDealToCustomer(customerId, deal);
        fetchConversations(); // Re-fetch to see new deal
    } catch (error) {
        console.error("Failed to create deal", error);
    }
  };
  
  const handleSendMessage = async (text: string) => {
    if (!selectedConversation) return;
    try {
        await sendMessage(selectedConversation.id, text);
        fetchConversations(); // Re-fetch to see new message
    } catch (error) {
        console.error("Failed to send message", error);
    }
  };
  
  if ((loading && conversations.length === 0) || userLoading) return <div>Loading...</div>;

  if (user?.role === 'commercial') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <MessageSquareDashed className="h-16 w-16 text-muted-foreground/50" />
        <h3 className="text-xl font-semibold">Access Restricted</h3>
        <p className="text-muted-foreground">The inbox is only accessible to admin users.</p>
      </div>
    );
  }

  const filtersWidget = (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
              <FilterX className="h-4 w-4 mr-2" />
              Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name or email..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger>
                    <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="whatsapp">Whatsapp</SelectItem>
                    <SelectItem value="messenger">Messenger</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
            </Select>
            {whatsAppIntegrations.length > 0 && (
              <Select value={commercialFilter} onValueChange={setCommercialFilter}>
                  <SelectTrigger>
                      <SelectValue placeholder="Commercial" />
                  </SelectTrigger>
                  <SelectContent>
                      {whatsAppIntegrations.map((i) => (
                          <SelectItem key={i.id} value={i.id}>
                              {i.user?.name || i.name}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            )}
            <DateRangePicker date={dateFilter} onSelect={setDateFilter} />
        </div>
      </CardContent>
  </Card>
  );


  return (
    <div className="flex flex-col h-full gap-4">
        {filtersWidget}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr_300px] gap-1 min-h-0">
            <ConversationList 
                conversations={conversations}
                onSelectConversation={handleSelectConversation} 
                selectedConversationId={selectedConversation?.id ?? null}
                onNextPage={handleNextPage}
                onPrevPage={handlePreviousPage}
                currentPage={currentPage}
                totalPages={totalPages}
            />
            <MessageView conversation={selectedConversation} onSendMessage={handleSendMessage} user={user} />
            <CustomerProfile 
                customer={selectedConversation?.customer ?? null} 
                onStatusChange={handleStatusChange}
                onDealCreate={handleDealCreate}
            />
        </div>
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InboxPageContent />
    </Suspense>
  )
}
