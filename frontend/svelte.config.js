// import adapter from '@sveltejs/adapter-auto'
import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
// import topLevelAwait from 'vite-plugin-top-level-await'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter()
	},

	vite: {
		// plugins: [
		// 	topLevelAwait.default({
		// 		promiseExportName: "__tla",
		// 		promiseImportName: i => `__tla_${i}`
		// 	})
		// ],
		// build: {
		// 	target: 'esnext'
		// }
	}
};

export default config;
