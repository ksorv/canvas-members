import 'unplugin-icons/types/svelte'
import type { MemberList } from './types/members';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			// data returned from server for home page
			members: MemberList
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};