'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { webEnv } from '../../environments/environments';

const env = webEnv;

const UserChannels = ({ params }: { params: { userAddress: string } }) => {
	const userAddress = params.userAddress;

	const [channels, setChannels] = useState([]);
	const [copiedChannel, setCopiedChannel] = useState('');

	useEffect(() => {
		fetch(`${env.api.apiUrl}/channels/${userAddress}`)
			.then((response) => response.json())
			.then((data) => setChannels(data.channels))
			.catch((error) => console.error('Error:', error));
	}, [copiedChannel]);

	const copyToClipboard = (url: string, channel: string) => {
		navigator.clipboard.writeText(url);
		setCopiedChannel(channel);
		setTimeout(() => setCopiedChannel(''), 700);
	};

	return (
		<div className="bg-primary flex flex-col items-center justify-center space-y-8 px-4 py-10 pt-20 sm:px-0">
			{channels.reverse().map((channel, index) => (
				<div
					key={index}
					className="bg-secondary w-full max-w-md space-y-2 rounded-lg p-6 text-center shadow-md"
				>
					<Link
						href={`/channel/${channel}/details`}
						className="text-primaryText mb-4 text-xl font-bold"
					>
						Channel Details ➡️➡️➡️
					</Link>
					<div className="bg-primary mb-4 space-y-4 rounded-lg p-4 shadow-md">
						<div className="flex flex-col items-center justify-center space-y-2 sm:space-x-0 sm:space-y-2">
							<button
								onClick={() => {
									copyToClipboard(
										`${env.api.apiUrl}/channelFeed/${channel}`,
										channel
									);
								}}
								className="text-primaryText bg-secondary w-3/4 rounded px-2 py-1"
							>
								{copiedChannel === channel ? '✅ Copied ✅' : '🔗 Copy RSS Feed 🔗'}
							</button>
							<button
								onClick={() =>
									(window.location.href = `${env.basescan.url}/address/${channel}`)
								}
								className="text-primaryText bg-secondary w-3/4 rounded px-2 py-1"
							>
								View Contract ↗️
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default UserChannels;