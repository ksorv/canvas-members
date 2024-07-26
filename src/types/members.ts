
export interface Member {
	id: string;
	username: string;
	name: string;
	avatar: string;
	url: string;
}
export type MemberList = Member[];

export interface MemberResponse {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
}
export type MembersResponseList = MemberResponse[];