
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/lib/data";
import { LogOut, Settings, User } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export function UserAvatar() {
    const [isMounted, setIsMounted] = React.useState(false);
    const router = useRouter();
    const { toast } = useToast();

    React.useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            toast({
                title: 'Logged Out',
                description: 'You have been successfully logged out.',
            });
            router.push('/login');
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Logout Failed',
                description: 'An error occurred during logout. Please try again.',
            });
        }
    };

    if (!isMounted) {
        return (
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9"></Avatar>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="professional headshot" />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                    alex.green@example.com
                </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
