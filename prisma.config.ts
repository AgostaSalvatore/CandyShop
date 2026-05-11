import path from "node:path";
import { loadEnvFile } from "node:process";
import { defineConfig } from "prisma/config";

// Carica .env per i comandi prisma CLI locali.
// Su Vercel le env vars sono già nell'environment, quindi loadEnvFile fallisce
// silenziosamente (file non esiste) — è ok, basta usarlo solo in dev.
try {
  loadEnvFile(".env");
} catch {
  /* env file non presente: usiamo le env vars già caricate */
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
