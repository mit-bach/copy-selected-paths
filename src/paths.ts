export type FullPathFn = (normalizedPath: string) => string;

export function uniqueOrdered(paths: readonly string[]): string[] {
	const seen = new Set<string>();
	const result: string[] = [];
	for (const path of paths) {
		if (path.length === 0 || seen.has(path)) {
			continue;
		}
		seen.add(path);
		result.push(path);
	}
	return result;
}

/**
 * Prefer File Explorer multi-select, then the active explorer row, then the
 * open note.
 */
export function collectVaultPaths(
	selected: readonly string[],
	activeExplorer: string | null,
	activeFile: string | null,
): string[] {
	if (selected.length > 0) {
		return uniqueOrdered(selected);
	}
	if (activeExplorer !== null && activeExplorer.length > 0) {
		return [activeExplorer];
	}
	if (activeFile !== null && activeFile.length > 0) {
		return [activeFile];
	}
	return [];
}

export function resolveSystemPaths(
	vaultPaths: readonly string[],
	getFullPath: FullPathFn | null,
): string[] {
	if (getFullPath === null) {
		return [];
	}
	const resolved: string[] = [];
	for (const vaultPath of vaultPaths) {
		try {
			const fullPath = getFullPath(vaultPath);
			if (typeof fullPath === 'string' && fullPath.length > 0) {
				resolved.push(fullPath);
			}
		} catch {
			continue;
		}
	}
	return resolved;
}

export function formatCopiedPaths(systemPaths: readonly string[]): string {
	return systemPaths.join('\n');
}

export function copyNoticeText(count: number): string {
	if (count === 1) {
		return 'Copied 1 path';
	}
	return `Copied ${count} paths`;
}
