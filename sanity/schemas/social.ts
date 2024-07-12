import {defineField, defineType, defineArrayMember} from 'sanity'
import {  LinkIcon } from '@sanity/icons'

const social = defineType({
    name:'social',
    type:"document",
    title:"Social media",
    icon: LinkIcon,
    fields:[

  defineField({
      name:"title",
      type:"string",
      title:"Title",
  }),  defineField({
                            name:"icon",
                            type:"image",
                            title:"Icon",
                        }),   defineField({
                            name:"link",
                            type:"url",
                            title:"Link",
                        })
    ]
})
export default social;