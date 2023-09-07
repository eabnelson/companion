import { Controller, Get, Res, Req, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { apiEnv } from '../environments/environment';
import { JsonRpcProvider, ethers } from 'ethers';

const Channel = require('../abi/Channel.json');
const ChannelFactory = require('../abi/ChannelFactory.json');

const { api } = apiEnv;

@Controller()
export class AppController {
	private provider: ethers.JsonRpcProvider;
	private channelFactory: ethers.Contract;

	constructor() {
		this.provider = new JsonRpcProvider(api.rpc);

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
	@Get('channel/:channelAddress')
	async getChannelFeed(@Param('channelAddress') channelAddress: string, @Res() res: Response) {
		try {
			const channel = new ethers.Contract(channelAddress, Channel.abi, this.provider);

			const channelDetails = await channel.queryChannel();

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
