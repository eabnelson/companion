import UserChannels from './userChannels';

export default function App({ params }: { params: { userAddress: string } }) {
	return <UserChannels params={params} />;
}
