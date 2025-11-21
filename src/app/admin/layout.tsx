'use client';

// import { redirect } from 'next/navigation';
// import { getCurrentUserServer, isUserAdminServer } from '@/lib/firebase/server-auth';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EnhancedSidebar } from '@/components/admin/enhanced-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth checks (currently disabled)

  return (
    <SidebarProvider>
      <div className="admin-layout min-h-screen bg-white flex w-full overflow-hidden">
        <EnhancedSidebar />
        
        <main className="flex-1 flex flex-col bg-white w-full min-w-0">
          <AdminHeader />
          
          {/* Content Container - Force full width */}
          <div className="flex-1 bg-white w-full">
            <div className="p-4 md:p-6 lg:p-8 bg-white min-h-full w-full">
              <div className="w-full max-w-none bg-white">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
