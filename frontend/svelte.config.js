// import adapter from '@sveltejs/adapter-auto'
import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
import topLevelAwait_ from 'vite-plugin-top-level-await'

const topLevelAwait = topLevelAwait_.default
console.log('topLevelAwait', topLevelAwait)
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter()
	},

	vite: {
		plugins: [
			topLevelAwait()
		]
		// build: {
		// 	target: 'esnext'
		// }
	}
};

export default config;
