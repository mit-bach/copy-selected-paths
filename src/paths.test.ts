import { describe, expect, it } from 'vitest';

import {
	collectVaultPaths,
	copyNoticeText,
	formatCopiedPaths,
	resolveSystemPaths,
	uniqueOrdered,
} from './paths';

describe('uniqueOrdered', () => {
	it('drops empties and repeats while keeping first order', () => {
		expect(uniqueOrdered(['a', '', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
	});
});

describe('collectVaultPaths', () => {
	it('uses multi-select before the active explorer row', () => {
		expect(collectVaultPaths(['a.md', 'b.md'], 'z.md', 'note.md')).toEqual([
			'a.md',
			'b.md',
		]);
	});

	it('falls back to the active explorer row, then the open note', () => {
		expect(collectVaultPaths([], 'sel.md', 'note.md')).toEqual(['sel.md']);
		expect(collectVaultPaths([], null, 'note.md')).toEqual(['note.md']);
		expect(collectVaultPaths([], null, null)).toEqual([]);
	});
});

describe('resolveSystemPaths', () => {
	it('maps vault paths through getFullPath and skips failures', () => {
		const mapped = resolveSystemPaths(
			['ok.md', 'bad.md', 'also.md'],
			(path: string): string => {
				if (path === 'bad.md') {
					throw new Error('missing');
				}
				return `/vault/${path}`;
			},
		);
		expect(mapped).toEqual(['/vault/ok.md', '/vault/also.md']);
	});

	it('returns nothing without an adapter', () => {
		expect(resolveSystemPaths(['a.md'], null)).toEqual([]);
	});
});

describe('formatCopiedPaths', () => {
	it('joins with newlines', () => {
		expect(formatCopiedPaths(['/a', '/b'])).toBe('/a\n/b');
	});
});

describe('copyNoticeText', () => {
	it('uses a singular label for one path', () => {
		expect(copyNoticeText(1)).toBe('Copied 1 path');
		expect(copyNoticeText(3)).toBe('Copied 3 paths');
	});
});
