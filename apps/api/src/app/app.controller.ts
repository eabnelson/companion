import { Controller, Get, Res, Req, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { apiEnv } from '../environments/environment';
import { JsonRpcProvider, ethers } from 'ethers';
import * as xmlJs from 'xml-js';

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

	// Get RSS feed for a channel
	@Get('channelFeed/:channelAddress')
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

			const posts = channelDetails[1]
				.map((item) => {
					const [id, author, authorName, title, link, description, content, deleted] =
						item;
					return (
						!deleted && {
							title: title,
							link: link,
							description: description,
							content: content,
							author: authorName,
							authorAddress: author
						}
					);
				})
				.filter(Boolean); // Filter out deleted posts or mapping returned falsy

			const xmlObj = {
				rss: {
					_attributes: {
						'xmlns:atom': 'http://www.w3.org/2005/Atom',
						'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
						version: '2.0'
					},
					channel: {
						ownerAddress: owner,
						title: title,
						symbol: symbol,
						description: description,
						item: posts
					}
				}
			};

			const xml = xmlJs.js2xml(xmlObj, { compact: true, spaces: 4 });

			res.set('Content-Type', 'application/xml');
			return res.send(xml);
		} catch (error) {
			return res
				.status(500)
				.json({ message: 'Failed to get channel details', error: error.message });
		}
	}

	// Get channel details in JSON format
	@Get('channelDetails/:channelAddress')
	async getChannelDetails(@Param('channelAddress') channelAddress: string, @Res() res: Response) {
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
					return (
						!deleted && {
							title,
							link,
							description,
							content,
							author: authorName,
							authorAddress: author
						}
					);
				})
				.filter(Boolean); // Filter out deleted posts or mapping returned falsy

			return res.json({ channel: channelData, posts: posts });
		} catch (error) {
			return res
				.status(500)
				.json({ message: 'Failed to get channel details', error: error.message });
		}
	}
}
