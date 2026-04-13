# searchtool

A lightweight Node.js CLI tool that searches files and directories for a regular expression pattern — inspired by Unix `grep`.

---

## Features

- Search one or more files for a regex pattern
- Recursively search through directories and subdirectories
- Outputs only the names of files that contain a match
- Helpful error messages for missing or invalid patterns

---

## Requirements

- Node.js v18 or higher

---

## Installation

Clone the repository:

```bash
git clone https://github.com/ronaksdev/searchtool.git
cd searchtool
chmod +x grep.mjs
```

To use it globally from any directory, add a `bin` field to `package.json` first:

```json
"bin": {
  "searchtool": "./grep.mjs"
}
```

Then run:

```bash
npm link
```

To uninstall:

```bash
npm unlink -g searchtool
```

---

## Usage

If installed globally:
```bash
searchtool <pattern> <file1|dir1> <file2|dir2> ...
```

Or run it directly from the project folder:
```bash
npm start -- <pattern> <file1|dir1> <file2|dir2> ...
```

### Arguments

| Argument | Description |
|---|---|
| `pattern` | A valid JavaScript regular expression to search for |
| `file/dir` | One or more files or directories to search through |

---

## Examples

Search from the current directory downward:
```bash
searchtool "pattern" .
```

Search an entire directory recursively:
```bash
searchtool "TODO" ./src
```

Search a single file:
```bash
searchtool "hello" file.txt
```

Search multiple files:
```bash
searchtool "foo|bar" file1.txt file2.txt
```

Mix files and directories:
```bash
searchtool "import" ./src readme.md
```

> **Note:** Patterns containing shell-special characters such as `|`, `*`, `$`, or `?` should always be wrapped in double quotes to prevent the shell from intercepting them.

---

## How It Works

1. Validates that a regex pattern was provided and that it is a valid JavaScript `RegExp`
2. Validates that at least one file or directory argument was provided
3. Recursively resolves all file paths — expanding any directories into their constituent files
4. Reads each file and tests it against the regex
5. Prints the path of any file that contains a match

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| No pattern provided | Prints usage to stderr and exits with code 1 |
| Invalid regex pattern | Prints error message to stderr and exits with code 1 |
| No files or directories provided | Prints usage to stderr and exits with code 1 |
| Unreadable file or inaccessible path | Prints a warning to stderr and continues |

---

## Author

ronaksdev.web.dev@gmail.com

---

## License

ISC