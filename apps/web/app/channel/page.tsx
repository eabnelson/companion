'use client';

import { useState } from 'react';

const CreateChannel = () => {
	const [title, setTitle] = useState('');
	const [link, setLink] = useState('');
	const [description, setDescription] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		console.log({
			title,
			link,
			description
		});

		// Handling logic after submission...
	};

	return (
		<div className="bg-primary flex h-screen items-center justify-center">
			<div className="bg-secondary w-full max-w-md rounded-lg p-6 shadow-md">
				<h1 className="text-primaryText mb-4 text-2xl font-bold">Create Channel</h1>

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

					<button
						type="submit"
						className="bg-primaryText text-secondary hover:bg-dim-gray w-full rounded p-2"
					>
						Create Channel
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateChannel;
