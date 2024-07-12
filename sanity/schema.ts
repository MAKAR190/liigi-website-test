import { type SchemaTypeDefinition } from "sanity";

import {
  general,
  clubs,
  players,
  banner,
  nav,
  sponsors,
  social,
  footer,
  policies,
  categories,
  authors,
  news,
  video,
  seasons,
} from "./schemas";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    general,
    nav,
    clubs,
    players,
    seasons,
    banner,
    sponsors,
    categories,
    authors,
    news,
    video,
    social,
    footer,
    policies,
  ],
};
