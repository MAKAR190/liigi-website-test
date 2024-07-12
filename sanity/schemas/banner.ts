import {defineField, defineType, defineArrayMember,Rule } from 'sanity'
import {  ComponentIcon } from '@sanity/icons'
import {client} from "../../sanity"

const banner = defineType({
    name:"banner",
    type:'document',
    title:"Banner",
    icon: ComponentIcon,
    fields:[
        defineField({
            name:'title',
            type:'string',
            title:"Banner",
            readOnly:true
        }),
        defineField({
           name:"background",
           type:"image",
           title:"Background Image",
        }),
        defineField({
            name:"items",
            type:"array",
            title:"Items",
            validation: Rule => Rule.max(5),
            of:[
                defineArrayMember({
                    type: 'reference',
                    to: [
                        {type: 'news'},
                        {type: 'video'},
                    ],
        }),
            ],
            // initialValue: async () => {
            //     console.log('Fetching initial references...');
            //     try {
            //         const references = await client.fetch('*[_type in ["news", "video"] && !(_id in path("drafts.**"))] | order(_updatedAt desc) [0..4]');
            //         return references.map((ref:any) => ({ _ref: ref._id, _key: ref._id }));
            //     } catch (error) {
            //         console.error('Error fetching latest references:', error);
            //         return [];
            //     }
            // },
        })
    ]
})


export default  banner;