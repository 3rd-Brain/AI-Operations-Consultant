#!/bin/bash
# scan-uploads.sh — Enumerate files in the _uploads/ tree and classify by extension.
#
# Usage:
#   scan-uploads.sh <engagement-folder>                          # all uploads
#   scan-uploads.sh <engagement-folder> general                  # general scope
#   scan-uploads.sh <engagement-folder> tool-exports             # tool-exports scope
#   scan-uploads.sh <engagement-folder> <dept-slug>              # department scope
#   scan-uploads.sh <engagement-folder> <dept-slug> <role-slug>  # role scope
#
# Output: tab-separated lines of "<relative-path>\t<classification>\t<size-bytes>"
# Classifications: pdf, docx, doc, md, csv, json, txt, image, other
# Exit code: 0 always (empty output if no files found, no _uploads/ folder, etc.)
#
# Skills consume this listing to decide which files to read into context.
# The MANIFEST.md ledger is maintained by the skills themselves, not this script.

set -e

ENGAGEMENT_DIR="$1"
SCOPE_A="$2"
SCOPE_B="$3"

if [ -z "$ENGAGEMENT_DIR" ]; then
    echo "ERROR: Usage: scan-uploads.sh <engagement-folder> [scope] [role-slug]" >&2
    exit 1
fi

UPLOADS_ROOT="$ENGAGEMENT_DIR/_uploads"

if [ ! -d "$UPLOADS_ROOT" ]; then
    # No uploads folder yet — silent empty output is the contract
    exit 0
fi

# Resolve scan target
if [ -z "$SCOPE_A" ]; then
    TARGET="$UPLOADS_ROOT"
elif [ -n "$SCOPE_B" ]; then
    TARGET="$UPLOADS_ROOT/$SCOPE_A/$SCOPE_B"
else
    TARGET="$UPLOADS_ROOT/$SCOPE_A"
fi

if [ ! -d "$TARGET" ]; then
    exit 0
fi

classify() {
    local file="$1"
    local lower="${file,,}"
    case "$lower" in
        *.pdf)                                  echo "pdf" ;;
        *.docx)                                 echo "docx" ;;
        *.doc)                                  echo "doc" ;;
        *.md|*.markdown)                        echo "md" ;;
        *.csv)                                  echo "csv" ;;
        *.json)                                 echo "json" ;;
        *.txt|*.text)                           echo "txt" ;;
        *.png|*.jpg|*.jpeg|*.gif|*.webp|*.heic) echo "image" ;;
        *.xlsx|*.xls)                           echo "xlsx" ;;
        *.pptx|*.ppt)                           echo "pptx" ;;
        *.html|*.htm)                           echo "html" ;;
        *.yaml|*.yml)                           echo "yaml" ;;
        *)                                      echo "other" ;;
    esac
}

# Enumerate every file under TARGET (recursive), skipping MANIFEST.md and dotfiles
find "$TARGET" -type f ! -name "MANIFEST.md" ! -name ".*" 2>/dev/null | while IFS= read -r file; do
    rel="${file#$ENGAGEMENT_DIR/}"
    cls=$(classify "$file")
    size=$(wc -c < "$file" 2>/dev/null | tr -d ' ' || echo "0")
    printf "%s\t%s\t%s\n" "$rel" "$cls" "$size"
done
