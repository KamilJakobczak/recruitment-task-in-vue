import { reactive } from 'vue';

export function useGroupToggle() {
	const hidden = reactive(new Set<string>());

	function toggle(key: string) {
		hidden.has(key) ? hidden.delete(key) : hidden.add(key);
	}

	return { hidden, toggle };
}
