import { defineField, defineType, defineArrayMember } from "sanity";
import { MenuIcon } from "@sanity/icons";

const nav = defineType({
  name: "nav",
  title: "Navigation of the website",
  type: "document",
  icon: MenuIcon,
  fields: [
    defineField({
      title: "Title",
      name: "title",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "cta",
      title: "CTA",
      validation: (Rule) => Rule.max(3),
      type: "array",
      of: [
        defineArrayMember({
          name: "cta_item",
          title: "Item",
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },
            {
              name: "link",
              type: "url",
              title: "Link",
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "pages",
      title: "Pages",
      type: "array",
      of: [
        defineArrayMember({
          name: "page",
          title: "Page",
          type: "object",
          fields: [
            defineField({
              title: "Title",
              name: "title",
              type: "string",
            }),
            defineField({
              title: "Link",
              name: "link",
              type: "string",
            }),
            defineField({
              name: "id",
              type: "string",
              title: "ID",
              // readOnly: true,
            }),
            defineField({
              name: "visible",
              type: "boolean",
              title: "Visible in menu",
              initialValue: true,
            }),
            defineField({
              name: "page_submenu",
              title: "Submenu",
              type: "object",
              fields: [
                defineField({
                  name: "clubs",
                  title: "Clubs",
                  type: "array",
                  of: [
                    defineArrayMember({
                      type: "reference",
                      to: { type: "clubs" },
                    }),
                  ],
                }),
                defineField({
                  name: "links",
                  type: "array",
                  of: [
                    defineArrayMember({
                      name: "link",
                      type: "object",
                      title: "Link",
                      fields: [
                        defineField({
                          title: "Title",
                          name: "title",
                          type: "string",
                        }),
                        defineField({
                          title: "URL",
                          name: "url",
                          type: "url",
                        }),
                      ],
                    }),
                  ],
                  title: "Links",
                }),
              ],
            }),
            defineField({
              name: "page_sections",
              title: "Sections",
              type: "array",
              of: [
                defineArrayMember({
                  name: "section",
                  type: "object",
                  title: "Section",
                  fields: [
                    defineField({
                      name: "title",
                      type: "string",
                      title: "Title",
                    }),
                    defineField({
                      name: "id",
                      type: "string",
                      title: "ID",
                      // readOnly: true,
                    }),
                    defineField({
                      name: "visible",
                      type: "boolean",
                      title: "Visible",
                      initialValue: true,
                    }),
                    defineField({
                      name: "description",
                      type: "string",
                      title: "Description",
                    }),
                    defineField({
                      name: "tagline",
                      type: "string",
                      title: "Tagline",
                    }),
                    defineField({
                      title: "Block Content",
                      name: "blockContent",
                      type: "array",
                      of: [
                        {
                          title: "Block",
                          type: "block",
                          // Styles let you set what your user can mark up blocks with. These
                          // correspond with HTML tags, but you can set any title or value
                          // you want and decide how you want to deal with it where you want to
                          // use your content.
                          styles: [
                            { title: "Normal", value: "normal" },
                            { title: "H1", value: "h1" },
                            { title: "H2", value: "h2" },
                            { title: "H3", value: "h3" },
                            { title: "H4", value: "h4" },
                          ],
                          lists: [{ title: "Bullet", value: "bullet" }],
                          // Marks let you mark up inline text in the block editor.
                          marks: {
                            // Decorators usually describe a single property – e.g. a typographic
                            // preference or highlighting by editors.
                            decorators: [
                              { title: "Strong", value: "strong" },
                              { title: "Emphasis", value: "em" },
                            ],
                            // Annotations can be any object structure – e.g. a link or a footnote.
                            annotations: [
                              {
                                title: "URL",
                                name: "link",
                                type: "object",
                                fields: [
                                  {
                                    title: "URL",
                                    name: "href",
                                    type: "string",
                                  },
                                ],
                              },
                              {
                                name: "quote",
                                type: "object",
                                title: "Quote",
                                fields: [
                                  {
                                    name: "text",
                                    type: "text", // <= This can also be a Portable Text field
                                    title: "Text",
                                  },
                                  {
                                    name: "author",
                                    type: "string", // <= This could be a reference to an author document type, if you had that
                                    title: "Author",
                                  },
                                ],
                              },
                            ],
                          },
                        },
                        // You can add additional types here. Note that you can't use
                        // primitive types such as 'string' and 'number' in the same array
                        // as a block type.
                        {
                          type: "image",
                          options: { hotspot: true },
                          fields: [
                            {
                              title: "Alternative Text",
                              name: "alt",
                              type: "string",
                              options: {
                                isHighlighted: true,
                              },
                            },
                          ],
                        },
                        {
                          type: "file",
                        },
                      ],
                    }),
                    defineField({
                      name: "image",
                      type: "image",
                      title: "Image",
                    }),
                    defineField({
                      name: "cta",
                      type: "array",
                      validation: (Rule) => Rule.max(2),
                      title: "CTAs",
                      of: [
                        defineArrayMember({
                          name: "cta_item",
                          title: "Item",
                          type: "object",
                          fields: [
                            {
                              name: "title",
                              title: "Title",
                              type: "string",
                            },
                            {
                              name: "link",
                              type: "url",
                              title: "Link",
                            },
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            defineField({
              name: "page_subnav",
              title: "Subnav",
              type: "array",
              of: [
                defineArrayMember({
                  name: "page_subnav_item",
                  title: "Subnav Item",
                  type: "object",
                  fields: [
                    defineField({
                      name: "title",
                      type: "string",
                      title: "Title",
                    }),
                    defineField({
                      name: "section_reference",
                      title: "Section Reference (Enter section ID)",
                      type: "string",
                    }),
                    defineField({
                      name: "redirect_link",
                      title: "Or Link (For Redirect)",
                      type: "url",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});

export default nav;
