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

## Explanations -- Key Architectural Choices

**vs-code like file explorer**

Okay. So this sounds like the left-most "pane" that many developers will be familiar with.

Especially important to note:

- multiple collapsible sections
- multiple paths to local directories
- tree-view is mandated
- should be rendered in a browser
- should be launched via command line prompt
- should be a 4-5 hour solution

Some assumptions taken for granted to simply the problem-space:

- the ONLY interactions of concern are are modifications at the filesystem level;
  put another way, for the sake of simplicity, this file-explorer will not need to
  feature manipulations -- it may be read-only; this saves me from having to write
  tons of hooks/handlers and reduces the scope of the time investment needed

The focus here shall primarily be:

- there exists a read-only file explorer
- there exists a browser
- there exists command line parameter handling
- there exists just barely enough "glue" code to punch through some
  basic security barriers inherent between host and browser environments
- there exists just barely enough "structure" to position the file explorer
  component very roughly into place; leaving detailed design considerations
  for other folks to worry about

**key components of proposed solution**

To fulfil the "in a browser" requirement simultaneously with "is an application",
I've opted to start with `electron-react-boilerplate`. I assume that it is clear
to the reader how "electron" technically provides a Chromium-based web browser.

To fulfill the "file explorer" tree-view, I selected `react-folder-tree`
[npm page](https://www.npmjs.com/package/react-folder-tree).

To supply `react-folder-tree` with an appropriate data-structure, I employed `directory-tree`
[npm page](https://www.npmjs.com/package/directory-tree).

To watch the file system for changes, I opted for `chokidar`
[npm page](https://www.npmjs.com/package/chokidar).

To bridge the security-context gap, Electon's
[IPC system](https://www.electronjs.org/docs/latest/tutorial/ipc) was used.
`get-paths` and `get-tree` IPC functions/messages do the work. `chokidar` events
continuously refresh state, reactively, on the `get-tree` communication channel.

**more details in code comments, sparsely**

In a few places within the "newly written code" that I've produced (you can inspect
`git diff` to figure that out, I trust), there are a few handy comments around
some of the more complex blocks of code; the parts that would become mysterious
to me over time when I revisit things in a few months from now.

However, do note that I've not fully elaborated data flows coupled with events
in any particular place that is "easy" to interpret. I leave that as an exercise
for the next maintainer. The point here is that such high level documentation
would be made in a more formal setting. Here, as a "getting a job" pitch, I shall
refrain from doing so.

**advanced apologies to purists**

There are some aspects of the code that I would qualify as "awkward". Sorry.
I'd love to discuss/debate those points in order to imporve on them. For instance:
`import` vs `require`. For now, things are working as-is so I won't go around
trying to "fix it" following the "if it ain't broken, don't fix it" principle.
Worth reworking for standardization purposes, but not for functional purposes.

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

If you "package" the application (see above) and install it on your computer, then you can operate the application
in full production mode. The main point is that this mode is capable of handling `argv` parameters as
required by the problem statement. I trust that the reader is sufficiently well-versed in handling
their own operating system and would not need extremely detailed step-by-step instructions on how to go
about executing an application via command-line.

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
