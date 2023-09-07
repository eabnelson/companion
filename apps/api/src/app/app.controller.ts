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
			const processedDetails = convertBigIntPropsToString(channelDetails);
			return res.json({ processedDetails });
		} catch (error) {
			return res
				.status(500)
				.json({ message: 'Failed to get channel details', error: error.message });
		}
	}
}

function convertBigIntPropsToString(obj: any): any {
	const newObj = {};
	for (const key in obj) {
		if (typeof obj[key] === 'bigint') {
			newObj[key] = obj[key].toString();
		} else if (typeof obj[key] === 'object' && obj[key] !== null) {
			newObj[key] = convertBigIntPropsToString(obj[key]);
		} else {
			newObj[key] = obj[key];
		}
	}
	return newObj;
}
