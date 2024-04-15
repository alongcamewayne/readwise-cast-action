'use client';

import { SignInButton } from '@farcaster/auth-kit';
import type { User } from 'lucia';
import { login, logout } from '@/auth/utils';
import { Button } from './ui/button';

type LoginProps = {
	user: User | null;
};

export function Login({ user }: LoginProps) {
	if (!user) return <SignInButton onSuccess={login} />;

	return (
		<div className="flex items-center gap-1.5">
			<p>
				Connected as <span className="font-semibold">@{user.username}</span>
			</p>
			<form action={logout}>
				<Button variant="link" type="submit" className="px-1">
					Logout
				</Button>
			</form>
		</div>
	);
}
