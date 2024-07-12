import { defineField, defineType, defineArrayMember } from "sanity";
import { PlayIcon } from "@sanity/icons";

const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "categories" }],
    }),
    defineField({
      name: "related_players",
      title: "Related Players",
      type: "array",
      of: [{ type: "reference", to: { type: "players" } }],
    }),
    defineField({
      name: "related_clubs",
      title: "Related Clubs",
      type: "array",
      of: [{ type: "reference", to: { type: "clubs" } }],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "authors" }],
    }),
    defineField({
      name: "video",
      type: "object",
      title: "Video",
      fields: [
        defineField({
          name: "url",
          type: "url",
          title: "URL",
        }),
        defineField({
          name: "preview",
          type: "image",
          title: "Preview",
        }),
      ],
    }),
    defineField({
      name: "short_description",
      title: "Summarize (short description for cards)",
      type: "text",
    }),
  ],
});

export default video;
