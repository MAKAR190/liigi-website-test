import {defineField, defineType, defineArrayMember} from 'sanity'
import { SortIcon } from '@sanity/icons'

const categories = defineType({
    name: 'categories',
    title: 'Categories',
    type: 'document',
    icon: SortIcon,
    fields:[
        defineField({
            name:'title',
            title:"Category Title",
            type: 'string',
        }),
        defineField({
            name:'image',
            title:"Category Image (optional)",
            type: 'image',
        })
    ]
})
export default categories;