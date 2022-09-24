#!/bin/bash

set -eu

vsix_file=$(ls *.vsix)
actual_files=$(unzip -lqq ${vsix_file} | sed 's/^.*   //' | sort --dictionary-order --ignore-case)

expected_files="[Content_Types].xml
extension/CHANGELOG.md
extension/LICENSE.txt
extension/out/extension.js
extension/out/cmakeLint.js
extension/package.json
extension/README.md
extension.vsixmanifest"

if [[ "${actual_files}" != "${expected_files}" ]]
then
  echo "The actual files in the package do not match the expected files."
  echo "Diff: expected | actual"
  diff -y <(echo "${expected_files}") <(echo "${actual_files}")
  exit 1
fi
