
'use client';
import { getCustomers, Customer, getConversations, Conversation } from "@/lib/data";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Calendar as CalendarIcon, FilterX, MessageSquare, History, ExternalLink } from "lucide-react";
import { ChannelIcon } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";


const statusColors: { [key in Customer['status']]: string } = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  qualified: 'bg-green-500',
  unqualified: 'bg-red-500',
  demo: 'bg-purple-500',
  won: 'bg-emerald-500',
};

const dealStatusColors: { [key: string]: string } = {
  Won: 'bg-green-500',
  Lost: 'bg-red-500',
  'In Progress': 'bg-yellow-500',
};

const ITEMS_PER_PAGE = 10;


export default function CustomersPage() {
  const customers = getCustomers();
  const conversations = getConversations();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return customers.slice(startIndex, endIndex);
  }, [customers, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getConversationForCustomer = (customerId: string) => {
    return conversations.find(c => c.customer.id === customerId);
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <div className="flex items-center gap-2">
                  <Button variant="ghost">
                    <FilterX className="h-4 w-4 mr-2" />
                    Reset Filters
                  </Button>
                  <Button>
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select>
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
              <Select>
                  <SelectTrigger>
                      <SelectValue placeholder="Filter by status..." />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="unqualified">Unqualified</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                  </SelectContent>
              </Select>
              <Input placeholder="Filter by tag..." />
              
              <DateRangePicker />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
              <CardTitle>Customers</CardTitle>
              <div className="flex items-center gap-2">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search customers..." className="pl-9" />
                  </div>
                  <Button>Add Customer</Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
           <Dialog>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead>Tags</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {paginatedCustomers.map((customer) => (
                    <DialogTrigger asChild key={customer.id}>
                        <TableRow className="cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{customer.name}</span>
                                <ChannelIcon channel={customer.channel} className="h-4 w-4 text-muted-foreground" />
                            </div>
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
                            <div className="flex flex-wrap gap-1">
                            {customer.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                {tag}
                                </Badge>
                            ))}
                            </div>
                        </TableCell>
                        </TableRow>
                    </DialogTrigger>
                ))}
                </TableBody>
            </Table>
            {selectedCustomer && (
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={selectedCustomer.avatarUrl} alt={selectedCustomer.name} />
                                <AvatarFallback>{selectedCustomer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                {selectedCustomer.name}
                                <DialogDescription>{selectedCustomer.email} &middot; {selectedCustomer.phone}</DialogDescription>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-6">
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2"><History className="h-4 w-4" /> Deal History</h3>
                            <ScrollArea className="h-[200px] border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Deal Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Close Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedCustomer.dealHistory.map(deal => (
                                            <TableRow key={deal.id}>
                                                <TableCell className="font-medium">{deal.name}</TableCell>
                                                <TableCell>
                                                    <Badge className={cn("capitalize text-white", dealStatusColors[deal.status])}>
                                                        <div className={cn("w-2 h-2 rounded-full mr-2", dealStatusColors[deal.status])}></div>
                                                        {deal.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>${deal.amount.toLocaleString()}</TableCell>
                                                <TableCell>{deal.closeDate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Previous Discussions</h3>
                            {getConversationForCustomer(selectedCustomer.id) ? (
                                <Button asChild variant="outline">
                                    <Link href={`/dashboard/inbox?conversationId=${getConversationForCustomer(selectedCustomer.id)?.id}`}>
                                        View Conversation
                                        <ExternalLink className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                            ) : (
                                <p className="text-sm text-muted-foreground">No conversation history found.</p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            )}
            </Dialog>

           <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
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
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = useState<DateRange | undefined>();

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
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
