'use client';

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
	}, []);

	const copyToClipboard = (url: string, channel: string) => {
		navigator.clipboard.writeText(url);
		setCopiedChannel(channel);
		setTimeout(() => setCopiedChannel(''), 2000); // Reset after 2 seconds
	};

	return (
		<div className="bg-primary flex flex-col items-center justify-center px-4 py-10 pt-20 sm:px-0">
			{channels.reverse().map((channel, index) => (
				<div key={index} className="mb-4 flex flex-col items-center">
					<div className="bg-secondary w-full max-w-md rounded-lg p-6 shadow-md">
						<button
							onClick={() => (window.location.href = `/channel/${channel}/details`)}
							className="bg-primaryText text-primary hover:bg-secondary mb-4 rounded px-2 py-1"
						>
							👀 View Channel 👀
						</button>
						<div className="flex space-x-2">
							<button
								onClick={() =>
									copyToClipboard(
										`${env.api.apiUrl}/channelFeed/${channel}`,
										channel
									)
								}
								className="bg-primaryText text-primary hover:bg-secondary rounded px-2 py-1"
							>
								{copiedChannel === channel ? '✅ Copied ✅' : '🔗 Get RSS Feed 🔗'}
							</button>
							<button
								onClick={() =>
									(window.location.href = `${env.basescan.url}/address/${channel}`)
								}
								className="bg-primaryText text-primary hover:bg-secondary rounded px-2 py-1"
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
