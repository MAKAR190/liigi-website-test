import {defineField, defineType} from 'sanity'
import {  ColorWheelIcon} from '@sanity/icons'
export default defineType({
    name: 'clubs',
    title: 'Clubs',
    type: 'document',
    icon: ColorWheelIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            description: 'The name of the club.',
        }),  defineField({
            name: 'link',
            title: 'Link to the club',
            type: 'url',
            description: 'Redirect link to the club',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            description: 'The image representing the club.',
        }),
    ],
});
