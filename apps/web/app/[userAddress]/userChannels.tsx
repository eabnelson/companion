'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { webEnv } from '../../environments/environments';
import { useRouter } from 'next/navigation';

const env = webEnv;

const UserChannels = ({ params }: { params: { userAddress: string } }) => {
	const router = useRouter();

	const userAddress = params.userAddress;

	const [channels, setChannels] = useState([]);
	const [copiedChannel, setCopiedChannel] = useState('');

	const copyToClipboard = (url: string, channel: string) => {
		navigator.clipboard.writeText(url);
		setCopiedChannel(channel);
		setTimeout(() => setCopiedChannel(''), 2000);
	};

	useEffect(() => {
		fetch(`${env.api.apiUrl}/channels/${userAddress}`)
			.then((response) => response.json())
			.then((data) => setChannels(data.channels))
			.catch((error) => console.error('Error:', error));
	}, [copiedChannel]);

	return (
		<div className="bg-primary flex flex-col items-center justify-center space-y-8 px-4 py-10 pt-20 sm:px-0">
			{channels.map((channel: any, index) => (
				<div
					key={index}
					className="bg-secondary flex w-full max-w-md items-center space-y-2 rounded-lg p-6 shadow-md"
				>
					<img
						src={channel.image}
						alt={channel.title}
						className="mr-4 h-auto w-1/3 cursor-pointer rounded"
						onClick={() => router.push(`/channel/${channel.address}/details`)}
					/>
					<div className="flex flex-col items-start justify-start">
						<Link
							href={`/channel/${channel.address}/details`}
							className="text-primaryText mb-4 text-3xl font-bold"
						>
							{channel.title}
						</Link>
						<div className="mb-2 text-sm font-bold">
							Author:
							<a
								href={`${env.basescan.url}/address/${channel.owner}`}
								className="text-primary bg-secondary rounded px-2 py-1"
							>
								{channel.owner.slice(0, 4)}....{channel.owner.slice(-4)}
							</a>
						</div>
						<div className="flex items-start space-x-2 text-sm">
							<a
								href={`${env.api.apiUrl}/channelFeed/${channel.address}`}
								className="text-primary bg-secondary rounded py-1"
								onClick={(e) => {
									e.preventDefault();
									copyToClipboard(
										`${env.api.apiUrl}/channelFeed/${channel.address}`,
										channel.address
									);
								}}
								target="_blank"
								rel="noopener noreferrer"
							>
								{copiedChannel === channel.address ? '✅ Copied ✅' : '🔗 RSS'}
							</a>
							<a
								href={`${env.basescan.url}/address/${channel.address}`}
								className="text-primary bg-secondary rounded px-2 py-1"
								target="_blank"
								rel="noopener noreferrer"
							>
								📄 Contract
							</a>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default UserChannels;
