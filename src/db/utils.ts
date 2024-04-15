'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { userTable } from '@/db/schema';
import { validateRequest } from '@/auth/utils';

export async function saveToken(form: FormData) {
	const token = form.get('readwise_token') as string;
	if (!token) return { success: false };

	const { user } = await validateRequest();
	if (!user) return { success: false };

	try {
		await db.update(userTable).set({ readwiseToken: token }).where(eq(userTable.id, user.id));
		revalidatePath('/');
		return { success: true };
	} catch (error) {
		console.log('error saving token', error);
		return { success: false };
	}
}

export async function deleteToken() {
	const { user } = await validateRequest();
	if (!user) return { success: false };

	try {
		await db.update(userTable).set({ readwiseToken: null }).where(eq(userTable.id, user.id));
		revalidatePath('/');
		return { success: true };
	} catch (error) {
		console.log('error deleting token', error);
		return { success: false };
	}
}
