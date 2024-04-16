/* eslint-disable @next/next/no-img-element */

import type { Metadata } from 'next';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { validateRequest } from '@/auth/utils';
import { Login } from '@/components/Login';
import { TokenForm } from '@/components/TokenForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const runtime = 'edge';

export const metadata: Metadata = {
	title: 'Readwise Cast Action',
	description: 'Save casts on Farcaster to your Readwise library with a single click.',
};

function getInstallationUrl() {
	const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/save-cast`);
	return `https://warpcast.com/~/add-cast-action?url=${url.toString()}`;
}

export default async function Home() {
	const { user } = await validateRequest();
	console.log();

	return (
		<div className="flex flex-col justify-between gap-10">
			<Card className="max-w-lg border-none shadow-none">
				<CardHeader className="pb-4">
					<CardTitle>Click. Save. Organize.</CardTitle>
					<CardDescription>
						This cast action captures casts on Farcaster and saves them to your Readwise library
						with a single click.
					</CardDescription>
				</CardHeader>

				<CardContent className="text-sm">
					<div className="mb-4">
						<Login user={user} />
					</div>

					<div>
						<p className="mb-2 underline">Instructions</p>

						<ul className="flex list-disc flex-col gap-5">
							<div className="flex flex-col">
								<li className="font-semibold">Connect your Readwise account</li>
								<TokenForm user={user} />
							</div>

							<a
								href={getInstallationUrl()}
								target="_blank"
								className="flex w-fit items-center gap-1">
								<li className="font-semibold">
									<span className="underline">Install the cast action</span>
								</li>
								<ExternalLinkIcon className="h-4 w-4" />
							</a>

							<div className="flex flex-col">
								<li className="font-semibold">Save casts!</li>
								<img src="/screenshot.png" alt="screenshot" className="rounded-md" />
							</div>
						</ul>
					</div>
				</CardContent>
			</Card>

			<div className="flex items-baseline gap-1 p-6 text-sm text-muted-foreground">
				<p>
					Made with 🪩 by{' '}
					<a href="https://warpcast.com/alongcamewayne" target="_blank" className="font-semibold">
						@alongcamewayne
					</a>
				</p>
				<p>•</p>
				<a href="https://github.com/alongcamewayne/readwise-cast-action" target="_blank">
					GitHub
				</a>
			</div>
		</div>
	);
}
