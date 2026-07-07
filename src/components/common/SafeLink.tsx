/**
 * SafeLink — a thin wrapper around TanStack Router's `<Link>` that accepts a
 * plain `string` for the `to` prop.
 *
 * Why this exists
 * ---------------
 * TanStack Router's `<Link to={...}>` prop is a strict union of the app's
 * registered route paths (a literal-string union generated from the file-based
 * route tree). When a route path is built dynamically at runtime — e.g.
 * `cbtiPath(slug)` or `item.to` from a config array — TypeScript cannot narrow
 * the generic `string` to that literal union, so call sites resorted to
 * `to={somePath as any}`. That silenced the type checker in 20+ places and
 * hid real bugs (typos in paths would compile fine).
 *
 * `SafeLink` performs the single unavoidable cast in one audited location and
 * exposes a `string`-typed `to` prop everywhere else. Route validity is still
 * enforced at runtime by the router (unknown paths render a 404), and the
 * string paths themselves are produced by typed helpers (`cbtiPath`, `learnPath`,
 * nav config) so the surface area for typos is minimal.
 *
 * Prefer `<Link to="/literal">` directly when the path is a known literal.
 * Use `<SafeLink to={dynamicString}>` only when the path is computed.
 */
import { Link } from "@tanstack/react-router";
import { forwardRef, type ComponentProps } from "react";

/**
 * Props for SafeLink: all props accepted by TanStack `<Link>`, but with `to`
 * widened from a literal-string union to a plain `string`.
 *
 * We derive the prop type from `ComponentProps<typeof Link>` so that
 * `className`, `onClick`, `activeProps`, `activeOptions`, `children`, etc.
 * are all preserved with their original types. Only `to` is overridden.
 */
export type SafeLinkProps = Omit<ComponentProps<typeof Link>, "to"> & {
  /** Dynamic route path. Cast to the router's `to` type inside SafeLink. */
  to: string;
};

/**
 * Render a TanStack Router `<Link>` from a string-typed `to` value.
 *
 * The cast through `unknown` is intentional and isolated here: it is the only
 * place in the codebase where a `string` is widened to the router's literal
 * route union. Every other component should use `SafeLink` or a literal `to`.
 */
export const SafeLink = forwardRef<HTMLAnchorElement, SafeLinkProps>(function SafeLink(
  { to, ...rest },
  ref,
) {
  return <Link ref={ref} to={to as unknown as ComponentProps<typeof Link>["to"]} {...rest} />;
});
