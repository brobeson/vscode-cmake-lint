import * as vscode from "vscode";
import { lintDocument } from "./cmakeLint";

export function activate(context: vscode.ExtensionContext) {
  let subscriptions = context.subscriptions;
  let diagnostics = vscode.languages.createDiagnosticCollection("cmakeLint");
  subscriptions.push(diagnostics);

  async function cmakeLintActiveDocument() {
    if (
      vscode.window.activeTextEditor !== undefined &&
      vscode.workspace.workspaceFolders !== undefined
    ) {
      const diag = await lintDocument(vscode.window.activeTextEditor.document);
      diagnostics.set(vscode.window.activeTextEditor.document.uri, diag);
      // if (diag.length > 0) {
      //   diagnostics.set(vscode.window.activeTextEditor.document.uri, diag);
      // }
    }
  }

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "cmake-lint.scanActiveFile",
      cmakeLintActiveDocument
    )
  );
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(cmakeLintActiveDocument)
  );
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(cmakeLintActiveDocument)
  );
  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((doc) =>
      diagnostics.delete(doc.uri)
    )
  );
}

export function deactivate() {}
