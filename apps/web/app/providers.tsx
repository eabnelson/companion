'use client';

import React from 'react';
import {
	RainbowKitProvider,
	connectorsForWallets,
	getDefaultWallets,
	darkTheme
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { optimismGoerli, optimism, base, baseGoerli } from '@wagmi/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { rainbowMagicConnector } from '../lib/RainbowMagicConnector';

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[optimism, optimismGoerli, base, baseGoerli],
	[publicProvider()]
);

const connectors = connectorsForWallets([
	{
		groupName: 'Recommended',
		wallets: [rainbowMagicConnector({ chains })]
	},
	...getDefaultWallets({
		chains,
		appName: 'companion',
		projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string
	}).wallets
]);

const config = createConfig({
	autoConnect: false,
	connectors,
	publicClient,
	webSocketPublicClient
});

export default function MagicRainbow({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);

	return (
		<WagmiConfig config={config}>
			<RainbowKitProvider
				theme={darkTheme({
					accentColor: '#476A6F',
					accentColorForeground: '#519E8A',
					borderRadius: 'large',
					fontStack: 'system',
					overlayBlur: 'small'
				})}
				chains={chains}
				modalSize="compact"
			>
				{mounted && children}
			</RainbowKitProvider>
		</WagmiConfig>
	);
}
