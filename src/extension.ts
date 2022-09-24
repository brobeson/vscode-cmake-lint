import * as vscode from "vscode";
import { lintDocument } from "./cmakeLint";

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

  async function cmakeLintActiveDocument() {
    if (
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
    vscode.commands.registerCommand(
      "cmakeLint.scanActiveFile",
      cmakeLintActiveDocument
    )
  );
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(cmakeLintActiveDocument)
  );
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(cmakeLintActiveDocument)
  );
}

export function deactivate() {}
