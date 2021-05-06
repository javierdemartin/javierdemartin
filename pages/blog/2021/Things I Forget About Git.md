---
title: Things I Forget about Git
author: Javier de Martín
date: 2021-05-04
published: true
---

This post is mostly one liners, things and git lingo I may or may not need to search frequently.

-----------

List the **individual contributors** on repository.

```
git log --format='%aN' | sort -u
```

---------

Pretty looking graph of commits and branches.

```
git log --all --decorate --oneline --graph
```

Hard to remember? Think it about *A dog*: **a**ll, **d**ecorate, **o**neline & **g**raph.

----------

Both git `pull` and `fetch` commands are used to download new data from a remote repository.

- `fetch` really downloads new data from a remote repository but doesn't integrate any of this new data into your working files.
- `pull`updates your current HEAD branch with the latest changes from the remote. Downloads and integrates it into your current working copy. It can cause a merge conflict when integrating remote changes into your local ones.

----------

**Merge conflicts** can always be reverted, don't worry. Conflicts will occur when there have been changes on the same line on the same file on both ends. Hence, Git cannot know which one should be kept.

```
<<<<<<<< HEAD (Current change)
This is a change
=======
Other change
>>>>>>>> [other/branch/name] (Incoming change)
```

A line with `=======` separates the two conflicting changes. You can solve the issues with any code editor you like. macOS comes with FileMerge.app which is nice.

-----------

**How to undo a merge?** You might have messed things during a merge, don't worry.

```
git merge --abort
```

If you realize you've made a mistake after the merge, just roll back to the commit before the merge happened with `git reset --hard` and start again.

-----------

Show the **differences between a file and the same one on another branch**.

```
git diff <other_branch> -- <file_to_compare>
```

-----------

Show all the **differences between two branches**.

```
git diff <one_branch>..<other_branch>
```

Show all the **differences between two commits**.

```
git diff HEAD..HEAD~1
```

-----------

**Squash all the commits in your `<feature_branch>`**. Maybe you've created a lot of WIP commits to track your progress but once you open a PR you want them to be all squashed into a single commit.

```
# After pulling all changes from the branch to want to merge these changes to
# Run this in your <feature_branch>
git reset --soft main
git add <YOUR_CHANGES>
git commit -m "New changes with PR details"
git push origin <feature_branch> --force
```

-----------

There are two ways to integrate changes: rebasing and merging. This is mostly a team-wide decision.

A **rebase rewrites history**.

-----------

`git checkout` moves the `HEAD` pointer to a specific commit or switches between branches. Rollbacks any content changes to those of the specific commit. Does not make changes to the commit history but has potential to overwrite files in the working directory.

-----------

`git reset` returns the entire working tree to the last committed state. It will discard commits in a private branch or throw away uncommitted changes.

-----------

**Undo public/remote changes** after publishing 

-----------

```
git checkout <file>
```

**Undo local changes**. After you modify a file you can **undo everything** in that file to the state known in the last commit.

-----------

Different types of `git reset`

* `--soft` resets `HEAD` to another commit, keeps the index and all the changes on your files stay untouched as *"Changes to be committed"* `git status` would put it.
* `--mixed` resets the index but not the working tree. Changed files are preserved but not marked for commit.
* `--hard` resets index and your working tree.

-----------

```
git commit --ammend -m "New fixed message"
```

**Fix the previous commit message** to update and replace the most recent commit with a new commit.

-----------

```
git reset HEAD~2
```

**Reset backwards a number of commits on a branch**. This resets your git history, it will be rewritten as if those commits never happened.

-----------

**What does `remote` and `origin` mean?** `origin` is just the default name for a remote from which a repo was originally cloned. It can have a different name, 

-----------

Git `HEAD` is a reference to a commit object. Each `HEAD` is context dependent on which branch you are on. `HEAD` is like a pointer that points to the current branch, when you checkout a branch `HEAD` changes to point to the new one. Current `HEAD` is local to each repository and developer.

------------

**How to go back to a previous commit?** 

* `git checkout <commit>` master ref is still pointing to the last commit. `HEAD` ref has been moved and now points to `<commit>`. Repo is now on a *detached `HEAD`* state.
* `git reset <commit>` moves both `HEAD` and branch refs to `<commit>`.

--------

You can use `git bisect` to find errors introduced in certain commits.

-------- 

**Rename a local branch**

```
git branch -m <old_name> <new_name>
```

---------

`git stash` temporarily shelves changes on your working copy and revers them from your working copy. **You can now switch branches**.

Reapply stashed changes with `git stash pop`. Reapply changes to your working copy and **keep the changes in your stash** with `git stash apply`. This is useful if you want to apply the same stashed changes to multiple branches.

You can have multiple stashes.

```
# They are simply saved as "WIP"
git stash list
```

To save each stash in an identifiable manner use `save`.

```
git stash save "Some changes"
```

`git stash pop` will re-apply the most recent created stash, `stash@{0}`. To apply another one use its identifier `git stash pop stash@{XXX}`.

View a `stash`diff with `git stash show`, pass the option `-p` to see the full diff.

**Create a branch from your stash** by checking out a new branch based on the commit you created your stash from.

```
git stash branch <branch_name> stash@{XXX}
```

**Clean a specific `stash`** with `git stash drop stash@{XXX}` or even all of them with `git stash clear`.