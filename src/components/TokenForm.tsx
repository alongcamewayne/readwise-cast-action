'use client';

import type { User } from 'lucia';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteToken, saveToken } from '../db/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type TokenFormProps = {
	user: User | null;
};

export function TokenForm({ user }: TokenFormProps) {
	const [editMode, setEditMode] = useState(false);

	async function handleSubmit(formData: FormData) {
		const { success } = await saveToken(formData);
		if (success) {
			setEditMode(false);
			toast.success('Token saved.');
		} else toast.error('Something went wrong. Please try again.');
	}

	async function handleDelete() {
		const { success } = await deleteToken();
		if (success) {
			setEditMode(false);
			toast.success('Token deleted.');
		} else toast.error('Something went wrong. Please try again.');
	}

	if (!editMode && user?.hasToken) {
		return (
			<div className="flex items-center">
				<p>✔️ Connected!</p>
				<div className="ml-2 flex items-baseline gap-1">
					<Button variant="link" onClick={() => setEditMode(true)} className="px-0">
						Edit token
					</Button>
					<p>&bull;</p>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="link" className="px-0 hover:text-red-500">
								Delete token
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									You won&apos;t be able to save casts until you connect your Readwise account
									again.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction asChild>
									<Button
										onClick={handleDelete}
										variant="destructive"
										className="bg-destructive/90 hover:bg-destructive">
										Yes, delete
									</Button>
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="my-2 flex gap-1">
				<form action={handleSubmit} className="flex w-full items-center gap-2 ">
					<Input
						type="text"
						placeholder="Enter your access token..."
						name="readwise_token"
						className=""
						disabled={!user}
						required
					/>
					<Button type="submit" disabled={!user}>
						Save
					</Button>
				</form>

				{user?.hasToken && (
					<Button variant="secondary" onClick={() => setEditMode(false)}>
						Cancel
					</Button>
				)}
			</div>

			<p className="text-sm text-muted-foreground">
				Get your access token at{' '}
				<a
					href="https://readwise.io/access_token"
					target="_blank"
					className="font-medium hover:underline">
					readwise.io/access_token
				</a>
			</p>
		</div>
	);
}
