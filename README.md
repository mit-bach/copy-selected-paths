# Copy Selected Paths

Copy the absolute filesystem paths of files and folders selected in File Explorer. Works for one item or a multi-select.

The stock multi-select menu only offers move, bookmark, and delete. This plugin adds **Copy absolute paths** to that menu and to the single-file menu.

## Use

- Select one or more items in Files, then right-click → **Copy absolute path** / **Copy absolute paths**.
- Hotkey: `Command-Option-C` (macOS) / `Ctrl-Alt-C` (Windows/Linux).

Paths are one per line, using `FileSystemAdapter.getFullPath`. Desktop only.
