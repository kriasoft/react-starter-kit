import { getAuthTables } from "better-auth/db";
import type { BetterAuthOptions } from "better-auth/types";
import { createAuth } from "../../apps/api/lib/auth";

/**
 * Generates the complete database structure from Better Auth configuration
 * Outputs the schema as formatted JSON showing all tables, fields, and relationships
 */
async function generateAuthSchema() {
  // Mock database instance - Better Auth only needs this for type checking, not actual queries
  const mockDb = {} as Record<string, unknown>;

  // Fixed placeholders, never Bun.env. Every optional integration is switched
  // on so the output covers each table Better Auth can require – Stripe's four
  // keys are all-or-nothing, and without them the `subscription` table would be
  // missing and a reviewer would read a valid schema as stale. Reading the
  // ambient environment would also make the output differ per machine.
  const auth = createAuth(mockDb, {
    APP_NAME: "React Starter Kit",
    APP_ORIGIN: "http://localhost:3000",
    BETTER_AUTH_SECRET: "mock-secret",
    GOOGLE_CLIENT_ID: "mock-client-id",
    GOOGLE_CLIENT_SECRET: "mock-client-secret",
    STRIPE_SECRET_KEY: "sk_test_mock",
    STRIPE_WEBHOOK_SECRET: "whsec_mock",
    STRIPE_STARTER_PRICE_ID: "price_mock_starter",
    STRIPE_PRO_PRICE_ID: "price_mock_pro",
    STRIPE_PRO_ANNUAL_PRICE_ID: "price_mock_pro_annual",
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
