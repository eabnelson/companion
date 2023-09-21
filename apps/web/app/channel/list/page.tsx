'use client';

import React, { useEffect, useState } from 'react';
import { webEnv } from '../../../environments/environments';

const env = webEnv;

const ChannelList = () => {
	const [channels, setChannels] = useState([]);
	const [copiedChannel, setCopiedChannel] = useState('');

	useEffect(() => {
		fetch(`${env.api.apiUrl}/channels`)
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
		<div className="flex flex-col items-center">
			{channels.map((channel, index) => (
				<div key={index} className="mb-4 flex flex-col items-center">
					<button
						onClick={() =>
							(window.location.href = `${env.basescan.url}/address/${channel}`)
						}
						className="bg-primaryText text-primary hover:bg-secondary mb-4 rounded px-2 py-1" // Add margin-bottom here
					>
						View Contract ↗️
					</button>
					<div className="flex space-x-2">
						<button
							onClick={() => (window.location.href = `/channel/${channel}/details`)}
							className="bg-primaryText text-primary hover:bg-secondary rounded px-2 py-1"
						>
							👀 View Channel 👀
						</button>
						<button
							onClick={() =>
								copyToClipboard(`${env.api.apiUrl}/channelFeed/${channel}`, channel)
							}
							className="bg-primaryText text-primary hover:bg-secondary rounded px-2 py-1"
						>
							{copiedChannel === channel ? '✅ Copied ✅' : '🔗 Get RSS Feed 🔗'}
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default ChannelList;
