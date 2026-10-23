import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 50,
  title: "Parallel Workers in Git Worktrees",
  description: "Imagine two coding workers both changing a repository while a third tries to run tests. In one checkout, branch switches and index operations can affect everybody, even when the workers intend to edit different files.",
  concepts: ["Unique worktree paths and branches", "Use command argument arrays", "Preserve dirty or active work"],
  scope: "Creates a validated Git worktree command plan and cleanup decision. It runs no Git command and removes no directory. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Plan an isolated worker tree", "input": {"runId": "worker-1", "dirty": false, "workerActive": false}, "expected": "passed", "checks": {"cleanupAllowed": true}}, {"id": "1", "label": "Preserve dirty worker work", "input": {"runId": "worker-1", "dirty": true, "workerActive": false}, "expected": "paused", "checks": {"cleanupAllowed": false}}, {"id": "2", "label": "Reject a path-like run ID", "input": {"runId": "../main", "dirty": false, "workerActive": false}, "expected": "rejected", "checks": {}}],
  async run(input) {

const run=text(input,"runId");if(!/^[a-z0-9][a-z0-9-]{0,39}$/.test(run))return report("rejected","Run ID cannot become a safe branch and managed path",{},["Validate host job identifiers before planning commands"]);
const directory=`managed-worktrees/${run}`,branch=`agents/${run}`,cleanupAllowed=!flag(input,"dirty")&&!flag(input,"workerActive");
return report(cleanupAllowed?"passed":"paused",cleanupAllowed?"Prepared creation and conditional cleanup plans":"Preserve the dirty or active worker tree",{directory,branch,createArgs:["worktree","add","-b",branch,directory,"reviewed-base"],cleanupAllowed,commandsExecuted:false},["Resolve a protected managed root","Reserve unique branch and directory","Invoke Git with an argument array in a real adapter","Require quiescent and clean state before removal"]);

  }
};
