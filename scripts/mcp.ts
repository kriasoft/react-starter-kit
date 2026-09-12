import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { fileURLToPath } from "bun";
import { execa } from "execa";
import { z } from "zod";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const $ = execa({ cwd: rootDir });

/**
 * Model Context Protocol (MCP) server.
 *
 * @see https://modelcontextprotocol.org
 * @see https://code.visualstudio.com/docs/copilot/chat/mcp-servers
 */
const server = new McpServer({
  name: "React Starter Kit",
  version: "0.0.0",
});

// Example of a custom tool an MCP client (VS Code, Copilot, an agent) can
// call. Named for the intent, not the binary: the caller gets the policy
// `bun lint` enforces, flags included. `bun lint` takes no filename, so
// Oxlint is invoked directly with the same flags.
server.registerTool(
  "lint",
  {
    description: "Lint a file with this repository's Oxlint policy",
    inputSchema: { filename: z.string() },
  },
  async ({ filename }) => {
    // `--` keeps a model-supplied `filename` positional: without it, `--fix`
    // is an Oxlint option and the tool rewrites the repository.
    //
    // `reject: false`: Oxlint exits non-zero exactly when the file has
    // problems, and execa would throw away the diagnostics the caller asked
    // for. An ignored path lands here too and says so.
    const cmd = await $({
      reject: false,
    })`bun run oxlint --deny-warnings --report-unused-disable-directives -- ${filename}`;
    return {
      content: [
        {
          type: "text",
          text: cmd.stdout || cmd.stderr || "No problems found.",
        },
      ],
    };
  },
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
