import { spawn } from "child_process";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let subscriptions = context.subscriptions;
  let diagnostics = vscode.languages.createDiagnosticCollection("cmakeLint");
  subscriptions.push(diagnostics);

  async function cmakeLintAllFiles() {
    let allFiles = await vscode.workspace.findFiles("**/CMakeLists.txt");
    allFiles = allFiles.concat(await vscode.workspace.findFiles("**/*.cmake"));
    for (const cmakeFile of allFiles) {
      diagnostics.set(cmakeFile, await lintDocument(cmakeFile.fsPath));
    }
  }

  async function cmakeLintOnSave(file: vscode.TextDocument) {
    if (isCmakeLintConfigFile(file.uri.fsPath)) {
      cmakeLintAllFiles();
    } else if (
      vscode.window.activeTextEditor !== undefined &&
      vscode.window.activeTextEditor.document.languageId === "cmake"
    ) {
      diagnostics.set(
        vscode.window.activeTextEditor.document.uri,
        await lintDocument(vscode.window.activeTextEditor.document.uri.fsPath)
      );
    }
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("cmakeLint.scanAllFiles", cmakeLintAllFiles)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("cmakeLint.scanActiveFile", cmakeLintOnSave)
  );
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(cmakeLintOnSave)
  );
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(cmakeLintOnSave)
  );
  cmakeLintAllFiles();
}

export function deactivate() {}

type CommandResponse = {
  exitCode: number;
  output: string;
};

async function lintDocument(file: string) {
  const response = await runCmakeLint(file);
  if (response.exitCode && response.output) {
    return createDiagnosticsFromOutput(response.output);
  }
  return [];
}

async function runCmakeLint(file: string): Promise<CommandResponse> {
  return new Promise((resolve, reject) => {
    const process = spawn("cmake-lint", ["--suppress-decorations", file]);
    if (process.pid) {
      let output = "";
      process.stderr.on("data", (data) => { output += data; }); // prettier-ignore
      process.stdout.on("data", (data) => { output += data; }); // prettier-ignore
      process.on("close", (exitCode) => {
        exitCode = exitCode ?? 0;
        output = output.trim();
        resolve({ exitCode, output });
      });
      process.on("error", (error: Error) => reject(error));
    }
  });
}

function createDiagnosticsFromOutput(
  processOutput: string
): vscode.Diagnostic[] {
  const lines = processOutput.split("\n");
  const diagnostics: vscode.Diagnostic[] = [];
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
        vscode.DiagnosticSeverity.Warning
      );
      d.code = matches[2];
      d.source = "cmake-lint";
      diagnostics.push(d);
    }
  }
  return diagnostics;
}

function isCmakeLintConfigFile(filepath: string): boolean {
  // No need for options with the the leading '.' - The function checks
  // string.endswith(), so these options cover both cases.
  const defaultFiles = [
    "cmake-format.yaml",
    "cmake-format.json",
    "cmake-format.py",
  ];
  return defaultFiles.some((configFile, index, files) => {
    return filepath.endsWith(configFile);
  });
}
