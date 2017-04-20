#!/usr/bin/env bash
if [ -z "$(git diff HEAD)" ]; then
  git stash pop
  git reset
  >&2 echo "nothing to commit, git diff HEAD is clean after fix"
  exit 1
fi
