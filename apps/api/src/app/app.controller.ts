import { Controller, Get, Res, Req, Param, Post, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { apiEnv } from '../environments/environment';
import { JsonRpcProvider, ethers } from 'ethers';
import * as xmlJs from 'xml-js';

const Channel = require('../../../../abi/Channel.json');
const ChannelFactory = require('../../../../abi/ChannelFactory.json');

const { api } = apiEnv;

const escapeXmlSpecialChars = (str: string) => {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
};

@Controller()
export class AppController {
	private provider: ethers.JsonRpcProvider;
	private channelFactory: ethers.Contract;

	readonly defaultRssAttributes = {
		'xmlns:atom': 'http://www.w3.org/2005/Atom',
		'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
		'xmlns:media': 'http://search.yahoo.com/mrss/',
		version: '2.0'
	};

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
	async getChannels(@Req() request: Request, @Res() res: Response) {
		try {
			const channels = (await this.channelFactory.getChannels()).map((channel) => {
				return {
					address: channel.channelAddress,
					title: channel.title,
					image: channel.imageUrl,
					owner: channel.owner,
					deleted: channel.deleted
				};
			});
			return res.json({ channels });
		} catch (error) {
			return res
				.status(500)
				.json({ message: 'Failed to get channels', error: error.message });
		}
	}

	// Get list of all channels for a user
	@Get('channels/:userAddress')
	async getUserChannels(@Req() request: Request, @Res() res: Response) {
		try {
			const userAddress = request.params.userAddress;
			const channels = (await this.channelFactory.getChannelsByOwner(userAddress)).map(
				(channel) => {
					return {
						address: channel.channelAddress,
						title: channel.title,
						image: channel.imageUrl,
						owner: channel.owner,
						deleted: channel.deleted
					};
				}
			);
			return res.json({ channels });
		} catch (error) {
			return res
				.status(500)
				.json({ message: 'Failed to get channels for user', error: error.message });
		}
	}

	// Get RSS feed for a channel
	@Get('channelFeed/:channelAddress')
	async getChannelFeed(@Param('channelAddress') channelAddress: string, @Res() res: Response) {
		try {
			const channel = new ethers.Contract(channelAddress, Channel.abi, this.provider);

			const channelDetails = await channel.queryChannel();

			const [owner, title, link, language, description, copyright, imageUrl, deleted] =
				channelDetails[0];

			const posts = channelDetails[1]
				.map((item) => {
					const [
						,
						author,
						guid,
						title,
						pubDate,
						authorName,
						description,
						content,
						deleted
					] = item;

					if (deleted) {
						return null;
					}

					return {
						authorAddress: author,
						guid: {
							_attributes: {
								isPermaLink: 'false'
							},
							_text: guid
						},
						title: title,
						pubDate: pubDate,
						author: authorName,
						description: description,
						'content:encoded': {
							_cdata: description
						},
						enclosure: {
							_attributes: {
								length: '0',
								type: 'audio/mpeg',
								url: escapeXmlSpecialChars(content)
							}
						}
					};
				})
				.filter(Boolean); // Filter out deleted posts or mapping returned falsy

			const xmlObj = {
				rss: {
					_attributes: this.defaultRssAttributes,
					channel: {
						ownerAddress: owner,
						title: title,
						language: language,
						link: link,
						description: description,
						image: {
							url: {
								_text: imageUrl
							},
							title: {
								_text: title
							},
							link: {
								_text: link
							}
						},
						copyright: copyright,
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

			const [owner, title, link, , description, , imageUrl] = channelDetails[0];

			// Create a structured Channel object
			const channelData = {
				owner,
				title,
				link,
				description,
				imageUrl
			};

			// Create a structured Post array and filter out the deleted posts
			const posts = channelDetails[1]
				.map((item) => {
					const [, author, , title, pubDate, authorName, description, content, deleted] =
						item;
					return (
						!deleted && {
							title,
							link,
							description,
							pubDate,
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
