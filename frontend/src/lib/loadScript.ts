const cache = {}

export const loadScript = (url)=>
	cache[url] = cache[url] || new Promise((resolve, reject) => {
		globalThis.document.head.appendChild(Object.assign(globalThis.document.createElement('script'), {
			type: 'text/javascript',
			src: url,
			onload: resolve,
			onreadystatechange: resolve,
			onerror: reject
		}))
	})
