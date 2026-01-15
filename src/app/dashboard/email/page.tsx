
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getEmails, sendEmail, updateEmail, currentUser, type Email, type NewEmail } from '@/lib/data';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Inbox, Send, FileText, Trash2, Archive, Edit, CornerUpLeft, CornerUpRight, Search, Mail as MailIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const EmailList = ({
  emails,
  onSelectEmail,
  selectedEmailId
}: {
  emails: Email[];
  onSelectEmail: (id: string) => void;
  selectedEmailId: string | null;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
      setIsMounted(true);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = parseISO(timestamp);
    if (isToday(date)) return format(date, 'p');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search emails..." className="pl-9" />
        </div>
      </CardHeader>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {emails.map(email => {
            const plainBody = email.body.replace(/<[^>]*>?/gm, ' ');
            const snippet = plainBody.length > 35 ? `${plainBody.substring(0, 35)}...` : plainBody;
            return (
              <button
                key={email.id}
                onClick={() => onSelectEmail(email.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex gap-3 items-start",
                  selectedEmailId === email.id && "bg-accent",
                  !email.isRead && "bg-primary/10"
                )}
              >
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src={email.from.avatar} />
                  <AvatarFallback>{email.from.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <p className={cn("font-semibold truncate", !email.isRead && "text-primary")}>{email.from.name}</p>
                    <p className="text-xs text-muted-foreground">{isMounted ? formatTimestamp(email.timestamp) : ''}</p>
                  </div>
                  <p className="text-sm truncate font-medium">{email.subject}</p>
                  <p className="text-xs text-muted-foreground truncate">{snippet}</p>
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};

const EmailView = ({ email }: { email: Email | null }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    if (!email) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-card border-x">
                <MailIcon className="w-16 h-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No email selected</h3>
                <p className="text-muted-foreground">Select an email from the list to view it.</p>
            </div>
        );
    }
    
    const formatTimestamp = (timestamp: string) => {
        const date = parseISO(timestamp);
        return format(date, "MMMM d, yyyy 'at' h:mm a");
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src={email.from.avatar} />
                            <AvatarFallback>{email.from.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{email.from.name}</p>
                            <p className="text-xs text-muted-foreground">{email.from.email}</p>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{isMounted ? formatTimestamp(email.timestamp) : ''}</p>
                </div>
                <h2 className="text-lg font-semibold mt-3">{email.subject}</h2>
            </CardHeader>
            <ScrollArea className="flex-1">
                <div className="p-6 text-sm prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: email.body }} />
            </ScrollArea>
            <CardContent className="p-4 border-t">
                <div className="flex items-center gap-2">
                    <Button variant="outline"><CornerUpLeft className="mr-2 h-4 w-4" /> Reply</Button>
                    <Button variant="outline"><CornerUpRight className="mr-2 h-4 w-4" /> Forward</Button>
                    <Button variant="outline" size="icon" className="ml-auto"><Archive className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                </div>
            </CardContent>
        </Card>
    );
};

const ComposeEmailDialog = ({ onSend }: { onSend: (newEmail: NewEmail) => void }) => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [open, setOpen] = useState(false);

    const handleSend = () => {
        onSend({ to, subject, body });
        setOpen(false);
        setTo('');
        setSubject('');
        setBody('');
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Compose
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Compose Email</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="to" className="text-right">To</Label>
                        <Input id="to" value={to} onChange={(e) => setTo(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">Subject</Label>
                        <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="col-span-3" />
                    </div>
                    <Textarea 
                        value={body} 
                        onChange={(e) => setBody(e.target.value)}
                        className="h-64"
                        placeholder="Write your email here..."
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSend}><Send className="mr-2 h-4 w-4" /> Send</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const MailboxNav = ({ 
    currentFolder, 
    onSelectFolder,
    onSend
}: { 
    currentFolder: string, 
    onSelectFolder: (folder: Email['folder']) => void,
    onSend: (email: NewEmail) => void 
}) => {
    const folders = [
        { name: 'inbox', icon: Inbox },
        { name: 'sent', icon: Send },
        { name: 'drafts', icon: FileText },
        { name: 'trash', icon: Trash2 },
    ];
    
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="p-4">
                <ComposeEmailDialog onSend={onSend} />
            </CardHeader>
            <CardContent className="flex-1 p-2">
                <nav className="space-y-1">
                    {folders.map(folder => (
                        <Button
                            key={folder.name}
                            variant={currentFolder === folder.name ? 'secondary' : 'ghost'}
                            className="w-full justify-start gap-2"
                            onClick={() => onSelectFolder(folder.name as Email['folder'])}
                        >
                            <folder.icon className="h-4 w-4" />
                            <span className="capitalize">{folder.name}</span>
                        </Button>
                    ))}
                </nav>
            </CardContent>
             <CardFooter className="p-2 border-t">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Archive className="h-4 w-4" />
                                <span>Archive</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Feature coming soon</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardFooter>
        </Card>
    );
}

function EmailPageContent() {
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const [emails, setEmails] = useState<Email[]>([]);
    const [currentFolder, setCurrentFolder] = useState<Email['folder']>('inbox');
    const [loading, setLoading] = useState(true);
    
    const [selectedEmailId, setSelectedEmailId] = useState(searchParams.get('emailId'));

    useEffect(() => {
        setSelectedEmailId(searchParams.get('emailId'));
    }, [searchParams]);

    const fetchEmails = async (folder: Email['folder']) => {
        setLoading(true);
        try {
            const fetchedEmails = await getEmails(folder);
            setEmails(fetchedEmails.sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime()));
        } catch (error) {
            console.error("Failed to fetch emails", error);
            toast({ variant: "destructive", title: "Error", description: "Could not fetch emails." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails(currentFolder);
    }, [currentFolder]);

    const handleSelectEmail = async (id: string) => {
        const email = emails.find(e => e.id === id);
        if(email && !email.isRead) {
            try {
                await updateEmail(id, { isRead: true });
                fetchEmails(currentFolder); // Refetch to update read status
            } catch (error) {
                console.error("Failed to mark email as read", error);
            }
        }

        const url = new URL(window.location.href);
        url.searchParams.set('emailId', id);
        window.history.pushState({ path: url.href }, '', url.href);
        setSelectedEmailId(id);
    };

    const handleSelectFolder = (folder: Email['folder']) => {
        setCurrentFolder(folder);
        setSelectedEmailId(null);
        const url = new URL(window.location.href);
        url.searchParams.delete('emailId');
        window.history.pushState({ path: url.href }, '', url.href);
    };

    const handleSendEmail = async (newEmailData: NewEmail) => {
        try {
            await sendEmail(newEmailData);
            toast({
                title: "Email Sent!",
                description: `Your email to ${newEmailData.to} has been sent.`,
            });
            handleSelectFolder('sent');
        } catch (error) {
            console.error("Failed to send email", error);
            toast({ variant: "destructive", title: "Error", description: "Could not send email." });
        }
    };
    
    const selectedEmail = useMemo(() => {
        if (!selectedEmailId) return emails.length > 0 ? emails[0] : null;
        return emails.find(e => e.id === selectedEmailId) ?? null;
    }, [emails, selectedEmailId]);
    
    // Auto-select first email in folder if none is selected
    useEffect(() => {
        if (!selectedEmailId && emails.length > 0) {
            const firstEmail = emails[0];
            handleSelectEmail(firstEmail.id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedEmailId, emails]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="h-[calc(100vh-8rem)] grid grid-cols-1 md:grid-cols-[250px_300px_1fr] lg:grid-cols-[250px_450px_1fr] gap-1">
            <MailboxNav currentFolder={currentFolder} onSelectFolder={handleSelectFolder} onSend={handleSendEmail} />
            <EmailList emails={emails} onSelectEmail={handleSelectEmail} selectedEmailId={selectedEmail?.id ?? null} />
            <EmailView email={selectedEmail} />
        </div>
    );
}

export default function EmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EmailPageContent />
        </Suspense>
    )
}
