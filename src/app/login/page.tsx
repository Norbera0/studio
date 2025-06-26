'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons/logo';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// A simple SVG for Google icon
const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2">
        <title>Google</title>
        <path fill="#4285F4" d="M21.545 11.23h-9.75v3.545h5.564c-.245 1.173-.99 2.182-2.182 2.891v2.291h2.945c1.727-1.582 2.718-3.964 2.718-6.727 0-.645-.064-1.273-.173-1.891z"/>
        <path fill="#34A853" d="M11.795 22.005c2.564 0 4.718-.845 6.291-2.291l-2.945-2.291c-.845.564-1.936.9-3.345.9-2.564 0-4.736-1.727-5.5-4.091H3.25v2.364c1.618 3.218 4.791 5.418 8.545 5.418z"/>
        <path fill="#FBBC05" d="M6.295 13.514c-.182-.564-.282-1.164-.282-1.782s.1-1.218.282-1.782V7.586H3.25a9.962 9.962 0 000 8.827l3.045-2.364z"/>
        <path fill="#EA4335" d="M11.795 5.914c1.391 0 2.645.473 3.627 1.418l2.6-2.6A9.55 9.55 0 0011.795 2a9.96 9.96 0 00-8.545 5.418l3.045 2.364c.764-2.364 2.936-4.091 5.5-4.091z"/>
    </svg>
);

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = () => {
        setIsLoading(true);
        // In a real app, this would trigger the Google OAuth flow.
        // We'll simulate it with a timeout.
        setTimeout(() => {
            // On successful login, we set a cookie for the middleware to read.
            document.cookie = 'isAuthenticated=true; path=/; max-age=604800'; // 7 days
            toast({
                title: 'Login Successful',
                description: 'Welcome back to DentalFlow!',
            });
            // Refresh the page. The middleware will intercept the request
            // and redirect to the dashboard because the auth cookie is now set.
            router.refresh();
        }, 1500);
    };

    const handlePasswordLogin = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            variant: 'destructive',
            title: 'Feature Not Available',
            description: 'Username and password login is not yet implemented. Please use Google to sign in.',
        });
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="absolute top-8 left-8">
                 <Link href="/" className="flex items-center gap-2">
                    <Logo className="w-8 h-8 text-primary" />
                    <h1 className="text-xl font-headline font-semibold text-primary">DentalFlow</h1>
                </Link>
            </div>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Login</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your clinic's dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                         {isLoading ? 'Signing in...' : 'Sign in with Google'}
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <form onSubmit={handlePasswordLogin} className="grid gap-2">
                        <div className="grid gap-1">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" disabled />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" disabled />
                        </div>
                         <Button type="submit" className="w-full mt-2" disabled>Sign in with Email</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
