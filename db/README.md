# Firestore Database

Database schema, security rules, indexes, and seed data for the [Firestore](https://cloud.google.com/firestore) database.

## Directory Structure

- [`/models`](./models/) — Database schema definitions using [Zod](https://zod.dev/).
- [`/seeds`](./seeds/) — Sample / reference data for the database.
- [`/scripts`](./scripts/) — Scripts for managing the database.
- [`/firestore.indexes.json`](./firestore.indexes.json) — Firestore indexes.
- [`/firestore.rules`](./firestore.rules) — Firestore security rules.

## Scripts

- `yarn workspace db seed` - Seed the database with data from [`/seeds`](./seeds/).

## References

- https://zod.dev/
- https://cloud.google.com/firestore
