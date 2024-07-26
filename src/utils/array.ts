import type { Member, MemberList } from '../types/members';

export function searchMembers(
	array: MemberList,
	property: keyof Member,
	search: string
): MemberList {
	return array.filter((item) => item[property].includes(search));
}
