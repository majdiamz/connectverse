
'use client';
import { getCustomers, Customer, addCustomer, updateCustomer, Conversation, getConversation } from "@/lib/data";
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
import { Search, SlidersHorizontal, Calendar as CalendarIcon, FilterX, MessageSquare, History, ExternalLink, Download, PlusCircle, Edit } from "lucide-react";
import { ChannelIcon } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  channel: z.enum(["whatsapp", "messenger", "instagram", "tiktok"]),
  status: z.enum(['new', 'contacted', 'qualified', 'unqualified', 'demo', 'won']),
});

type CustomerFormData = z.infer<typeof customerSchema>;

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

function CustomerForm({ customer, onSave, onOpenChange }: { customer: Partial<Customer> | null, onSave: (data: CustomerFormData, id?: string) => void, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      channel: customer?.channel || 'whatsapp',
      status: customer?.status || 'new',
    },
  });
  
  useEffect(() => {
    form.reset({
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      channel: customer?.channel || 'whatsapp',
      status: customer?.status || 'new',
    });
  }, [customer, form]);

  const onSubmit = (data: CustomerFormData) => {
    onSave(data, customer?.id);
    toast({
      title: `Customer ${customer?.id ? 'updated' : 'created'}`,
      description: `${data.name} has been successfully ${customer?.id ? 'updated' : 'saved'}.`,
    });
    onOpenChange(false);
  };
  
  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
                <DialogTitle>{customer?.id ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
                <DialogDescription>
                    {customer?.id ? 'Update the details for this customer.' : 'Fill out the form to add a new customer.'}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. +1-555-1234" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="channel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Channel</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a channel" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="whatsapp">Whatsapp</SelectItem>
                                        <SelectItem value="messenger">Messenger</SelectItem>
                                        <SelectItem value="instagram">Instagram</SelectItem>
                                        <SelectItem value="tiktok">TikTok</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="contacted">Contacted</SelectItem>
                                        <SelectItem value="qualified">Qualified</SelectItem>
                                        <SelectItem value="unqualified">Unqualified</SelectItem>
                                        <SelectItem value="demo">Demo</SelectItem>
                                        <SelectItem value="won">Won</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Customer</Button>
            </DialogFooter>
        </form>
      </Form>
  );
}


export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Partial<Customer> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: String(10) });
      const data = await getCustomers(params);
      setCustomers(data.customers);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getConversationForCustomer = (customerId: string) => {
    // This part might need adjustment depending on how conversations are fetched.
    // For now, it assumes conversations are not pre-loaded.
    return null;
  }

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedCustomers(customers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const handleSaveCustomer = async (data: CustomerFormData, id?: string) => {
    try {
        if (id) {
            await updateCustomer(id, data);
        } else {
            await addCustomer(data);
        }
        fetchCustomers(); // Refetch customers after saving
    } catch (error) {
        console.error("Failed to save customer:", error);
    }
  };

  const openAddForm = () => {
    setCustomerToEdit(null);
    setIsFormOpen(true);
  };
  
  const openEditForm = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsFormOpen(true);
  };

  const exportToCsv = () => {
    const customersToExport = customers.filter(c => selectedCustomers.includes(c.id));
    if (customersToExport.length === 0) return;

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Joined', 'Channel', 'Status', 'Tags'];
    const csvContent = [
      headers.join(','),
      ...customersToExport.map(c => [
        c.id,
        `"${c.name}"`,
        c.email,
        c.phone,
        c.joined,
        c.channel,
        c.status,
        `"${c.tags.join('; ')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "customers.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            {isFormOpen && <CustomerForm customer={customerToEdit} onSave={handleSaveCustomer} onOpenChange={setIsFormOpen} />}
        </DialogContent>
      </Dialog>
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
                  {selectedCustomers.length > 0 ? (
                      <Button onClick={exportToCsv}>
                          <Download className="mr-2 h-4 w-4" />
                          Export ({selectedCustomers.length})
                      </Button>
                  ) : (
                    <Button onClick={openAddForm}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Customer
                    </Button>
                  )}
              </div>
          </div>
        </CardHeader>
        <CardContent>
           <Dialog>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedCustomers.length > 0 && selectedCustomers.length === customers.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {customers.map((customer) => (
                    <TableRow 
                        key={customer.id} 
                        data-state={selectedCustomers.includes(customer.id) && "selected"}
                    >
                        <TableCell>
                          <Checkbox
                            checked={selectedCustomers.includes(customer.id)}
                            onCheckedChange={(checked) => handleSelectCustomer(customer.id, !!checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <DialogTrigger asChild>
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{customer.name}</span>
                                <ChannelIcon channel={customer.channel} className="h-4 w-4 text-muted-foreground" />
                            </div>
                            </div>
                           </DialogTrigger>
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
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openEditForm(customer)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
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
