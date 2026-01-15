
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { getServiceStatus, getUpdateLogs, type ServiceStatusItem, type UpdateLog } from "@/lib/data";
import { useState, useEffect } from "react";

type ServiceStatus = "operational" | "degraded" | "outage";

const statusConfig: Record<ServiceStatus, { text: string; className: string; icon: React.ReactNode }> = {
  operational: {
    text: "Operational",
    className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
  },
  degraded: {
    text: "Degraded Performance",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800",
    icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  },
  outage: {
    text: "Service Outage",
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800",
    icon: <XCircle className="h-4 w-4 text-red-500" />,
  },
};

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatusItem[]>([]);
  const [updateLogs, setUpdateLogs] = useState<UpdateLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesData, logsData] = await Promise.all([
          getServiceStatus(),
          getUpdateLogs(),
        ]);
        setServices(servicesData);
        setUpdateLogs(logsData);
      } catch (error) {
        console.error("Failed to fetch status data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const overallStatus: ServiceStatus = services.some(s => s.status === 'outage') ? 'outage' : services.some(s => s.status === 'degraded') ? 'degraded' : 'operational';

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Monitor the real-time status of our services.</CardDescription>
            </div>
            <Badge className={cn("text-sm py-1 px-3", statusConfig[overallStatus].className)}>
                {statusConfig[overallStatus].icon}
                <span className="ml-2">{statusConfig[overallStatus].text}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map(service => (
              <div key={service.name} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  {statusConfig[service.status].icon}
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Last checked: {service.lastChecked}</span>
                    <Badge variant="outline" className={cn(statusConfig[service.status].className)}>
                        {statusConfig[service.status].text}
                    </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Logs</CardTitle>
          <CardDescription>A log of recent changes and improvements to the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Version</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updateLogs.map(log => (
                <TableRow key={log.version}>
                  <TableCell>
                    <Badge variant="secondary">{log.version}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{log.date}</TableCell>
                  <TableCell>
                    <p className="font-medium">{log.description}</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      {log.changes.map((change, index) => (
                        <li key={index}>{change}</li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
