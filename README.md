# Smart-Sorter

Smart-Sorter is a NodeJS program to sort your files and directories.
It uses folders and files analysis to create "types". Each type is a group of files and directories that have the same properties.

## Installation

Use the `git clone` command to download the repository.

```bash
git clone https://gitlab.isima.fr/rovandemer/smart-sorter.git
cd smart-sorter
npm install
```

## Usage


### Software Configuration

Add `workPath` in config.json file.

```json
{
    "workPath": "..."
}
```

Create a `log/prog-logs/` folder and its file :

```bash
mkdir -p log/prog-logs
touch log/prog-logs/prog-logs.log
```

Then to run it just use the following command :

```bash
node index.js
```

### Type Configuration

You can configure it :

```bash
npm run add-type
```

Then type the name, and configure the structures as following :

```
[CONTENT]   => Directory named "CONTENT"
*           => glob substitution for "all"
?           => make some content not required
```

Example :

```
[*]{
    main.c
    [?*]{
        *.*
    }
    ?*.c
    ?*.h
}
```

In plain text, it gives : "a folder with whatever name, inside : main.c, a folder and .c/.h that aren't required. Inside the second folder, whatever file extension".

## Contributing

Pull requests are welcome. Contact me on my school address if you have any questions or suggestions.

## License

[MIT](https://choosealicense.com/licenses/mit/), Open Source Initiative [OSI - The MIT License](https://opensource.org/licenses/MIT).

## Project Status

The current project state is **stable**.
It supports now arborescence analysis, with types.

It's based on names analysis, and it's not very accurate sometimes (for example images with the same name).

## Last Changes

- Non-required analysis

- Improve folder *arborescence*
  - A dedicated folder for each type to make it easier to play with :
    - Function files
      - Command verifier files
      - Callback files
    - Config files
    
- Change `forbiddenBody`, ... body from `json` and arrays to structures like following :
  - Before : `{ name: "Forbidden", body: [ {includes: undefined, startsWith: "header-", endsWith: ".h", equalTo: undefined} ] }`
  - After  : `{ name: "Forbidden", body: ["header-*.h"]}`

## Future plans

- Add *mutli-folder* projects support
  - ~~For example if a project has sub folders like `src/`, `include/`, `lib/` etc.~~
  - ~~Analyse *parents*, they have to be filled with the same type~~
  - Analyse the *file content*
    - For example imports, includes, defines, etc...
    - Using [`flex-js-open`](https://www.npmjs.com/package/@fork-bench/flexjs-open)?
        - ~~Improve `flex-js-open`~~
- Add some mode examples
  - C programs, make it powerful
- Add *profiles* feature
  - Change from 'extension sort' to 'name sort', etc...
    - Good for large projects, to avoid too many files in the same folder
    - Help to search for files or projects
  - Symlinks instead of moving files ?
- Increasing program speed
- Adding *firewalls* to avoid destructive actions
- Adding windows support for `getFileDate` function
  - Add a switch command and an import for the file analysis module
- Adding an *undo* feature based on `logs/mv-logs/` log files
  - Add a command to undo the last action
    - ... of a specific type
      - ... and/or a specific file or folder
- Create an *UI* in (maybe) new frameworks like ReactJS or AngularJS
  - Add folder graphs?, with stats, etc...

- Add a program structure convertor
  - For example in a C program, to be able to change the structure and imports easily

- Add a documentation

## Author

Forkbench' Rovandemer,
July 2022, ISIMA, France.