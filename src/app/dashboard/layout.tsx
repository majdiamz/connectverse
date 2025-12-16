import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <div className='flex flex-col h-screen'>
              <AppHeader />
              <main className="flex-1 overflow-y-auto p-2 md:p-3 lg:p-4">
                {children}
              </main>
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
