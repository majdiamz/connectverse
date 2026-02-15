
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChannelIcon } from "@/components/icons";
import { CheckCircle, XCircle, Loader2, Plus, Phone, Trash2 } from "lucide-react";
import type { Channel } from "@/lib/data";
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getIntegrations,
  connectIntegration,
  disconnectIntegration,
  getWhatsAppIntegrations,
  connectWhatsApp,
  getWhatsAppQR,
  disconnectWhatsApp,
  type Integration,
  type WhatsAppIntegration,
} from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";


const IntegrationCard = ({ integration, onUpdate }: { integration: Integration, onUpdate: () => void }) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(integration.status === 'connected' ? "••••••••••••••••••••" : "");
  const isConnected = integration.status === 'connected';

  const handleToggle = async () => {
    if (isConnected) {
        try {
            await disconnectIntegration(integration.channel);
            toast({
                title: "Integration Disconnected",
                description: `${integration.name} has been disconnected.`,
            });
            onUpdate();
        } catch (error) {
            toast({ variant: 'destructive', title: "Disconnect Failed", description: `Could not disconnect ${integration.name}.` });
        }
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

const WhatsAppQRModal = ({
  open,
  onOpenChange,
  integrationId,
  onConnected,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrationId: string | null;
  onConnected: () => void;
}) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('connecting');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollQR = useCallback(async () => {
    if (!integrationId) return;
    try {
      const result = await getWhatsAppQR(integrationId);
      setQrCode(result.qrCode);
      setStatus(result.status);

      if (result.status === 'connected') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        onConnected();
      }
    } catch (err) {
      console.error('Failed to poll QR code', err);
    }
  }, [integrationId, onConnected]);

  useEffect(() => {
    if (open && integrationId) {
      pollQR();
      intervalRef.current = setInterval(pollQR, 2000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [open, integrationId, pollQR]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect WhatsApp</DialogTitle>
          <DialogDescription>
            Scan this QR code with WhatsApp on your phone to connect.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {status === 'connected' ? (
            <div className="flex flex-col items-center gap-2 text-green-500">
              <CheckCircle className="h-16 w-16" />
              <p className="text-lg font-semibold">Connected!</p>
            </div>
          ) : qrCode ? (
            <img
              src={qrCode}
              alt="WhatsApp QR Code"
              className="w-64 h-64 rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 w-64 h-64 justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Generating QR code...</p>
            </div>
          )}
          {status !== 'connected' && (
            <p className="text-xs text-muted-foreground text-center">
              Open WhatsApp on your phone, go to Settings &gt; Linked Devices &gt; Link a Device,
              and scan this QR code.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const WhatsAppSection = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<WhatsAppIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeIntegrationId, setActiveIntegrationId] = useState<string | null>(null);

  const fetchWhatsApp = async () => {
    try {
      const data = await getWhatsAppIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error("Failed to fetch WhatsApp integrations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhatsApp();
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const result = await connectWhatsApp();
      setActiveIntegrationId(result.integrationId);
      setQrModalOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Connection Failed",
        description: "Could not start WhatsApp connection.",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      await disconnectWhatsApp(integrationId);
      toast({
        title: "WhatsApp Disconnected",
        description: "The WhatsApp integration has been disconnected.",
      });
      fetchWhatsApp();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Disconnect Failed",
        description: "Could not disconnect WhatsApp.",
      });
    }
  };

  const handleConnected = () => {
    toast({
      title: "WhatsApp Connected",
      description: "Your WhatsApp account has been successfully connected.",
    });
    setTimeout(() => {
      setQrModalOpen(false);
      fetchWhatsApp();
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChannelIcon channel="whatsapp" className="w-6 h-6" />
          <h2 className="text-lg font-semibold">WhatsApp Integrations</h2>
        </div>
        <Button onClick={handleConnect} disabled={connecting} size="sm">
          {connecting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Add WhatsApp
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : integrations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No WhatsApp integrations yet. Click &quot;Add WhatsApp&quot; to connect a number.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                    {integration.user && (
                      <CardDescription>{integration.user.name}</CardDescription>
                    )}
                  </div>
                  <Badge
                    variant={integration.status === 'connected' ? 'default' : 'secondary'}
                    className={integration.status === 'connected' ? 'bg-green-500' : ''}
                  >
                    {integration.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                {integration.whatsappPhoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>+{integration.whatsappPhoneNumber}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-auto"
                  onClick={() => handleDisconnect(integration.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <WhatsAppQRModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        integrationId={activeIntegrationId}
        onConnected={handleConnected}
      />
    </div>
  );
};

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
    <div className="space-y-8">
        <WhatsAppSection />

        <div>
          <h2 className="text-lg font-semibold mb-4">Other Channels</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map(integration => (
              <IntegrationCard key={integration.channel} integration={integration} onUpdate={fetchIntegrations} />
            ))}
          </div>
        </div>
    </div>
  );
}
