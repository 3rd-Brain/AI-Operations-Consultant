#!/bin/bash
# DOI Method Installer (Claude Code CLI)
# Official install mode: plugin install to ~/.claude/plugins/
# Advanced mode: standalone skill install to ~/.claude/skills/
# For Cowork, upload the repo as a custom plugin for the full flow.
# Run from the folder containing this script.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_SKILLS="$SCRIPT_DIR/skills"
SOURCE_AGENTS="$SCRIPT_DIR/agents"
SOURCE_SCRIPTS="$SCRIPT_DIR/scripts"

usage() {
    echo "Usage: ./install-doi.sh [--plugin|--standalone|--legacy]"
    echo ""
    echo "  --plugin       Install DOI as a Claude Code plugin (default)"
    echo "  --standalone   Install DOI as standalone skills for bare /doi-run"
    echo "  --legacy       Alias for --standalone"
}

# Determine install mode
INSTALL_MODE="plugin"  # default: plugin install for /doi-method:doi-run
case "$1" in
    ""|--plugin)
        INSTALL_MODE="plugin"
        ;;
    --standalone|--legacy)
        INSTALL_MODE="standalone"
        ;;
    *)
        usage
        exit 1
        ;;
esac

echo ""
echo "DOI Method Installer"
echo "===================="
echo ""

if [ "$INSTALL_MODE" = "plugin" ]; then
    # Claude Code plugin install: namespaced command (/doi-method:doi-run)
    PLUGIN_DIR="$HOME/.claude/plugins/doi-method"
    echo "Mode:        Claude Code plugin (official)"
    echo "Install to:  $PLUGIN_DIR"
    echo "Command:     /doi-method:doi-run"
    echo ""

    if [ -d "$PLUGIN_DIR" ]; then
        echo "WARNING: Existing installation found at $PLUGIN_DIR. It will be replaced."
        echo ""
        read -p "Continue? (y/N) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Aborted."
            exit 0
        fi
        rm -rf "$PLUGIN_DIR"
    fi

    mkdir -p "$HOME/.claude/plugins"

    # If we're in a git repo, symlink for easy updates; otherwise copy
    if [ -d "$SCRIPT_DIR/.git" ]; then
        ln -s "$SCRIPT_DIR" "$PLUGIN_DIR"
        echo "Symlinked: $SCRIPT_DIR -> $PLUGIN_DIR"
        echo "(git pull in the source repo to update)"
    else
        cp -r "$SCRIPT_DIR" "$PLUGIN_DIR"
        echo "Copied to: $PLUGIN_DIR"
    fi

    # Make scripts executable
    chmod +x "$PLUGIN_DIR/scripts/"*.sh 2>/dev/null || true

    echo ""
    echo "Done. Open Claude Code and run: /doi-method:doi-run"

else
    # Standalone mode: copy skills/agents/scripts to ~/.claude/ subdirectories
    SKILLS_DIR="$HOME/.claude/skills"
    AGENTS_DIR="$HOME/.claude/agents"
    SCRIPTS_DIR="$HOME/.claude/scripts"

    echo "Mode:        Standalone skills (advanced)"
    echo "Skills dir:  $SKILLS_DIR"
    echo "Agents dir:  $AGENTS_DIR"
    echo "Scripts dir: $SCRIPTS_DIR"
    echo "Command:     /doi-run"
    echo ""

    mkdir -p "$SKILLS_DIR" "$AGENTS_DIR" "$SCRIPTS_DIR"

    # Copy skills
    echo "Installing skills..."
    for skill_dir in "$SOURCE_SKILLS"/doi-*; do
        [ -d "$skill_dir" ] || continue
        skill_name=$(basename "$skill_dir")
        echo "  $skill_name"
        rm -rf "$SKILLS_DIR/$skill_name"
        cp -r "$skill_dir" "$SKILLS_DIR/$skill_name"
    done

    # Copy agents
    if [ -d "$SOURCE_AGENTS" ]; then
        echo ""
        echo "Installing agents..."
        for agent_dir in "$SOURCE_AGENTS"/doi-*; do
            [ -d "$agent_dir" ] || continue
            agent_name=$(basename "$agent_dir")
            echo "  $agent_name"
            rm -rf "$AGENTS_DIR/$agent_name"
            cp -r "$agent_dir" "$AGENTS_DIR/$agent_name"
        done
    fi

    # Copy scripts
    if [ -d "$SOURCE_SCRIPTS" ]; then
        echo ""
        echo "Installing scripts..."
        mkdir -p "$SCRIPTS_DIR/doi"
        for script_file in "$SOURCE_SCRIPTS"/*.sh; do
            [ -f "$script_file" ] || continue
            script_name=$(basename "$script_file")
            echo "  $script_name"
            cp "$script_file" "$SCRIPTS_DIR/doi/$script_name"
            chmod +x "$SCRIPTS_DIR/doi/$script_name"
        done
    fi

    echo ""
    echo "Done. Open Claude Code and run: /doi-run"
fi

echo ""
echo "To uninstall:"
if [ "$INSTALL_MODE" = "plugin" ]; then
    echo "  rm -rf ~/.claude/plugins/doi-method"
else
    echo "  rm -rf ~/.claude/skills/doi-*"
    echo "  rm -rf ~/.claude/agents/doi-review"
    echo "  rm -rf ~/.claude/scripts/doi/"
fi
echo ""
