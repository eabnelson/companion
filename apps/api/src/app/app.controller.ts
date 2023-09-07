import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { apiEnv } from '../environments/environment';
import { JsonRpcProvider, ethers } from 'ethers';

const Channel = require('../abi/Channel.json');
const ChannelFactory = require('../abi/ChannelFactory.json');

const { api } = apiEnv;

@Controller()
export class AppController {
	private provider: ethers.JsonRpcProvider;
	private channel: ethers.Contract;
	private channelFactory: ethers.Contract;

	constructor() {
		this.provider = new JsonRpcProvider(api.rpc);

		console.log('ChannelFactory.address:', ChannelFactory.address);

		this.channel = new ethers.Contract(Channel.address, Channel.abi, this.provider);
		this.channelFactory = new ethers.Contract(
			ChannelFactory.address,
			ChannelFactory.abi,
			this.provider
		);
	}

	// Get list of all channels from the ChannelFactory
	@Get('channels')
	async getEpisodeContent(@Req() request: Request, @Res() res: Response) {
		try {
			const channels = await this.channelFactory.getChannels();
			return res.json({ channels });
		} catch (error) {
			return res
				.status(500)
				.json({ message: 'Failed to get channels', error: error.message });
		}
	}

	// Get details and posts from a given channel
	@Get('channeldetails')
	async getChannelFeed(@Req() request: Request, @Res() res: Response) {
		try {
			const channelDetails = await this.channel.queryChannel();

			const [owner, title, symbol, description] = channelDetails[0];

			// Create a structured Channel object
			const channelData = {
				owner,
				title,
				symbol,
				description
			};

			// Create a structured Post array and filter out the deleted posts
			const posts = channelDetails[1]
				.map((item) => {
					const [id, author, authorName, title, link, description, content, deleted] =
						item;
					return {
						id: id.toString(), // Convert the postId from BigInt to string
						author,
						authorName,
						title,
						link,
						description,
						content,
						deleted
					};
				})
				.filter((post) => !post.deleted); // Filter out the posts where deleted is true

			return res.json({ channel: channelData, posts: posts });
		} catch (error) {
			return res
				.status(500)
				.json({ message: 'Failed to get channel details', error: error.message });
		}
	}
}
