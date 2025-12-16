
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { getDashboardStats, getConversationData, getPlatformStats } from '@/lib/data';
import { MessageSquare, Users, CheckCircle, Clock } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';
import { ChannelIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const chartData = getConversationData();
const stats = getDashboardStats();
const platformStats = getPlatformStats();

const chartConfig = {
  new: {
    label: 'New',
    color: 'hsl(var(--chart-1))',
  },
  resolved: {
    label: 'Resolved',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.newLeads}</div>
            <p className="text-xs text-muted-foreground">+20% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Conversations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openConversations}</div>
            <p className="text-xs text-muted-foreground">3 unresolved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Conversation Trends</CardTitle>
            <CardDescription>New vs. Resolved conversations over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="new" fill="var(--color-new)" radius={4}>
                  <LabelList dataKey="new" position="top" offset={5} formatter={(value: number) => `${value}%`} className="fill-foreground text-xs" />
                </Bar>
                <Bar dataKey="resolved" fill="var(--color-resolved)" radius={4}>
                  <LabelList dataKey="resolved" position="top" offset={5} formatter={(value: number) => `${value}%`} className="fill-foreground text-xs" />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Platform Stats</CardTitle>
            <CardDescription>Performance metrics for each connected channel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead className="text-center">Conversations</TableHead>
                  <TableHead className="text-center">New Leads</TableHead>
                  <TableHead className="text-center">Response Rate</TableHead>
                  <TableHead className="text-right">Conversion Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platformStats.map((stat) => (
                  <TableRow key={stat.platform}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ChannelIcon channel={stat.platform} className="h-5 w-5" />
                        <span className="capitalize">{stat.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{stat.totalConversations}</TableCell>
                    <TableCell className="text-center font-medium">{stat.newLeads}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={stat.responseRate > 90 ? 'default' : 'secondary'} className={cn(stat.responseRate > 90 ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-amber-500/20 text-amber-700 border-amber-500/30')}>{stat.responseRate}%</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{stat.conversionRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
