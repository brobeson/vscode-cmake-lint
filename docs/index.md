<!-- Jekyll and Github Pages process this file into a website. A level -->
<!-- heading is redundant in the produced HTML. -->
<!-- markdownlint-disable MD041 -->

## Getting Started

1. [Install cmake-lint](https://cmake-format.readthedocs.io/en/latest/installation.html)
   on your system. The executable must be in your `PATH`.
1. Install the extension through the
   [VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=brobeson.vscode-cmake-lint).

## Running CMake-Lint

VS Code CMake-Lint scans all of your CMake files when you open your project or
when you save your cmake-lint configuration file. It also scans an individual
CMake file when you save the file. If you need to manually scan your project or
the active file, you can run one of these commands.

- `CMake Lint: Scan all CMake Files` — Run `cmake-lint` on all CMake files in
  your workspace.
- `CMake Lint: Scan the Current File` — Run `cmake-lint` on the CMake file that
  is active in your text editor.

## Viewing Output

VS Code CMake lint reports issues as warnings in the Problems view. It also
highlights offending lines with warning squiggles in the text editor.
