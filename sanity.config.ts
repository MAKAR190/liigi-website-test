/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\src\app\admin\[[...index]]\page.tsx` route
 */

// import {visionTool} from '@sanity/vision'
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { colorInput } from "@sanity/color-input";
import { media } from "sanity-plugin-media";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schema";



export default defineConfig({
  basePath: "/admin",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  document: {
    actions: (prev, { schemaType }) => {
      // Allow only `publish` for page and settings documents (singletons).
      if (
        schemaType === "general" ||
        schemaType === "nav" ||
        schemaType === "footer" ||
        schemaType === "banner"
      ) {
        return prev.filter((obj) => obj.action === "publish");
      }
      // Allow everything for the rest of documents
      return prev;
    },
    newDocumentOptions: (prev /*, { creationContext }*/) => {
      // Remove singletons and feedback from "create new document"
      return prev.filter(
        (templateItem) =>
          !["general", "nav", "footer", "banner"].includes(
            templateItem.templateId
          )
      );
    },
  },
  plugins: [
    structureTool(),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    colorInput(),
    media(),
    // visionTool({defaultApiVersion: apiVersion}),
  ],
});
