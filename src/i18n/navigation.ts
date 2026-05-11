import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrappers di Next.js per supportare i18n routing.
// Usare questi al posto di next/link e next/navigation.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
