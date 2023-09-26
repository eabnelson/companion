'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { webEnv } from '../../../../environments/environments';
import Channel from '../../../../../../abi/Channel.json';

const CreatePost = ({ params }: { params: { channelAddress: string } }) => {
	const channelAddress = params.channelAddress;
	const router = useRouter();
	const { address } = useAccount();

	const [author, setAuthor] = useState('');
	const [title, setTitle] = useState('');
	const [link, setLink] = useState('');
	const [description, setDescription] = useState('');
	const [content, setContent] = useState('');

	const { data, write } = useContractWrite({
		address: channelAddress as `0x${string}`,
		abi: Channel.abi,
		functionName: 'createPost',
		chainId: webEnv.chain.id
	});

	const { isLoading } = useWaitForTransaction({
		hash: data?.hash,
		onSettled(data, error) {
			if (data) {
				router.push(`/channel/${channelAddress}/details`);
			} else if (error) {
				console.log(error);
			}
		}
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		write?.({
			args: [
				{
					id: 0,
					author: address,
					authorName: author,
					title: title,
					link: link,
					description: description,
					content: content,
					deleted: false
				}
			]
		});
	};

	return (
		<div className="bg-primary flex flex-col items-center justify-center px-4 py-10 pt-20 sm:px-0">
			<div className="bg-secondary w-full max-w-md rounded-lg p-6 shadow-md">
				<h1 className="text-primaryText mb-4 text-center text-2xl font-bold">
					Create Post
				</h1>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							className="text-primaryText mb-2 block text-sm font-medium"
							htmlFor="author"
						>
							Author
						</label>
						<input
							id="author"
							type="text"
							className="bg-primary text-primaryText w-full rounded border p-2"
							value={author}
							onChange={(e) => setAuthor(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<label
							className="text-primaryText mb-2 block text-sm font-medium"
							htmlFor="title"
						>
							Title
						</label>
						<input
							id="title"
							type="text"
							className="bg-primary text-primaryText w-full rounded border p-2"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<label
							className="text-primaryText mb-2 block text-sm font-medium"
							htmlFor="link"
						>
							Link
						</label>
						<input
							id="link"
							type="url"
							className="bg-primary text-primaryText w-full rounded border p-2"
							value={link}
							onChange={(e) => setLink(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<label
							className="text-primaryText mb-2 block text-sm font-medium"
							htmlFor="description"
						>
							Description
						</label>
						<textarea
							id="description"
							className="bg-primary text-primaryText w-full rounded border p-2"
							rows={4}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<label
							className="text-primaryText mb-2 block text-sm font-medium"
							htmlFor="content"
						>
							Content
						</label>
						<textarea
							id="content"
							className="bg-primary text-primaryText w-full rounded border p-2"
							rows={4}
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
					</div>

					<button
						type="submit"
						className="bg-primary text-primaryText hover:bg-dim-gray w-full rounded p-2"
						disabled={!write || isLoading}
					>
						{isLoading ? `creating post ...` : `🚀 Create Post 🚀`}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreatePost;
