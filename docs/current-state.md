# Current State

This document tracks the active state of the project. AI agents should maintain this document to reflect what works and what is currently in progress.

## What's Working ✅
- Basic implementation of `@multiversx/sdk-dapp` providing MultiversX authentication and TX signing.
- Client-side application built using Create React App scripts.

## What's Not Working ⚠️
- **Known Issue:** Build errors in docker or CICD services related to vite and `@rollup/rollup-linux-x64-gnu`.
  - **Workaround:** `git rm -r --cached ./package-lock.json` locally and ensure `package-lock.json` is not committed.

## In Progress 🔄
- Integrating Itheum protocol components.
