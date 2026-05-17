import HeaderUser from '#/integrations/clerk/header-user';
import { useAuth } from '@clerk/clerk-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export function Navbar() {
    const { isSignedIn } = useAuth();

    return (
        <nav className="w-full border-b border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <Link href="/" className="font-bold text-lg text-primary">
                        FileVault
                    </Link>

                    <div className='flex items-center gap-4'>
                        {isSignedIn && (
                            <Link href="/dashboard">
                                <Button>
                                    Dashboard
                                </Button>
                            </Link>
                        )}

                        <HeaderUser />
                    </div>
                </div>
            </div>
        </nav>
    );
}