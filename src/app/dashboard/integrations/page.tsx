
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChannelIcon } from "@/components/icons";
import { CheckCircle, XCircle } from "lucide-react";
import type { Channel } from "@/lib/data";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


type IntegrationStatus = 'connected' | 'disconnected';

interface Integration {
  name: string;
  channel: Channel;
  description: string;
  status: IntegrationStatus;
}

const initialIntegrations: Integration[] = [
  { name: "WhatsApp", channel: "whatsapp", description: "Connect your WhatsApp Business account.", status: 'connected' },
  { name: "Messenger", channel: "messenger", description: "Connect your Facebook Messenger.", status: 'disconnected' },
  { name: "Instagram", channel: "instagram", description: "Connect your Instagram DMs.", status: 'connected' },
  { name: "TikTok", channel: "tiktok", description: "Connect your TikTok messages.", status: 'disconnected' },
];

const IntegrationCard = ({ integration }: { integration: Integration }) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<IntegrationStatus>(integration.status);
  const isConnected = status === 'connected';

  const handleToggle = () => {
    const newStatus = isConnected ? 'disconnected' : 'connected';
    setStatus(newStatus);
    toast({
        title: `Integration ${newStatus === 'connected' ? 'Connected' : 'Disconnected'}`,
        description: `${integration.name} has been successfully ${newStatus}.`,
    });
  }

  return (
    <Card>
        <CardHeader>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <ChannelIcon channel={integration.channel} className="w-8 h-8" />
                    <div>
                        <CardTitle>{integration.name}</CardTitle>
                        <CardDescription>{integration.description}</CardDescription>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    {isConnected ? (
                        <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-500">Connected</span>
                        </>
                    ) : (
                        <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-red-500">Disconnected</span>
                        </>
                    )}
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <Label htmlFor={`${integration.channel}-api-key`}>API Key</Label>
                <Input id={`${integration.channel}-api-key`} placeholder="Enter your API key" defaultValue={isConnected ? "••••••••••••••••••••" : ""} />
            </div>
        </CardContent>
        <CardFooter>
            <Button 
                onClick={handleToggle}
                variant={isConnected ? 'destructive' : 'default'} 
                className="ml-auto"
            >
                {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
        </CardFooter>
    </Card>
  )
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integrations.map(integration => (
            <IntegrationCard key={integration.channel} integration={integration} />
          ))}
        </div>
    </div>
  );
}
