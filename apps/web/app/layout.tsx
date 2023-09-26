import { ReactNode } from 'react';
import '../styles/global.css';
import { Lato } from 'next/font/google';
import Navbar from './navigation/navbar';
import Providers from './providers';

const lato = Lato({
	weight: ['400', '700'],
	display: 'swap',
	style: 'normal',
	subsets: ['latin']
});

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={`${lato.className} bg-primary text-primaryText`}>
			<body>
				<Providers>
					<Navbar />
					{children}
				</Providers>
			</body>
		</html>
	);
}
