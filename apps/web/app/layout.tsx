import { ReactNode } from 'react';
import '../styles/global.css';
import { Lato } from 'next/font/google';
import Link from 'next/link';
import MagicRainbow from './rainbow/providers';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
				<nav className="bg-secondary sticky top-0 z-10 flex h-16 w-full items-center justify-between pl-6 pr-6 md:h-24 md:pl-14 md:pr-14 lg:h-28">
					<div className="ml-auto flex gap-10">
						<Link
							href="/"
							className="hover:text-primaryText text-primary text-lg font-bold uppercase"
						>
							create channels
						</Link>
					</div>
					<div className="ml-auto flex gap-10">
						<Link
							href="/channel/list"
							className="hover:text-primaryText text-primary text-lg font-bold uppercase"
						>
							view channels
						</Link>
					</div>
					<div className="ml-auto flex gap-10">
						<MagicRainbow>
							<ConnectButton />
						</MagicRainbow>
					</div>
				</nav>

				<div className="w-full max-w-screen-2xl pl-6 pr-6 md:pl-14 md:pr-14">
					<div className="text-secondary">{children}</div>
				</div>
			</body>
		</html>
	);
}
