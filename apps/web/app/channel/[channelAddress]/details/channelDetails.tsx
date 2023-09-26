'use client';

import React, { useEffect, useState } from 'react';
import { webEnv } from '../../../../environments/environments';

const env = webEnv;

const ChannelDetails = ({ params }: { params: { channelAddress: string } }) => {
	const channelAddress = params.channelAddress;
	const [channelDetails, setChannelDetails] = useState(null);

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

	const { channel: channelData, posts } = channelDetails;

	return (
		<div className="bg-primary flex flex-col items-center justify-center px-4 py-10 pt-20 sm:px-0">
			<div className="bg-secondary w-full max-w-md space-y-2 rounded-lg p-6 shadow-md">
				<h1 className="text-primaryText mb-4 text-center text-2xl font-bold">
					{(channelData as any).title}
				</h1>
				<p className="text-primaryText">
					<span className="font-bold">Owner: </span>
					<span className="font-normal">
						{(channelData as any).owner.substring(0, 4)}...
						{(channelData as any).owner.slice(-4)}
					</span>
				</p>
				<p className="text-primaryText">
					<span className="font-bold">Symbol: </span>
					<span className="font-normal">{(channelData as any).symbol}</span>
				</p>
				<p className="text-primaryText">
					<span className="font-bold">Description: </span>
					<span className="font-normal">{(channelData as any).description}</span>
				</p>
				<h2 className="text-primaryText mb-2 text-center text-2xl font-bold">Posts</h2>
				<ul className="space-y-2">
					{(posts as any).map((post: any, index: any) => (
						<li key={index} className="bg-primary mb-4 rounded-lg p-4 shadow-md">
							<h3 className="text-primaryText mb-2 text-lg font-bold">
								<span className="font-bold">{post.title}</span>
							</h3>
							<p className="mb-2">
								<span className="font-bold">Description: </span>
								<span className="font-normal">{post.description}</span>
							</p>
							<p className="mb-2">
								<span className="font-bold">Author: </span>
								<span className="font-normal">{post.author}</span>
							</p>
						</li>
					))}
				</ul>
				<button
					onClick={() =>
						(window.location.href = `/channel/${channelAddress}/create-post`)
					}
					className="bg-primaryText text-primary mx-auto mt-8 w-full rounded px-2 py-1 text-center"
				>
					🔥 Add Post 🔥
				</button>
			</div>
		</div>
	);
};

export default ChannelDetails;
