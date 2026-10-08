import {
	FileSystemAdapter,
	Menu,
	Notice,
	Plugin,
	TAbstractFile,
} from 'obsidian';

import {
	collectVaultPaths,
	copyNoticeText,
	formatCopiedPaths,
	resolveSystemPaths,
} from './paths';
import {
	ACTIVE_PATH_SELECTOR,
	queryExplorerPaths,
	SELECTED_PATH_SELECTOR,
} from './selection';

export default class CopySelectedPathsPlugin extends Plugin {
	onload(): void {
		this.addCommand({
			id: 'copy-selected-paths',
			name: 'Copy absolute paths of selected files',
			icon: 'clipboard-copy',
			hotkeys: [{ modifiers: ['Mod', 'Alt'], key: 'C' }],
			callback: (): void => {
				void this.copyCurrentSelection();
			},
		});
		this.registerEvent(
			this.app.workspace.on(
				'file-menu',
				(menu: Menu, file: TAbstractFile): void => {
					this.addCopyMenuItem(menu, [file], false);
				},
			),
		);
		this.registerEvent(
			this.app.workspace.on(
				'files-menu',
				(menu: Menu, files: TAbstractFile[]): void => {
					this.addCopyMenuItem(menu, files, true);
				},
			),
		);
	}

	private addCopyMenuItem(
		menu: Menu,
		files: readonly TAbstractFile[],
		many: boolean,
	): void {
		const vaultPaths = files.map((file: TAbstractFile): string => file.path);
		menu.addItem((item): void => {
			item.setTitle(many ? 'Copy absolute paths' : 'Copy absolute path');
			item.setIcon('clipboard-copy');
			item.onClick((): void => {
				void this.copyVaultPaths(vaultPaths);
			});
		});
	}

	private async copyCurrentSelection(): Promise<void> {
		const selected = queryExplorerPaths(document, SELECTED_PATH_SELECTOR);
		const activeExplorer = queryExplorerPaths(document, ACTIVE_PATH_SELECTOR);
		const activeFile = this.app.workspace.getActiveFile();
		const vaultPaths = collectVaultPaths(
			selected,
			activeExplorer[0] ?? null,
			activeFile?.path ?? null,
		);
		await this.copyVaultPaths(vaultPaths);
	}

	private async copyVaultPaths(vaultPaths: readonly string[]): Promise<void> {
		const adapter = this.app.vault.adapter;
		const getFullPath =
			adapter instanceof FileSystemAdapter
				? (path: string): string => adapter.getFullPath(path)
				: null;
		const systemPaths = resolveSystemPaths(vaultPaths, getFullPath);
		if (systemPaths.length === 0) {
			new Notice('No file selected');
			return;
		}
		await navigator.clipboard.writeText(formatCopiedPaths(systemPaths));
		new Notice(copyNoticeText(systemPaths.length));
	}
}
