import type { Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { makeMembersUrl } from '$lib/fetcher';
import type { Member, MembersResponseList } from '../types/members';
import { v4 as uuidV4 } from 'uuid';

export const load: Load = async ({ fetch }) => {
	const url = makeMembersUrl({
		org: 'mozilla',
		page: 1
	});

	const res = await fetch(url);

	if (!res.ok) {
		error(res.status, res.statusText)
	}

	const members = await res.json() as MembersResponseList;

	if (members) {
		return {
			members: members.map<Member>((member) => ({
				id: uuidV4(),
				username: member.login,
				avatar: member.avatar_url,
				url: member.html_url,
				// TODO: should i fetch name for all?
				name: member.login
			}))
		};
	}

	error(404, 'Not found');
};
