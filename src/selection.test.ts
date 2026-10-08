import { describe, expect, it } from 'vitest';

import { vaultPathsFromNodes, type PathAttrNode } from './selection';

function node(path: string | null): PathAttrNode {
	return {
		getAttribute: (name: string): string | null => {
			return name === 'data-path' ? path : null;
		},
	};
}

describe('vaultPathsFromNodes', () => {
	it('reads data-path in document order and skips blanks', () => {
		expect(
			vaultPathsFromNodes([node('a.md'), node(''), node(null), node('b.md')]),
		).toEqual(['a.md', 'b.md']);
	});

	it('keeps the first occurrence of a duplicate path', () => {
		expect(vaultPathsFromNodes([node('a.md'), node('a.md')])).toEqual(['a.md']);
	});
});
