import { type Data } from '../App.vue';
export function getFlexStyle(key: keyof Data): Record<string, string> {
	switch (key) {
		case 'account':
			return { flex: '1', minWidth: '100px' };
		case 'date':
			return { flex: '1', minWidth: '120px' };
		case 'amount':
			return { flex: '1', minWidth: '100px' };
		case 'currency':
			return { flex: '1', minWidth: '80px' };
		case 'title':
			return { flex: '1', minWidth: '250px' };
		case 'category':
			return { flex: '1', minWidth: '140px' };
		default:
			return { flex: '1' };
	}
}
