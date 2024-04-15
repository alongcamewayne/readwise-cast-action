'use server';

import type { StatusAPIResponse } from '@farcaster/auth-kit';
import type { Session, User } from 'lucia';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { userTable } from '@/db/schema';
import { lucia } from '.';

type DbUser = typeof userTable.$inferSelect;

export async function login(res: StatusAPIResponse) {
	if (!res.fid) return;

	// check if user exists in database
	const result = await db.query.userTable.findFirst({
		where: eq(userTable.id, res.fid),
	});

	let user: DbUser;

	// create user if it doesn't exist
	if (!result) {
		console.log('creating user');
		const insertResult = await db
			.insert(userTable)
			.values({ id: res.fid, username: res.username })
			.returning();
		user = insertResult[0];
	} else user = result;

	console.log(user);

	const session = await lucia.createSession(user.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	revalidatePath('/');
}

export const validateRequest = cache(
	async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) return { user: null, session: null };

		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {}

		return result;
	}
);

export async function logout() {
	const { session } = await validateRequest();
	if (!session) return { error: 'Unauthorized' };

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	revalidatePath('/');
}
