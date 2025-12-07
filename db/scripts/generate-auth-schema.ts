import { getAuthTables } from "better-auth/db";
import type { BetterAuthOptions } from "better-auth/types";
import { createAuth } from "../../apps/api/lib/auth";
import { env } from "../../apps/api/lib/env";

/**
 * Generates the complete database structure from Better Auth configuration
 * Outputs the schema as formatted JSON showing all tables, fields, and relationships
 */
async function generateAuthSchema() {
  // Mock database instance - Better Auth only needs this for type checking, not actual queries
  const mockDb = {} as Record<string, unknown>;

  // Create the auth instance to get the configuration
  const auth = createAuth(mockDb, {
    APP_NAME: env.APP_NAME || "React Starter Kit",
    APP_ORIGIN: env.APP_ORIGIN || "http://localhost:3000",
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET || "mock-secret",
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID || "mock-client-id",
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
  });

  // WARNING: Type assertion needed as Better Auth doesn't export the auth instance type
  const authOptions = (auth as { options: BetterAuthOptions }).options;

  // Get the complete database schema
  const tables = getAuthTables(authOptions);

  // Format the output for better readability
  const schemaOutput = {
    metadata: {
      description: "Better Auth database schema",
      generatedAt: new Date().toISOString(),
      tableCount: Object.keys(tables).length,
    },
    tables: {},
  };

  // Process each table
  for (const [tableKey, table] of Object.entries(tables)) {
    const processedFields: Record<string, Record<string, unknown>> = {};

    // Process each field in the table
    for (const [fieldKey, field] of Object.entries(table.fields)) {
      processedFields[fieldKey] = {
        type: field.type,
        required: field.required || false,
        unique: field.unique || false,
      };

      // Add references if they exist
      if (field.references) {
        processedFields[fieldKey].references = {
          model: field.references.model,
          field: field.references.field,
        };
      }
    }

    (schemaOutput.tables as Record<string, unknown>)[tableKey] = {
      modelName: table.modelName,
      fields: processedFields,
    };
  }

  return schemaOutput;
}

// Main execution
async function main() {
  try {
    const schema = await generateAuthSchema();
    console.log(JSON.stringify(schema, null, 2));
  } catch (error) {
    console.error("Error generating auth schema:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { generateAuthSchema };
