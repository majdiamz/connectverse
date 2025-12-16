
'use client';

import { useState, useMemo } from 'react';
import type { Customer, Conversation, Channel } from '@/lib/data';
import { getCustomers, getConversations } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChannelIcon } from '@/components/icons';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { FilterX, SlidersHorizontal, Calendar as CalendarIcon, LayoutGrid, List } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, parse } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';


const columns: (Customer['status'])[] = ['new', 'contacted', 'qualified', 'demo', 'won', 'unqualified'];

const columnTitles: { [key in Customer['status']]: string } = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  demo: 'Demo Scheduled',
  won: 'Won',
  unqualified: 'Unqualified',
};

const statusColors: { [key in Customer['status']]: string } = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  qualified: 'bg-green-500',
  unqualified: 'bg-red-500',
  demo: 'bg-purple-500',
  won: 'bg-emerald-500'
};


const CustomerCard = ({ customer, conversationId }: { customer: Customer; conversationId?: string }) => {
  const router = useRouter();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('customerId', customer.id);
  };
  
  const handleClick = () => {
    if (conversationId) {
      router.push(`/dashboard/inbox?conversationId=${conversationId}`);
    }
  };

  return (
    <Card
      className="mb-4 cursor-pointer hover:shadow-lg transition-shadow"
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <p className="font-semibold">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
            <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
           <ChannelIcon channel={customer.channel} className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};

const FunnelColumn = ({
  status,
  customers,
  conversations,
  onDrop,
}: {
  status: Customer['status'],
  customers: Customer[],
  conversations: Conversation[],
  onDrop: (customerId: string, newStatus: Customer['status']) => void,
}) => (
  <div
    className="flex-shrink-0 w-64"
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      const customerId = e.dataTransfer.getData('customerId');
      if (customerId) {
        onDrop(customerId, status);
      }
    }}
  >
      <Card className="bg-muted/50 h-full">
          <CardHeader>
              <CardTitle className="text-base capitalize flex items-center justify-between">
                <span>{columnTitles[status]}</span>
                <span className="text-sm font-normal text-muted-foreground bg-background px-2 py-1 rounded-md">{customers.length}</span>
              </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)]">
              <ScrollArea className="h-full pr-4 -mr-4">
                {customers.map(customer => {
                  const conversation = conversations.find(c => c.customer.id === customer.id);
                  return (
                    <CustomerCard key={customer.id} customer={customer} conversationId={conversation?.id} />
                  )
                })}
              </ScrollArea>
          </CardContent>
      </Card>
  </div>
);

function DateRangePicker({ className, date, onSelect }: { className?: string, date?: DateRange, onSelect: (range?: DateRange) => void }) {
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
              <span>Filter by join date...</span>
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

const ListView = ({ customers }: { customers: Customer[] }) => {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Joined</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                      <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{customer.email}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{customer.phone}</TableCell>
                <TableCell className="hidden md:table-cell">
                   <Badge className={cn("capitalize text-white", statusColors[customer.status])}>
                      <div className={cn("w-2 h-2 rounded-full mr-2", statusColors[customer.status])}></div>
                      {customer.status}
                    </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{customer.joined}</TableCell>
                <TableCell>
                  <ChannelIcon channel={customer.channel} className="h-5 w-5" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};


export default function FunnelPage() {
  const [allCustomers, setAllCustomers] = useState<Customer[]>(getCustomers());
  const [conversations] = useState<Conversation[]>(getConversations());
  
  const [channelFilter, setChannelFilter] = useState<Channel | ''>('');
  const [tagFilter, setTagFilter] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  const filteredCustomers = useMemo(() => {
    return allCustomers.filter(customer => {
      const channelMatch = !channelFilter || customer.channel === channelFilter;
      const tagMatch = !tagFilter || customer.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()));
      
      const customerJoinedDate = parse(customer.joined, 'yyyy-MM-dd', new Date());
      const dateMatch = !dateRange || 
        (dateRange.from && customerJoinedDate >= dateRange.from && (!dateRange.to || customerJoinedDate <= dateRange.to));

      return channelMatch && tagMatch && dateMatch;
    });
  }, [allCustomers, channelFilter, tagFilter, dateRange]);


  const handleDrop = (customerId: string, newStatus: Customer['status']) => {
    setAllCustomers(prevCustomers =>
      prevCustomers.map(c =>
        c.id === customerId ? { ...c, status: newStatus } : c
      )
    );
  };
  
  const resetFilters = () => {
    setChannelFilter('');
    setTagFilter('');
    setDateRange(undefined);
  };

  const customersByStatus = columns.reduce((acc, status) => {
    acc[status] = filteredCustomers.filter(c => c.status === status);
    return acc;
  }, {} as { [key in Customer['status']]: Customer[] });

  return (
    <div className="h-full flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={resetFilters}>
                    <FilterX className="h-4 w-4 mr-2" />
                    Reset Filters
                  </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={channelFilter} onValueChange={(value) => setChannelFilter(value as Channel | '')}>
                  <SelectTrigger>
                      <SelectValue placeholder="Filter by source..." />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="whatsapp">Whatsapp</SelectItem>
                      <SelectItem value="messenger">Messenger</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
              </Select>
              <Input 
                placeholder="Filter by tag..."
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              />
              <DateRangePicker date={dateRange} onSelect={setDateRange} />
          </div>
        </CardContent>
      </Card>

       <div className="flex items-center justify-start gap-2">
        <Button variant={view === 'kanban' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('kanban')}>
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}>
          <List className="h-4 w-4" />
        </Button>
      </div>

      {view === 'kanban' ? (
        <div className="flex-1 -mx-4 -my-2 p-0">
          <ScrollArea className="w-full h-full whitespace-nowrap">
              <div className="flex gap-3 p-4 h-full">
                  {columns.map(status => (
                      <FunnelColumn
                        key={status}
                        status={status}
                        customers={customersByStatus[status]}
                        conversations={conversations}
                        onDrop={handleDrop}
                      />
                  ))}
              </div>
              <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ) : (
        <ListView customers={filteredCustomers} />
      )}
    </div>
  );
}
