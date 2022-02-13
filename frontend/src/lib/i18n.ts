import { register, init, getLocaleFromNavigator } from 'svelte-i18n'

register('en-US', () => import('../strings/en.json'))

init({
	fallbackLocale: 'en-US',
	initialLocale: getLocaleFromNavigator(),
})
