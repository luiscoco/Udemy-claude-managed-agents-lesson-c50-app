# C50 · Parallel Workers in Git Worktrees

Creates a validated Git worktree command plan and cleanup decision. It runs no Git command and removes no directory. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Unique worktree paths and branches
- Use command argument arrays
- Preserve dirty or active work

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3050`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3050
```

## How the app was build

### 1. Derive managed names only from a bounded run ID

The run ID grammar excludes path traversal and shell metacharacters. The branch and directory names are then derived within fixed managed prefixes.

Source: [src/lesson.ts](src/lesson.ts#L13) · selected statements

```typescript
const run = text(input, "runId");

if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(run))
  return report(
    "rejected",
    "Run ID cannot become a safe branch and managed path",
    {},
    ["Validate host job identifiers before planning commands"],
  );

const directory = `managed-worktrees/${run}`,
  branch = `agents/${run}`,
  cleanupAllowed = !flag(input, "dirty") && !flag(input, "workerActive");
```

### 2. Plan argument-array commands and preserve active work

The Git creation plan uses an argument array instead of a shell string. Cleanup is allowed only when the supplied dirty and workerActive flags are false; commandsExecuted stays false, so no worktree is created or removed.

Source: [src/lesson.ts](src/lesson.ts#L15)

```typescript
return report(
  cleanupAllowed ? "passed" : "paused",
  cleanupAllowed
    ? "Prepared creation and conditional cleanup plans"
    : "Preserve the dirty or active worker tree",
  {
    directory,
    branch,
    createArgs: ["worktree", "add", "-b", branch, directory, "reviewed-base"],
    cleanupAllowed,
    commandsExecuted: false,
  },
  [
    "Resolve a protected managed root",
    "Reserve unique branch and directory",
    "Invoke Git with an argument array in a real adapter",
    "Require quiescent and clean state before removal",
  ],
);
```

### Check your understanding

Run **Plan an isolated worker tree** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "runId": "worker-1",
    "dirty": false,
    "workerActive": false
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "cleanupAllowed": true
  }
}
```

Then try **Preserve dirty worker work**. Its expected outcome is `paused`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
