import { defineField, defineType } from "sanity";
import { SparkleIcon } from "@sanity/icons";

const general = defineType({
  name: "general",
  title: "General",
  type: "document",
  icon: SparkleIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
    defineField({
      name: "second_logo",
      title: "Second Logo",
      type: "image",
    }),
    defineField({
      name: "primary_color",
      title: "Primary Color",
      type: "color",
    }),
    defineField({
      name: "secondary_color",
      title: "Secondary Color",
      type: "color",
    }),
  ],
});
export default general;
