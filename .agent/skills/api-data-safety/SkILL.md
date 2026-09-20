---
name: api-data-safety
description: >
  Prevents unsafe API data fetching, incomplete pagination, silent errors,
  invalid response handling, unnecessary conditions, and incorrect counting
  logic. Use when modifying API fetch, filtering, search, collection,
  pagination, aggregation, or data-processing code.
---

# API Data Safety Rules

## 1. Never Assume a Limited API Response Is Complete

- Never assume `maxResults=100`, `limit=100`, or similar values represent all records.
- Before changing API pagination, inspect how `totalItems`, `nextPage`, `startIndex`, `cursor`, or equivalent pagination fields work.
- If the requirement needs counts across the complete dataset, do NOT calculate them from only the first page.
- Prefer API-supported aggregation/faceting/count functionality when available.
- If pagination is required, implement it explicitly.
- Never silently truncate data.

## 2. Never Hide Errors

NEVER write:

```js
catch (e) {}