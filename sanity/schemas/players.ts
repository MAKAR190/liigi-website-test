import { defineField, defineType } from "sanity";
import { UsersIcon, TrendUpwardIcon } from "@sanity/icons";
import countries from "world-countries";
import { client } from "../../sanity";
const additionalCountries = [
  { title: "England", value: "GB-ENG" },
  { title: "Scotland", value: "GB-SCT" },
  { title: "Wales", value: "GB-WLS" },
  { title: "Northern Ireland", value: "GB-NIR" },
];

const nationalities = countries
  .map((country) => ({
    title: country.name.common,
    value: country.cca3,
  }))
  .concat(additionalCountries);

nationalities.sort((a, b) => a.title.localeCompare(b.title));

async function fetchMainSeason() {
  const mainSeason = await client.fetch(
    `*[_type == "seasons" && main == true][0]`
  );
  return mainSeason ? [{ _type: "reference", _ref: mainSeason._id }] : [];
}
const nameValidation = (Rule: any) =>
  Rule.custom((name: string) => {
    if (!name) return true; // Allow undefined or null values
    const isValid = /^[A-Z][a-z]*$/.test(name);
    return isValid
      ? true
      : "Name must start with an uppercase letter and contain no other uppercase letters.";
  });
export default defineType({
  name: "players",
  title: "Players",
  type: "document",
  icon: UsersIcon,
  groups: [
    {
      name: "overview",
      title: "Overview",
    },
    {
      name: "stats",
      title: "League Stats",
    },
    {
      name: "social",
      title: "Social Media",
    },
  ],
  fields: [
    defineField({
      name: "first_name",
      title: "First Name",
      type: "string",
      group: "overview",
      validation: nameValidation,
    }),
    defineField({
      name: "last_name",
      title: "Last Name",
      type: "string",
      group: "overview",
      validation: nameValidation,
    }),
    defineField({
      name: "profile",
      type: "image",
      title: "Profile Photo",
      group: "overview",
    }),
    defineField({
      name: "nationality",
      title: "Nationality",
      type: "string",
      options: {
        list: nationalities,
        layout: "dropdown",
      },
      group: "overview",
    }),
    defineField({
      name: "number",
      title: "Jersey Number",
      type: "number",
      group: "overview",
    }),
    defineField({
      name: "club",
      title: "Club",
      type: "reference",
      to: { type: "clubs" },
      group: "overview",
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      options: {
        list: [
          "Goalkeeper",
          "Defender",
          "Midfielder",
          "Defensive Midfielder",
          "Central Midfielder",
          "Attacking Midfielder",
          "Right Midfielder",
          "Left Midfielder",
          "Winger",
          "Forward",
          "Center Forward",
          "Striker",
          "Second Striker",
          "Wing Back",
          "Full Back",
          "Right Back",
          "Left Back",
          "Center Back",
          "Sweeper",
          "Center Half",
          "Holding Midfielder",
          "Box-to-Box Midfielder",
          "Playmaker",
          "Libero",
          "False Nine",
          "Target Man",
          "Deep-Lying Forward",
          "Trequartista",
          "Regista",
          "Inside Forward",
        ],
      },
      group: "overview",
    }),
    defineField({
      name: "date_of_birth",
      title: "Date of birth",
      type: "date",
      group: "overview",
    }),
    defineField({
      name: "height",
      title: "Height (cm)",
      type: "number",
      group: "overview",
    }),
    defineField({
      name: "related_seasons",
      title: "Related Seasons",
      type: "array",
      of: [{ type: "reference", to: { type: "seasons" } }],
      group: "overview",
      description: "Select the season this player is associated with",
      initialValue: fetchMainSeason,
    }),
    defineField({
      name: "season_stats",
      title: "Season Stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "season",
              title: "Season",
              type: "reference",
              to: { type: "seasons" },
            }),
            defineField({
              name: "club",
              title: "Club",
              type: "reference",
              to: { type: "clubs" },
            }),
            defineField({
              name: "appearances",
              title: "Appearances",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "goals",
              title: "Goals",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "assists",
              title: "Assists",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "clean_sheets",
              title: "Clean sheets",
              type: "number",
              initialValue: 0,
            }),
          ],
          preview: {
            select: {
              season: "season.season",
              club: "club.name",
              appearances: "appearances",
              goals: "goals",
              assists: "assists",
              clean_sheets: "clean_sheets",
            },
            prepare({
              season,
              club,
              appearances,
              goals,
              assists,
              clean_sheets,
            }) {
              return {
                title: `${season} - ${club}`,
                subtitle: `Appearances: ${appearances}, Goals: ${goals}, Assists: ${assists}, Clean Sheets: ${clean_sheets}`,
                media: TrendUpwardIcon,
              };
            },
          },
        },
      ],
      group: "stats",
    }),
    defineField({
      name: "social_media",
      title: "Social Media",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform_name",
              title: "Platform Name",
              type: "string",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "image",
            }),
          ],
        },
      ],
      group: "social",
    }),
  ],
  preview: {
    select: {
      firstName: "first_name",
      lastName: "last_name",
      media: "profile",
    },
    prepare(selection) {
      const { firstName, lastName, media } = selection;
      return {
        title: `${firstName} ${lastName}`,
        media,
      };
    },
  },
});
