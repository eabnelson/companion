import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { apiEnv } from '../environments/environment';

const { api } = apiEnv;

@Controller()
export class AppController {
	constructor() {}

	@Get('channels')
	async getEpisodeContent(@Req() request: Request, @Res() res: Response) {}
}
