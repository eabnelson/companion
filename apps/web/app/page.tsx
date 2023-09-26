'use client';

import CreateChannel from './channel/create/page';
import MagicRainbow from './rainbow/providers';

export default function Page() {
	return (
		<div>
			<MagicRainbow>
				<CreateChannel />
			</MagicRainbow>
		</div>
	);
}
