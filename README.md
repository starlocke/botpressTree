## Starting Development

Start the app in the `dev` environment:

```bash
yarn start
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn run package
```

## Boilerplate Docs

See `electron-react-boilerplate` [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)

## Explanations -- dev mode

Start the app in the `dev` environment, and slightly cheat in the method to provision the PATHS parameters.

This is an example from within "git-bash" on Windows:

```bash
PATHS=/c/foo:/c/bar:/c/bob\ alice:/c/baz yarn start
```

You can set it up so that 3 folders exist initially:

- C:/foo/
- C:/bar/
- C:/bob alice/

If a folder does not exist (C:/baz/), it is fine; once it does exist, it will be rendered as a FolderTree.

A simple cycle of wiping out and recreating folders and files looks like this:

```
rm -rf /c/baz
mkdir -p /c/baz/baz/baz
```

## Explanations -- production mode

If you "package" the application and install it on your computer, then you can operate the application
in full production mode. The main point is that this mode is capable of handling `argv` parameters as
required by the problem statement.

This is an example from within "git-bash" on Windows:

```bash
PATHS=/c/foo:/c/bar ./botpressTree.exe frodo sam pippin
```

The result is that all of these 5 paths will be evaluated and tracked:

- C:/foo/
- C:/bar/
- <INSTALL_DIR>/frodo
- <INSTALL_DIR>/sam
- <INSTALL_DIR>/pippin
