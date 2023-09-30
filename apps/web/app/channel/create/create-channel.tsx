'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { webEnv } from '../../../environments/environments';
import ChannelFactory from '../../../../../abi/ChannelFactory.json';

const CreateChannel = () => {
	const router = useRouter();
	const { address } = useAccount();

	const [title, setTitle] = useState('');
	const [link, setLink] = useState('');
	const [language, setLanguage] = useState('');
	const [description, setDescription] = useState('');
	const [copyright, setCopyright] = useState('');
	const [imageUrl, setImageUrl] = useState('');

	const { data, write } = useContractWrite({
		address: ChannelFactory.address as `0x${string}`,
		abi: ChannelFactory.abi,
		functionName: 'createChannel',
		chainId: webEnv.chain.id
	});

	const { isLoading } = useWaitForTransaction({
		hash: data?.hash,
		onSettled(data, error) {
			if (data) {
				router.push('/channel/list');
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
					owner: address as `0x${string}`,
					title: title,
					link: link,
					language: language,
					description: description,
					copyright: copyright,
					imageUrl: imageUrl,
					deleted: false
				}
			]
		});
	};

	return (
		<div className="bg-primary flex flex-col items-center justify-center px-4 py-10 pt-20 sm:px-0">
			<div className="bg-secondary w-full max-w-md space-y-2 rounded-lg p-6 shadow-md">
				<h1 className="text-primaryText mb-4 text-center text-2xl font-bold">
					Create New Channel
				</h1>

				<form onSubmit={handleSubmit}>
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
							type="text"
							className="bg-primary text-primaryText w-full rounded border p-2"
							value={link}
							onChange={(e) => setLink(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<label
							className="text-primaryText mb-2 block text-sm font-medium"
							htmlFor="language"
						>
							Language
						</label>
						<input
							id="language"
							type="text"
							className="bg-primary text-primaryText w-full rounded border p-2"
							value={language}
							onChange={(e) => setLanguage(e.target.value)}
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
							htmlFor="copyright"
						>
							Copyright
						</label>
						<input
							id="copyright"
							type="text"
							className="bg-primary text-primaryText w-full rounded border p-2"
							value={copyright}
							onChange={(e) => setCopyright(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<label
							className="text-primaryText mb-2 block text-sm font-medium"
							htmlFor="imageUrl"
						>
							Image URL
						</label>
						<input
							id="imageUrl"
							type="text"
							className="bg-primary text-primaryText w-full rounded border p-2"
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
						/>
					</div>

					<button
						type="submit"
						className="bg-primary text-primaryText hover:bg-dim-gray w-full rounded p-2"
						disabled={!write || isLoading}
					>
						{isLoading ? `creating channel ...` : `🔮 Create Channel 🔮`}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateChannel;
