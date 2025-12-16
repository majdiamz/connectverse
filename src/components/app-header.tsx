
"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserAvatar } from "./user-avatar";

export function AppHeader() {
  const pathname = usePathname();

  const getPageTitle = () => {
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 1) {
      const title = pathParts[pathParts.length - 1];
      if (title.toLowerCase() === 'faq') return 'FAQ';
      // Handle cases like /dashboard/email?emailId=...
      if (pathParts[1].toLowerCase() === 'email' && title.toLowerCase() !== 'email') {
          return 'Email';
      }
      return title.charAt(0).toUpperCase() + title.slice(1);
    }
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      default:
        return "ConnectVerse";
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>

      <UserAvatar />
    </header>
  );
}
