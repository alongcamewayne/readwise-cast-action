'use client';

import './globals.css';
import '@farcaster/auth-kit/styles.css';
import { Inter as FontSans } from 'next/font/google';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthKitProvider>
			<html lang="en">
				<body
					className={cn('min-h-screen bg-background font-sans antialiased p-2', fontSans.variable)}>
					{children}
					<Toaster richColors position="top-center" />
				</body>
			</html>
		</AuthKitProvider>
	);
}
