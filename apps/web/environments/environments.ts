const isProd = process.env.NEXT_PUBLIC_ENV === 'production';

export const webEnv: IWebEnv = {
	api: {
		apiUrl: isProd
			? (process.env.NEXT_PUBLIC_API_URL_PROD as string)
			: (process.env.NEXT_PUBLIC_API_URL as string),
		domain: isProd
			? (process.env.NEXT_PUBLIC_DOMAIN_PROD as string)
			: (process.env.NEXT_PUBLIC_DOMAIN as string)
	},
	basescan: {
		url: isProd
			? (process.env.NEXT_PUBLIC_BASESCAN_PROD as string)
			: (process.env.NEXT_PUBLIC_BASESCAN as string)
	},
	chain: {
		id: isProd
			? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID_PROD as string)
			: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID_DEV as string)
	}
};

export interface IWebEnv {
	api: {
		apiUrl: string;
		domain: string;
	};
	basescan: {
		url: string;
	};
	chain: {
		id: number;
	};
}
