'use client';

import MagicRainbow from '../../../rainbow/providers';
import ChannelDetails from './channelDetails';

export default function App({ params }: { params: { channelAddress: string } }) {
	return (
		<MagicRainbow>
			<ChannelDetails params={params} />
		</MagicRainbow>
	);
}
