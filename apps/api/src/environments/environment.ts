import process from 'process';

const isProd = process.env.ENV === 'production';

export const apiEnv: IApiEnv = {
	api: {
		isProd: isProd,
		port: isProd ? Number(process.env.PORT) : Number(process.env.API_PORT),
		host: isProd ? process.env.API_HOST_PROD : process.env.API_HOST,
		appUri: isProd ? process.env.APP_URL_PROD : process.env.APP_URL,
		apiUri: isProd ? process.env.API_URL_PROD : process.env.API_URL,
		domain: isProd ? process.env.DOMAIN_PROD : process.env.DOMAIN_DEV
	}
};

export interface IApiEnv {
	api: {
		isProd: boolean;
		port: number;
		host: string;
		appUri: string;
		apiUri: string;
		domain: string;
	};
}
