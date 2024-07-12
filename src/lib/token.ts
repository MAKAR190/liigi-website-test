import "server-only";
export const token = process.env.SANITY_SECRET_TOKEN;

if (!token) {
    throw new Error("Missing SANITY_API_READ_TOKEN");
}
