const ORG_API = 'https://api.github.com/orgs';

interface MakeFetcherURL {
	org: string;
	page: number;
}

export function makeMembersUrl({ org, page }: MakeFetcherURL) {
	return `${ORG_API}/${org}/members?page=${page}`;
}
