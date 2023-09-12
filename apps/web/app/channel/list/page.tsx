'use client';

import React, { useEffect, useState } from 'react';

const ChannelList = () => {
	const [channels, setChannels] = useState([]);

	useEffect(() => {
		fetch('/channels')
			.then((response) => response.json())
			.then((data) => setChannels(data.channels))
			.catch((error) => console.error('Error:', error));
	}, []);

	return (
		<div>
			{channels.map((channel, index) => (
				<div key={index}>{/* Render your channel data here... */}</div>
			))}
		</div>
	);
};

export default ChannelList;
