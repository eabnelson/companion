import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { apiEnv } from '../environments/environment';

const { api } = apiEnv;

@Controller()
export class AppController {
	constructor() {}

	// ChannelFactory getChannels to get list of channel addresses
	// ChannelFactory address: 0x0118d7720B92A29F6653572bd95555c07CAed4CA
	// Channel address: 0x82E6075D7cd3555264b26b1a11a41B0625Bf7Bc7
	@Get('channels')
	async getEpisodeContent(@Req() request: Request, @Res() res: Response) {}
}
