'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Settings, 
  MapPin,
  Briefcase,
  GraduationCap,
  Languages,
  Heart,
  User,
  LogOut,
  Home,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';

const navigationItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/skills', label: 'Skills', icon: Settings },
  { href: '/admin/journey', label: 'Journey', icon: MapPin },
  { href: '/admin/work-experience', label: 'Work Experience', icon: Briefcase },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/languages', label: 'Languages', icon: Languages },
  { href: '/admin/interests', label: 'Interests', icon: Heart },
  { href: '/admin/bio', label: 'About/Bio', icon: User },
];

interface EnhancedSidebarProps {
  className?: string;
}

export function EnhancedSidebar({ className }: EnhancedSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className={cn(
      "border-r border-gray-200/60 bg-white/95 backdrop-blur-md shadow-xl transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                <p className="text-xs text-gray-600 font-medium">Portfolio CMS</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-primary/10"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-3 space-y-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            // Simplified active state calculation to prevent hydration mismatch
            const isActive = mounted ? (pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))) : false;
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "w-full flex items-center group hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg p-3 cursor-pointer",
                  mounted && isActive && "bg-primary/15 text-primary shadow-sm border border-primary/20",
                  isCollapsed && "justify-center"
                )}>
                  <IconComponent className={cn(
                    "w-4 h-4 group-hover:scale-110 transition-transform",
                    !isCollapsed && "mr-3",
                    mounted && isActive && "text-primary"
                  )} />
                  {!isCollapsed && (
                    <span className={cn(
                      "font-medium truncate",
                      mounted && isActive ? "text-primary font-semibold" : "text-gray-700"
                    )}>{item.label}</span>
                  )}
                  {mounted && isActive && !isCollapsed && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-gray-200/50 space-y-2">
        <Link href="/en">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full hover:bg-gray-100/80 transition-colors",
              isCollapsed ? "justify-center p-3" : "justify-start"
            )}
          >
            <Home className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
            {!isCollapsed && "View Portfolio"}
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full hover:bg-red-50 hover:text-red-600 transition-colors",
            isCollapsed ? "justify-center p-3" : "justify-start"
          )}
          onClick={handleSignOut}
        >
          <LogOut className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Sign Out"}
        </Button>
      </div>
    </div>
  );
}