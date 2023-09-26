'use client';

import ChannelDetails from './channelDetails';

export default function App({ params }: { params: { channelAddress: string } }) {
	return <ChannelDetails params={params} />;
}
