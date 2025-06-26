'use client';

import React, { useState, useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, User, Settings, LogIn, LogOut, Loader2 } from 'lucide-react';
import { Logo } from './icons/logo';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getAuthConfig } from '@/app/actions';
import { Skeleton } from './ui/skeleton';


type AuthConfig = {
  google: { enabled: boolean; };
};

type UserMenuProps = {
  authConfig: AuthConfig | null;
  isAuthenticated: boolean;
  onLogout: () => void;
  isLoading: boolean;
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authConfig, setAuthConfig] = useState<AuthConfig | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    getAuthConfig().then(config => {
      setAuthConfig(config);
      const storedAuthStatus = document.cookie
        .split('; ')
        .some((item) => item.startsWith('isAuthenticated=true'));
      
      if (!config.google.enabled) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(storedAuthStatus);
      }
    });
  }, [pathname]); // Re-check auth status on page navigation

  const handleLogout = () => {
    document.cookie = 'isAuthenticated=; path=/; max-age=0';
    setIsAuthenticated(false);
    router.push('/login');
  }

  // Hide layout on login page so it can be a standalone page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const isLoading = !isMounted;
  
  // While checking auth state on the client, show a loader to avoid flicker.
  // This also prevents hydration errors.
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-headline font-semibold text-primary">DentalFlow</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/'}>
                <Link href="/">
                  <LayoutDashboard />
                  Patients
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-card">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold font-headline">Patient Management</h2>
          </div>
          <UserMenu 
            authConfig={authConfig} 
            isAuthenticated={isAuthenticated} 
            onLogout={handleLogout} 
            isLoading={isLoading}
          />
        </header>
        <main className="p-4 sm:p-6 lg:p-8 bg-background/80 min-h-[calc(100vh-4.5rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


function UserMenu({ authConfig, isAuthenticated, onLogout, isLoading }: UserMenuProps) {
  if (isLoading || !authConfig) {
    return <Skeleton className="h-9 w-28 rounded-md" />;
  }

  if (authConfig.google.enabled && !isAuthenticated) {
    return (
      <Button asChild>
        <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Login
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/100x100.png" alt="Banaag Dental" data-ai-hint="logo building" />
            <AvatarFallback>BD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Banaag Dental</p>
            <p className="text-xs leading-none text-muted-foreground">
              contact@banaagdental.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Clinic Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {authConfig.google.enabled && (
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
