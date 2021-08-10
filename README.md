# CopyTables

![CopyTables](https://raw.githubusercontent.com/nirantak/copytables/main/src/ico128.png)

Firefox extension to select and copy table cells.

[Install for Firefox](https://addons.mozilla.org/firefox/addon/copywebtables/)

## Usage

- Hold <kbd>Opt</kbd> (macOS) or <kbd>Alt</kbd> (Windows) and drag to select cells.
- Hold <kbd>Opt+Cmd</kbd> (macOS) or <kbd>Alt+Ctrl</kbd> (Windows) and drag to select columns.
- Copy selection (or the whole table) as seen on the screen (for rich text editors)
- Copy as CSV or TSV (for Spreadsheets).
- Copy as HTML (for your website).

Forked from [gebrkn/copytables](https://github.com/gebrkn/copytables) for Chrome ([Web Store](https://chrome.google.com/webstore/detail/copytables/ekdpkppgmlalfkphpibadldikjimijon)).

## Building the Extension

Build tested using: `node` v16.6.1 (`npm` v7.20.5) on macOS 11.5.1

```bash
# Clone the repo
git clone https://github.com/nirantak/copytables.git
cd copytables

# Install dependencies
npm install

# Build zipped extension
npm run deploy
## Output: copytables-0.1.0.zip

# Test in development mode
npm start
## This does the following:
## - Runs a dev server with dummy data on localhost:9876
## - Runs gulp to watch and rebuild for code changes
## - Opens Firefox with the extension loaded in debug mode
```
