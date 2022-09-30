# VS Code cmake-lint

[![Build and Test](https://github.com/brobeson/vscode-cmake-lint/actions/workflows/main.yaml/badge.svg)](https://github.com/brobeson/vscode-cmake-lint/actions/workflows/main.yaml)

This is an extension for Visual Studio Code to run
[cmake-lint](https://cmake-format.readthedocs.io/en/latest/cmake-lint.html) and
report lint in your CMake files.

## Features

- Automatically scan the active CMake file when you save it.
- Automatically scan all CMake files when you save your cmake-lint configuration
  file.

## Requirements

VS Code cmake-lint runs cmake-lint under the hood and processes the results. You
must
[install cmake-lint](https://cmake-format.readthedocs.io/en/latest/installation.html)
on your system.

## Extension Settings

There are no settings for this extension.

## Commands

See the [user manual](https://brobeson.github.io/vscode-cmake-lint) for
information about available commands.

## Known Issues

[![GitHub issues by-label](https://img.shields.io/github/issues/brobeson/vscode-cmake-lint/bug?label=Bugs)](https://github.com/brobeson/vscode-cmake-lint/issues?q=is%3Aopen+is%3Aissue+label%3Abug)
[![GitHub issues by-label](https://img.shields.io/github/issues/brobeson/vscode-cmake-lint/enhancement?label=Feature%20Requests)](https://github.com/brobeson/vscode-cmake-lint/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)

- VS Code cmake-lint does not support custom configuration files; you must use
  one of the
  [default files](https://cmake-format.readthedocs.io/en/latest/configuration.html)
  for the time being. If you are interested in this feature, you can watch
  [#1](https://github.com/brobeson/vscode-cmake-lint/issues/1).
