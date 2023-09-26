import CreatePost from './create-post';

export default function App({ params }: { params: { channelAddress: string } }) {
	return <CreatePost params={params} />;
}
