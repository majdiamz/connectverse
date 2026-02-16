'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDeals, createDeal, updateDeal, deleteDeal, getCustomers, DealWithContact, Customer } from '@/lib/data';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Search, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const dealStatusColors: Record<string, string> = {
  Won: 'bg-green-500',
  Lost: 'bg-red-500',
  'In Progress': 'bg-yellow-500',
};

const createDealSchema = z.object({
  contactId: z.string().min(1, 'Please select a contact.'),
  name: z.string().min(1, 'Deal name is required.'),
  amount: z.coerce.number().min(0, 'Amount must be positive.'),
});

const editDealSchema = z.object({
  name: z.string().min(1, 'Deal name is required.'),
  amount: z.coerce.number().min(0, 'Amount must be positive.'),
  status: z.enum(['Won', 'Lost', 'InProgress']),
});

type CreateDealFormData = z.infer<typeof createDealSchema>;
type EditDealFormData = z.infer<typeof editDealSchema>;

export default function DealsPage() {
  const { toast } = useToast();
  const [deals, setDeals] = useState<DealWithContact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<DealWithContact | null>(null);
  const [contacts, setContacts] = useState<Customer[]>([]);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: '10' });
      if (search) params.set('search', search);
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      const data = await getDeals(params);
      setDeals(data.deals);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams({ limit: '100' });
      const data = await getCustomers(params);
      setContacts(data.customers);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const handleOpenCreate = () => {
    fetchContacts();
    setIsCreateOpen(true);
  };

  const handleCreate = async (data: CreateDealFormData) => {
    try {
      await createDeal(data);
      toast({ title: 'Deal Created', description: `${data.name} has been created.` });
      setIsCreateOpen(false);
      fetchDeals();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create deal.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data: EditDealFormData) => {
    if (!editingDeal) return;
    try {
      await updateDeal(editingDeal.id, data);
      toast({ title: 'Deal Updated', description: `${data.name} has been updated.` });
      setEditingDeal(null);
      fetchDeals();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update deal.', variant: 'destructive' });
    }
  };

  const handleDelete = async (deal: DealWithContact) => {
    try {
      await deleteDeal(deal.id);
      toast({ title: 'Deal Deleted', description: `${deal.name} has been deleted.` });
      fetchDeals();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete deal.', variant: 'destructive' });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDeals();
  };

  if (loading && deals.length === 0) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <CreateDealDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        contacts={contacts}
        onSubmit={handleCreate}
      />
      <EditDealDialog
        deal={editingDeal}
        onOpenChange={(open) => { if (!open) setEditingDeal(null); }}
        onSubmit={handleEdit}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Deals</CardTitle>
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deals..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Won">Won</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleOpenCreate}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Deal
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Close Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.name}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{deal.contact.name}</div>
                      <div className="text-xs text-muted-foreground">{deal.contact.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>${deal.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={cn('text-white', dealStatusColors[deal.status])}>
                      <div className={cn('w-2 h-2 rounded-full mr-2', dealStatusColors[deal.status])} />
                      {deal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{deal.closeDate || '—'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setEditingDeal(deal)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(deal)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {deals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No deals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateDealDialog({ open, onOpenChange, contacts, onSubmit }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: Customer[];
  onSubmit: (data: CreateDealFormData) => void;
}) {
  const form = useForm<CreateDealFormData>({
    resolver: zodResolver(createDealSchema),
    defaultValues: { contactId: '', name: '', amount: 0 },
  });

  useEffect(() => {
    if (open) form.reset({ contactId: '', name: '', amount: 0 });
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
              <DialogDescription>Select a contact and fill in the deal details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="contactId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a contact..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contacts.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name} ({c.email})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Enterprise Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Deal</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function EditDealDialog({ deal, onOpenChange, onSubmit }: {
  deal: DealWithContact | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EditDealFormData) => void;
}) {
  const form = useForm<EditDealFormData>({
    resolver: zodResolver(editDealSchema),
    defaultValues: { name: '', amount: 0, status: 'InProgress' },
  });

  useEffect(() => {
    if (deal) {
      form.reset({
        name: deal.name,
        amount: deal.amount,
        status: deal.status === 'In Progress' ? 'InProgress' : deal.status as 'Won' | 'Lost' | 'InProgress',
      });
    }
  }, [deal, form]);

  return (
    <Dialog open={!!deal} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Deal</DialogTitle>
              <DialogDescription>Update deal details for {deal?.contact.name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="InProgress">In Progress</SelectItem>
                        <SelectItem value="Won">Won</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
