import { ref, watch, type Ref } from 'vue';
import { debounce, toXml } from '../utils';

export function useXml<T extends Record<string, any>>(source: Ref<T[] | null>) {
	const xml = ref('');
	const updateXml = debounce((data: T[]) => {
		xml.value = toXml(data);
	}, 1000);

	watch(
		source,
		newVal => {
			updateXml(newVal ?? []);
		},
		{ immediate: true, deep: true }
	);

	return xml;
}
