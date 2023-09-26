'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Navbar() {
	const { address } = useAccount();

	return (
		<nav className="bg-secondary min-h-20 md:min-h-28 lg:min-h-32 fixed left-0 right-0 top-0 z-10 mb-4 flex items-center justify-between pl-6 pr-6 md:pl-14 md:pr-14">
			<div className="ml-auto flex gap-2 md:gap-10">
				<Link
					href="/"
					className="hover:text-primaryText text-primary text-sm font-bold uppercase md:text-lg"
				>
					create channels
				</Link>
			</div>
			<div className="ml-auto flex gap-2 md:gap-10">
				<Link
					href="/channel/list"
					className="hover:text-primaryText text-primary text-sm font-bold uppercase md:text-lg"
				>
					view channels
				</Link>
			</div>
			{address ? (
				<div className="ml-auto flex gap-2 md:gap-10">
					<Link
						href={`/${address}`}
						className="hover:text-primaryText text-primary text-sm font-bold uppercase md:text-lg"
					>
						your channels
					</Link>
				</div>
			) : null}
			<div className="ml-auto flex gap-2 md:gap-10">
				<ConnectButton />
			</div>
		</nav>
	);
}
