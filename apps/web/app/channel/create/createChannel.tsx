'use client';

import { useEffect, useState } from 'react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { webEnv } from '../../../environments/environments';
import ChannelFactory from '../../../../../abi/ChannelFactory.json';

const env = webEnv;

const CreateChannel = () => {
	const { address } = useAccount();

	const [title, setTitle] = useState('');
	const [symbol, setSymbol] = useState('');
	const [description, setDescription] = useState('');

	const newFormData = {
		owner: address as `0x${string}`,
		title: title,
		symbol: symbol,
		description: description
	};

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
				window.location.href = `/channel/list`;
			} else if (error) {
				console.log(error);
			}
		}
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		write?.({
			args: [newFormData]
		});
	};

	return (
		<div className="bg-primary flex flex-col items-center justify-center px-4 py-10 sm:px-0">
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
							htmlFor="symbol"
						>
							Symbol
						</label>
						<input
							id="symbol"
							type="text"
							className="bg-primary text-primaryText w-full rounded border p-2"
							value={symbol}
							onChange={(e) => setSymbol(e.target.value)}
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
					<button
						type="submit"
						className="bg-primaryText text-secondary hover:bg-dim-gray w-full rounded p-2"
						disabled={!write || isLoading}
					>
						{isLoading ? `🚀 Creating Channel 🚀` : `🔮 Create Channel 🔮`}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateChannel;
