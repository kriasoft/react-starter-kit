#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE example;
EOSQL

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d example <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS pg_uuidv7;
EOSQL
