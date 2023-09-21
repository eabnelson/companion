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
		return <div>Loading...</div>;
	}

	const { channel: channelData, posts } = channelDetails;

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-primaryText mb-4 text-2xl font-bold">
				Channel: {(channelData as any).title}
			</h1>
			<p>Owner: {(channelData as any).owner}</p>
			<p>Symbol: {(channelData as any).symbol}</p>
			<p>Description: {(channelData as any).description}</p>{' '}
			<h2 className="text-primaryText mb-2 text-lg font-bold">Posts:</h2>
			<ul className="space-y-2">
				{(posts as any).map((post: any, index: any) => (
					<li key={index} className="text-primaryText">
						<h3>Title: {post.title}</h3>
						<p>Description: {post.description}</p>
						<p>Author: {post.author}</p>
					</li>
				))}
			</ul>
			<button
				onClick={() => (window.location.href = `/channel/${channelAddress}/create-post`)}
				className="bg-primaryText text-primary hover:bg-secondary rounded px-2 py-1"
			>
				🚀 Create Post 🚀
			</button>
		</div>
	);
};

export default ChannelDetails;
