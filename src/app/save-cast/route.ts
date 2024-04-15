import { NextResponse, type NextRequest } from 'next/server';
import { getFrameMessage, type FrameRequest } from '@coinbase/onchainkit';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { userTable } from '@/db/schema';
import { getWarpcastUrl } from './utils';

export const runtime = 'edge';
const readwise = 'https://readwise.io/api/v2/highlights/';

export function GET() {
	return NextResponse.json({
		name: 'Save to Readwise',
		icon: 'bookmark',
		description: 'Save casts to your Readwise library with a single click.',
		aboutUrl: '',
		action: { type: 'post' },
	});
}

export async function POST(request: NextRequest) {
	const frameRequest: FrameRequest = await request.json();
	const { isValid, message } = await getFrameMessage(frameRequest);

	if (!isValid) {
		return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
	}

	const { action } = message.raw;
	const { cast } = action;

	// get the user's Readwise API token
	const user = await db.query.userTable.findFirst({
		where: eq(userTable.id, action.interactor.fid),
	});

	if (!user) {
		return NextResponse.json({ message: "You haven't set up your account yet." }, { status: 400 });
	}

	if (!user.readwiseToken) {
		return NextResponse.json({ message: 'Please set your access token.' }, { status: 400 });
	}

	const response = await fetch(readwise, {
		method: 'post',
		headers: {
			Authorization: `Token ${user.readwiseToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			highlights: [
				{
					text: cast.text,
					title: `${cast.text?.slice(0, 25)}...`,
					author: `@${cast.author.username} on Warpcast`,
					source_url: getWarpcastUrl(cast),
					source_type: 'cast_action',
					highlighted_at: new Date().toISOString(),
				},
			],
		}),
	});

	if (response.ok) {
		console.log(await response.json());
		return NextResponse.json({
			message: 'Cast saved to your Readwise library!',
		});
	}

	console.log(await response.text());
	return NextResponse.json(
		{ message: 'Failed to save cast. Please try again later.' },
		{ status: 400 }
	);
}
