# FDE App

FDE App turns Claude or Codex into your company's Forward Deployed Engineer (FDE). It documents how a company really runs, finds where work waits, loops, or depends on one person, and plans, values, and rolls out the changes that matter, in your own Claude or Codex. This plugin carries the FDE App skill and connects it to FDE App, where each company's library is kept, checked on every save, and readable in the web app.

You may use FDE App for your own company's operations under the FDE App License (see `LICENSE`). Using it to serve clients needs a separate agreement with Digital Operations Institute.

## Install

**Claude Code, from GitHub.**

```bash
claude plugin marketplace add 3rd-Brain/AI-Operations-Consultant
claude plugin install fde-app@fde-app --scope user
```

Start Claude Code, run `/mcp`, choose `fde-app`, and sign in with the email you use for FDE App.

**Claude Code, from a download.** Unzip the download, then run, with the path to the unzipped `fde-app` folder:

```bash
claude plugin marketplace add ./fde-app
claude plugin install fde-app@fde-app --scope user
```

Start Claude Code, run `/mcp`, choose `fde-app`, and sign in with the email you use for FDE App.

**Codex** (the Codex CLI or the Codex app; the IDE extension has no plugins). Unzip the download, then run, with the path to the unzipped `fde-app` folder:

```bash
codex plugin marketplace add ./fde-app
codex plugin add fde-app@fde-app
codex mcp login fde-app
```

Sign in with the email you use for FDE App. On Windows, if PowerShell refuses to run `codex`, type `codex.cmd` instead. Then add these lines to `~/.codex/config.toml` (evidence intake runs six subagents at once, and Codex allows four by default):

```toml
[agents]
max_concurrent_threads_per_session = 24
```

On Windows, also add these, so Codex can read the plugin's files:

```toml
[windows]
sandbox = "unelevated"
```

Start a new Codex session.

**Cowork, claude.ai, and the desktop app.** Customize, then Plugins, then Add, then Upload plugin, and choose the zip. Open the plugin's Connectors tab and connect FDE App, signing in with the email you use for FDE App.

## First message

> I'm new to FDE App. Help me get started with my company.

## Updating

Download the new version from https://fdeapp.digitaloperationsinstitute.com/welcome. In Claude Code, unzip it over the same folder and run `/reload-plugins`. In Codex, unzip it over the same folder, run `codex plugin remove fde-app@fde-app` and `codex plugin add fde-app@fde-app`, and start a new session. In Cowork and claude.ai, upload the new zip.

## Help

Ask "help" or "what's next?" at any time. Questions or feedback: michael@3rdbrain.co.
