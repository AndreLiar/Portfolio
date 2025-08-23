import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('AdminLayout: Checking if user is blog owner...');
  
  try {
    const user = await getCurrentUser();
    console.log('AdminLayout: User email:', user?.email);
    
    if (!user) {
      console.log('AdminLayout: No user found, redirecting to login');
      redirect('/auth/login');
    }

    // Simple check - only the blog owner can access admin
    const adminEmail = process.env.BLOG_ADMIN_EMAIL;
    
    if (!adminEmail) {
      console.error('AdminLayout: BLOG_ADMIN_EMAIL environment variable not set');
      redirect('/unauthorized');
    }
    
    if (user.email !== adminEmail) {
      console.log('AdminLayout: User is not the blog owner, access denied');
      redirect('/unauthorized');
    }

    console.log('AdminLayout: Blog owner authenticated, access granted');
  } catch (error) {
    console.error('AdminLayout: Error during auth check:', error);
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, Laurel
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}