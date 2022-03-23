import type { Writable } from 'svelte/store'
import { writable, get } from 'svelte/store'

export const localStorageWritable = <T>(localStorageKey: string, value: T): Writable<T> => {
	const json = globalThis.localStorage?.getItem(localStorageKey)

	const store = writable(json ? JSON.parse(json) : value)

	const set = (value) => {
		if(!globalThis.localStorage) return

		if(value === undefined)
			globalThis.localStorage?.removeItem(localStorageKey)
		else
			globalThis.localStorage?.setItem(localStorageKey, JSON.stringify(value))
		store.set(value)
	}

	const update = (callback) => {
		const value = callback(get(store))
		set(value)
	}

	return { set, update, subscribe: store.subscribe }
}
