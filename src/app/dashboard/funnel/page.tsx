'use client';

import { useState } from 'react';
import type { Customer } from '@/lib/data';
import { getCustomers } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChannelIcon } from '@/components/icons';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const columns: Customer['status'][] = ['new', 'contacted', 'qualified', 'demo', 'unqualified'];

const columnTitles: { [key in Customer['status']]: string } = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  demo: 'Demo Scheduled',
  unqualified: 'Unqualified',
};

const statusColors: { [key in Customer['status']]: string } = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  qualified: 'bg-green-500',
  unqualified: 'bg-red-500',
  demo: 'bg-purple-500',
};

const CustomerCard = ({ customer }: { customer: Customer }) => (
  <Card
    className="mb-4 cursor-grab active:cursor-grabbing"
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('customerId', customer.id);
    }}
  >
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={customer.avatarUrl} alt={customer.name} />
          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{customer.name}</p>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
        </div>
        <ChannelIcon channel={customer.channel} className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {customer.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Badge className={cn("capitalize text-white", statusColors[customer.status])}>
            <div className={cn("w-2 h-2 rounded-full mr-2", statusColors[customer.status])}></div>
            {customer.status}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

const FunnelColumn = ({
  status,
  customers,
  onDrop,
}: {
  status: Customer['status'],
  customers: Customer[],
  onDrop: (customerId: string, newStatus: Customer['status']) => void,
}) => (
  <div
    className="flex-shrink-0 w-80"
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
                {customers.map(customer => (
                    <CustomerCard key={customer.id} customer={customer} />
                ))}
              </ScrollArea>
          </CardContent>
      </Card>
  </div>
);


export default function FunnelPage() {
  const [customers, setCustomers] = useState<Customer[]>(getCustomers());

  const handleDrop = (customerId: string, newStatus: Customer['status']) => {
    setCustomers(prevCustomers =>
      prevCustomers.map(c =>
        c.id === customerId ? { ...c, status: newStatus } : c
      )
    );
  };

  const customersByStatus = columns.reduce((acc, status) => {
    acc[status] = customers.filter(c => c.status === status);
    return acc;
  }, {} as { [key in Customer['status']]: Customer[] });

  return (
    <div className="h-full flex flex-col">
        <div className="flex-1 -mx-4 -my-8 p-0">
          <ScrollArea className="w-full h-full whitespace-nowrap">
              <div className="flex gap-6 p-4 h-full">
                  {columns.map(status => (
                      <FunnelColumn
                        key={status}
                        status={status}
                        customers={customersByStatus[status]}
                        onDrop={handleDrop}
                      />
                  ))}
              </div>
              <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
    </div>
  );
}
