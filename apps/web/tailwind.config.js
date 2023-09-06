const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('node:path');

module.exports = {
	content: [
		join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
		...createGlobPatternsForDependencies(__dirname)
	],
	theme: {
		extend: {
			backgroundColor: {
				primary: '#476A6F',
				secondary: '#519E8A',
				primaryText: '#F7EFDE'
			},
			textColor: {
				primary: '#476A6F',
				secondary: '#519E8A',
				primaryText: '#F7EFDE'
			},
			borderColor: {
				primary: '#476A6F',
				secondary: '#519E8A',
				primaryText: '#F7EFDE'
			}
		}
	},
	plugins: []
};
