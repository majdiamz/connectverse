
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChannelIcon } from "@/components/icons";
import { CheckCircle, XCircle } from "lucide-react";
import type { Channel } from "@/lib/data";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getIntegrations, connectIntegration, type Integration } from "@/lib/data";


const IntegrationCard = ({ integration, onUpdate }: { integration: Integration, onUpdate: () => void }) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(integration.status === 'connected' ? "••••••••••••••••••••" : "");
  const isConnected = integration.status === 'connected';

  const handleToggle = async () => {
    if (isConnected) {
        // Disconnect logic would go here, maybe an API call
        // For now, we'll just simulate it on the frontend
        toast({ title: "Disconnected (simulated)", description: `${integration.name} has been disconnected.` });
    } else {
        try {
            await connectIntegration(integration.channel, apiKey);
            toast({
                title: `Integration Connected`,
                description: `${integration.name} has been successfully connected.`,
            });
            onUpdate();
        } catch (error) {
            toast({ variant: 'destructive', title: "Connection Failed", description: `Could not connect ${integration.name}. Please check your API key.` });
        }
    }
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
                <Input 
                    id={`${integration.channel}-api-key`} 
                    placeholder="Enter your API key" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={isConnected}
                />
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
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const data = await getIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error("Failed to fetch integrations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integrations.map(integration => (
            <IntegrationCard key={integration.channel} integration={integration} onUpdate={fetchIntegrations} />
          ))}
        </div>
    </div>
  );
}
