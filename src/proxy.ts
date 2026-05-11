import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Solo i18n per ora. L'auth guard è gestito a livello di layout
// nei segmenti (admin/account/checkout) per evitare overhead globale.
export default createMiddleware(routing);

export const config = {
  // Match tutte le route eccetto api, _next, file statici
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
