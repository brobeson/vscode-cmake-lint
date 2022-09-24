import { spawn } from "child_process";
import * as vscode from "vscode";

export async function lintDocument(file: vscode.TextDocument) {
  if (file.languageId !== "cmake" || file.uri.scheme !== "file") {
    return [];
  }
  const output = await runCmakeLint(file.uri.fsPath);
  return createDiagnosticsFromOutput(output);
}

async function runCmakeLint(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn("cmake-lint", ["--suppress-decorations", file]);
    if (process.pid) {
      let output = "";
      process.stderr.on("data", (data) => { output += data; }); // prettier-ignore
      process.stdout.on("data", (data) => { output += data; }); // prettier-ignore
      process.on("close", (code) => resolve(output.trim()));
      process.on("error", (error: Error) => reject(error));
    }
  });
}

function createDiagnosticsFromOutput(
  processOutput: string
): vscode.Diagnostic[] {
  if (processOutput.length === 0) {
    return [];
  }
  const lines = processOutput.split("\n");
  let diagnostics: vscode.Diagnostic[] = [];
  for (const line of lines) {
    let matches = line.match(/^[^:]+:(\d+).*:\s*\[([^\]]+)\]\s+(.*)$/);
    if (matches === null) {
      vscode.window.showErrorMessage(
        `CMake Lint output did not match regex: "${line}"`
      );
    } else {
      const d = new vscode.Diagnostic(
        new vscode.Range(+matches[1] - 1, 0, +matches[1] - 1, 1000),
        matches[3],
        vscode.DiagnosticSeverity.Error
      );
      d.code = matches[2];
      d.source = "cmake-lint";
      diagnostics.push(d);
    }
  }
  return diagnostics;
}
