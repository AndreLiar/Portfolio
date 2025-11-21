'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home,
  Bell,
  Search,
  User,
  Settings,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut, getCurrentUser, onAuthStateChange } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';

const getPageTitle = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return 'Dashboard';
  
  const page = segments[segments.length - 1];
  return page.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export function AdminHeader() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    setMounted(true);
    
    // Get current user and listen for auth changes
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });
    
    return () => unsubscribe();
  }, []);
  
  const pageTitle = mounted ? getPageTitle(pathname) : 'Dashboard';
  
  // Get user display info
  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userInitials = userDisplayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of the admin panel.',
      });
      router.push('/auth/login');
    } catch (error) {
      toast({
        title: 'Error signing out',
        description: 'There was a problem signing you out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 md:px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side - Page title and breadcrumb */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              Manage your portfolio content efficiently
            </p>
          </div>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search content..." 
              className="pl-10 w-64 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {/* Theme toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {mounted && isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* View site */}
          <Link href="/en">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Home className="w-4 h-4 mr-2" />
              View Site
            </Button>
          </Link>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">{userDisplayName}</p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={handleSignOut}
              >
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}