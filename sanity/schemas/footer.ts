import {defineField, defineType, defineArrayMember} from 'sanity'
import {  PinIcon } from '@sanity/icons'

const footer = defineType({
  name: "footer",
  type: "document",
  title: "Footer",
  icon: PinIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "tagline",
      type: "string",
      title: "Tagline",
    }),
    defineField({
      name: "cols",
      type: "array",
      title: "Columns",
      of: [
        defineArrayMember({
          type: "object",
          name: "col",
          title: "Column",
          fields: [
            defineField({
              title: "Headline",
              type: "string",
              name: "headline",
            }),
            defineField({
              title: "Headline Link",
              type: "url",
              name: "headline_link",
            }),
            defineField({
              name: "links",
              type: "array",
              title: "Links",
              of: [
                defineArrayMember({
                  name: "col_link",
                  title: "Column Link",
                  type: "object",
                  fields: [
                    defineField({
                      title: "Title",
                      type: "string",
                      name: "col_title",
                    }),
                    defineField({
                      title: "Link",
                      type: "url",
                      name: "col_link_link",
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

export default footer;