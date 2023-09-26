import { ReactNode } from 'react';
import '../styles/global.css';
import { Lato } from 'next/font/google';
import Link from 'next/link';
import MagicRainbow from './rainbow/providers';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from './navigation/navbar';

const lato = Lato({
	weight: ['400', '700'],
	display: 'swap',
	style: 'normal',
	subsets: ['latin']
});

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={`${lato.className} bg-primary text-primaryText`}>
			<body className="flex min-h-screen flex-col items-center">
				<MagicRainbow>
					<Navbar />
				</MagicRainbow>

				<div className="w-full max-w-screen-2xl pl-6 pr-6 pt-20 md:pl-14 md:pr-14">
					<div className="text-secondary">{children}</div>
				</div>
			</body>
		</html>
	);
}
