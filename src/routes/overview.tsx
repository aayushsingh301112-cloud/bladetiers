import { createFileRoute, redirect } from "@tanstack/react-router";

/** The Overview tab was renamed to Home; keep the old URL working. */
export const Route = createFileRoute("/overview")({
  beforeLoad: () => {
    throw redirect({ to: "/home" });
  },
});
