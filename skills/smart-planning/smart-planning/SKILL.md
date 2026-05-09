---
name: smart-planning
description: Structured project planning, modular file decomposition, and imperative task tracking.
---

## Procedural Workflow
Follow the progression defined in:
1. `Instructions.md`: Project goals, scope, and high-level strategy.
2. `Syntax_ErrorCleaning.md`: Coding standards, linting rules, and error handling protocols.
3. `TestandinstallNessecary_packages`: Required dependencies and installation commands.

## Setup
To initialize these files in the current directory, execute:
```bash
gemini smart-planning:setup
```

## Tracking
After every numbered task step (e.g., `1.`, `2.`, `N.`) you complete or create, you MUST update progress by running:
```bash
node scripts/tracker.js <Folder-Name>
```

## Tracker Logic
- **Total Steps**: Determined by the highest integer found in files matching `^(\d+)\.`.
- **Completion**: Determined by the count of files in the target directory containing the string "done".
- **Percentage**: `(completed / total) * 100`.
