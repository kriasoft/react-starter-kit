import { useAtomValue } from "jotai";
import { themeSystemEffect } from "@/atoms/theme";

export function ThemeWatcher() {
  useAtomValue(themeSystemEffect);
  return null;
}
