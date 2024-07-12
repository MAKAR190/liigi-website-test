import {defineField, defineType} from 'sanity'
import { ChartUpwardIcon } from '@sanity/icons'
export default defineType({
    name: 'sponsors',
    title: 'Sponsors',
    type: 'document',
    icon: ChartUpwardIcon,
    fields: [
        defineField({
            name: 'kind',
            title: 'Kind',
            type: 'string',
            description: 'The kind of the sponsor.',
        }),  defineField({
            name: 'link',
            title: 'Link to the sponsor',
            type: 'url',
            description: 'Redirect link to the sponsor',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            description: 'The image representing the sponsor.',
        }),
    ],
});
