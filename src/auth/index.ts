import { Lucia } from 'lucia';
import { luciaAdapter } from '@/db';

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		UserId: number;
		DatabaseUserAttributes: {
			username?: string;
			readwiseToken?: string;
		};
	}
}

export const lucia = new Lucia(luciaAdapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === 'production',
		},
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			hasToken: !!attributes.readwiseToken,
		};
	},
});
