import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { sessionQueryOptions } from "@/lib/queries/session";

export const sessionAtom = atomWithQuery(() => sessionQueryOptions());

export const userAtom = atom((get) => get(sessionAtom).data?.user ?? null);

export const sessionDataAtom = atom(
  (get) => get(sessionAtom).data?.session ?? null,
);

export const isAuthenticatedAtom = atom((get) => get(sessionAtom).data != null);

export const authTokenAtom = atom(
  (get) => get(sessionAtom).data?.session?.token ?? null,
);

export const userDisplayNameAtom = atom(
  (get) => get(userAtom)?.name || get(userAtom)?.email || "Guest",
);

export const userInitialsAtom = atom((get) => {
  const user = get(userAtom);
  if (!user) return "G";

  const name = user.name || user.email;
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});
