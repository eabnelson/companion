'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { webEnv } from '../../../../environments/environments';

const env = webEnv;

const ChannelDetails = ({ params }: { params: { channelAddress: string } }) => {
	const router = useRouter();
	const { address } = useAccount();

	const channelAddress = params.channelAddress;
	const [channelDetails, setChannelDetails] = useState(null);
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
	const [copySuccess, setCopySuccess] = useState('');

	const copyToClipboard = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			await navigator.clipboard.writeText(`${env.api.apiUrl}/channelFeed/${channelAddress}`);
			setCopySuccess('✅ Copied ✅');
		} catch (err) {
			setCopySuccess('Failed to copy text');
		}

		setTimeout(() => setCopySuccess(''), 2000);
	};

	useEffect(() => {
		if (channelAddress) {
			fetch(`${env.api.apiUrl}/channelDetails/${channelAddress}`)
				.then((response) => response.json())
				.then((data) => setChannelDetails(data))
				.catch((error) => console.error('Error:', error));
		}
	}, [channelAddress]);

	if (!channelDetails) {
		return <div className="flex h-screen items-center justify-center">loading...</div>;
	}

	const { channel: channelData, posts } = channelDetails as any;

	return (
		<div className="bg-primary flex flex-col items-center justify-center px-4 py-10 pt-20 sm:px-0">
			<div className="bg-secondary w-full max-w-md space-y-2 rounded-lg p-6 shadow-md">
				<div className="bg-secondary flex w-full max-w-md items-center space-y-2 rounded-lg p-6 shadow-md">
					<img
						src={channelData.imageUrl}
						alt={channelData.title}
						className="mr-4 h-auto w-1/3 cursor-pointer rounded"
					/>
					<div className="flex flex-col items-start justify-start">
						<div className="text-primaryText mb-4 text-3xl font-bold">
							{channelData.title.length > 40
								? `${channelData.title.substring(0, 40)}...`
								: channelData.title}
						</div>
						<div className="mb-2 text-sm font-bold">
							Author:
							<a
								href={`${env.basescan.url}/address/${channelData.owner}`}
								className="text-primary bg-secondary rounded px-2 py-1"
							>
								{channelData.owner.slice(0, 4)}....{channelData.owner.slice(-4)}
							</a>
						</div>
						<div className="flex items-start space-x-2 text-sm">
							<a
								href={`${env.api.apiUrl}/channelFeed/${channelAddress}`}
								className="text-primary bg-secondary rounded py-1"
								onClick={copyToClipboard}
								target="_blank"
								rel="noopener noreferrer"
							>
								{copySuccess ? copySuccess : '🔗 RSS'}
							</a>

							<a
								href={`${env.basescan.url}/address/${channelData.address}`}
								className="text-primary bg-secondary rounded px-2 py-1"
								target="_blank"
								rel="noopener noreferrer"
							>
								📄 Contract
							</a>
						</div>
					</div>
				</div>
				<h2 className="text-primary mb-2 py-3 text-center text-2xl font-bold">Episodes</h2>
				<ul className="space-y-4">
					{(posts as any).map((post: any, index: any) => (
						<li key={index} className="bg-primary mb-4 rounded-lg p-4 shadow-md">
							<h3 className="text-primaryText mb-2 text-xl font-bold">
								<span className="font-bold">{post.title}</span>
							</h3>
							<p className="mb-2">
								<span className="font-normal">
									{isDescriptionExpanded
										? post.description
										: `${post.description.substring(0, 157)}...`}
								</span>
								{post.description.length > 4 && (
									<a
										href="#"
										style={{ marginLeft: '10px' }} // Add space before the link
										className="text-secondary"
										onClick={(e) => {
											e.preventDefault();
											setIsDescriptionExpanded(!isDescriptionExpanded);
										}}
									>
										{isDescriptionExpanded ? 'see less' : 'see more'}
									</a>
								)}
							</p>
							<div className="mb-2">
								<div className="flex justify-between">
									<span className="font-normal">{post.author}</span>
									<a
										href={`${env.basescan.url}/address/${post.authorAddress}`}
										className="text-secondary font-normal"
										target="_blank"
										rel="noopener noreferrer"
									>
										{post.authorAddress.slice(0, 4)}....
										{post.authorAddress.slice(-4)}
									</a>
								</div>
							</div>
						</li>
					))}
					{address && address === channelData.owner && (
						<li>
							<button
								onClick={() =>
									router.push(`/channel/${channelAddress}/create-post`)
								}
								className="bg-primary text-primaryText mx-auto w-full rounded px-2 py-1 text-center"
							>
								↗️ new episode ↗️
							</button>
						</li>
					)}
				</ul>
			</div>
		</div>
	);
};

export default ChannelDetails;
