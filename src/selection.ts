export const FILE_EXPLORER_SELECTOR = '[data-type="file-explorer"]';
export const SELECTED_PATH_SELECTOR = '[data-path].is-selected';
export const ACTIVE_PATH_SELECTOR = '[data-path].is-active';

export interface PathAttrNode {
	getAttribute(name: string): string | null;
}

export function vaultPathsFromNodes(nodes: Iterable<PathAttrNode>): string[] {
	const paths: string[] = [];
	const seen = new Set<string>();
	for (const node of nodes) {
		const path = node.getAttribute('data-path');
		if (path === null || path.length === 0 || seen.has(path)) {
			continue;
		}
		seen.add(path);
		paths.push(path);
	}
	return paths;
}

export function queryExplorerPaths(
	root: ParentNode,
	selector: string,
): string[] {
	const scope = root.querySelector(FILE_EXPLORER_SELECTOR) ?? root;
	return vaultPathsFromNodes(
		Array.from(scope.querySelectorAll(selector)),
	);
}
