import { render } from "@react-email/render";
import type { ReactElement } from "react";

/**
 * Render a React email component to HTML string
 * @param component React email component
 * @returns HTML string
 */
export async function renderEmailToHtml(
  component: ReactElement,
): Promise<string> {
  return await render(component, { pretty: true });
}

/**
 * Render a React email component to plain text string
 * @param component React email component
 * @returns Plain text string
 */
export async function renderEmailToText(
  component: ReactElement,
): Promise<string> {
  return await render(component, { plainText: true });
}
