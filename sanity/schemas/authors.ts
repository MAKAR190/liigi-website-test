import {defineField, defineType, defineArrayMember} from 'sanity'
import { EditIcon } from '@sanity/icons'

const authors = defineType({
    name: 'authors',
    title: 'Authors',
    type: 'document',
    icon: EditIcon,
    fields:[
        defineField({
            name:'name',
            title:"Author",
            type: 'string',
        }),
        defineField({
            name:'position',
            title:"Author Position",
            type: 'string',
        })
    ]
})
export default authors;