Quick Ollama + VS Code setup

1. Run the helper script (Windows):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-ollama.ps1 -PullModel
```

2. If you prefer not to pull a model immediately, omit `-PullModel` and run later:

```powershell
ollama pull llama2
ollama run llama2
```

3. In VS Code, open the Extensions view and install the Ollama extension if it wasn't installed by the script.

4. Workspace settings were written to `.vscode/settings.json` with `ollama.host` and `ollama.model` set.

Troubleshooting

- If `winget` is not available, install Ollama manually from https://ollama.com/install.
- If the `code` CLI isn't available, open VS Code and press Ctrl+Shift+P → `Shell Command: Install 'code' command in PATH` (macOS) or enable from VS Code documentation.
- If the extension can't connect, ensure Ollama is running and a model is available (`ollama list`).

Notes

- The script attempts non-interactive installs where possible but may prompt for confirmation depending on system configuration.
- Replace `llama2` with your preferred model name when pulling or configuring the extension.
