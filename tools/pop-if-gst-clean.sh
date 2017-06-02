#!/usr/bin/env bash
cleanFlag='nothing to commit, working tree clean'
if [[  "$(git status)" =~ "$cleanFlag" ]]; then
  git stash pop
  >&2 echo "$cleanFlag"
  exit 1
fi
