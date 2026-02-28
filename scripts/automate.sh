#!/bin/bash

# Dotaz - Automated Implementation Script
# Runs Claude Code in a loop, implementing one issue per iteration.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "========================================"
echo "Dotaz - Automated Implementation"
echo "========================================"
echo "Project: $PROJECT_DIR"
echo ""

PROMPT='Read docs/INSTRUCTIONS.md and docs/STATUS.md. Find the first pending issue, implement it according to the instructions (code, tests, commit, update status). If there are no pending issues left, respond with exactly: <done>promise</done>'

ITERATION=1
MAX_ITERATIONS=60

while [ $ITERATION -le $MAX_ITERATIONS ]; do
    echo ""
    echo "========================================"
    echo "Iteration $ITERATION / $MAX_ITERATIONS"
    echo "========================================"
    echo ""

    OUTPUT=$(claude --dangerously-skip-permissions -p "$PROMPT" 2>&1) || true

    echo "$OUTPUT"

    if echo "$OUTPUT" | grep -q "<done>promise</done>"; then
        echo ""
        echo "========================================"
        echo "All issues completed!"
        echo "========================================"
        exit 0
    fi

    if echo "$OUTPUT" | grep -qi "blocked"; then
        echo ""
        echo "========================================"
        echo "Issue blocked — check docs/STATUS.md"
        echo "========================================"
    fi

    ITERATION=$((ITERATION + 1))

    sleep 2
done

echo ""
echo "========================================"
echo "Max iterations ($MAX_ITERATIONS) reached"
echo "========================================"
exit 1
