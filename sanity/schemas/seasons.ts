import { defineField, defineType, defineArrayMember } from "sanity";
import { DatabaseIcon, CalendarIcon, ColorWheelIcon } from "@sanity/icons";
import { client } from "../../sanity";

// Function to fetch all clubs for initial value of league_table
const fetchAllClubs = async () => {
  const clubs = await client.fetch(`*[_type == "clubs"]{_id, name, image}`);
  return clubs.map((club: any) => ({
    club: { _type: "reference", _ref: club._id },
    points: 0,
    gf: 0,
    ga: 0,
  }));
};

// Function to get today's date in 'YYYY-MM-DD' format
const getTodayDateISOString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Get only the date part
};

// Function to add days to a given date and return 'YYYY-MM-DD' format
const addDaysToISOString = (isoDate: string, days: number) => {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0]; // Get only the date part
};

// Define the Sanity schema for seasons
const seasons = defineType({
  name: "seasons",
  title: "Seasons",
  type: "document",
  icon: DatabaseIcon,
  fields: [
    // Season field
    defineField({
      name: "season",
      title: "Season",
      type: "string",
      description: "For example, '2024/2025'",
      validation: (Rule) => Rule.required(),
    }),
    // Main field for visibility on the main page
    defineField({
      name: "main",
      title: "Visible on the main page",
      type: "boolean",
    }),
    // League table field
    defineField({
      name: "league_table",
      title: "League Table",
      type: "array",
      of: [
        // Array member definition for league table rows
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "club",
              title: "Club",
              type: "reference",
              to: [{ type: "clubs" }],
            }),
            defineField({
              name: "points",
              title: "Points",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "played",
              title: "Played",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "won",
              title: "Won",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "drawn",
              title: "Drawn",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "lost",
              title: "Lost",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "gf",
              title: "Goals For",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "ga",
              title: "Goals Against",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "position_change",
              initialValue: "neither",
              type: "string",
              readOnly: true,
            }),
          ],
          // Preview configuration for league table entries
          preview: {
            select: {
              club: "club.name",
              points: "points",
              clubLogo: "club.image",
            },
            prepare({ club, points, clubLogo }) {
              return {
                title: `${club}`,
                subtitle: `Points: ${points}`,
                media: clubLogo,
              };
            },
          },
        }),
      ],
      // Initial value for league table populated with clubs
      initialValue: async () => await fetchAllClubs(),
    }),
    // Matchweeks field
    defineField({
      name: "matchweeks",
      title: "Matchweeks",
      type: "array",
      of: [
        // Array member definition for matchweeks
        defineArrayMember({
          type: "object",
          preview: {
            select: {
              name: "name",
            },
            prepare({ name }) {
              return {
                title: `${name}`,
                media: CalendarIcon,
              };
            },
          },
          fields: [
            defineField({
              name: "name",
              title: "Matchweek Name",
              type: "string",
              validation: (Rule) => Rule.required(),
              initialValue: async ({ parent }) => {
                try {
                  // Fetch all matchweeks within the current document
                  const matchweeks = await client.fetch(
                    `*[_type == "seasons" && _id == "${parent._id}"].matchweeks[*]`
                  );
                  const lastMatchweek = matchweeks.length + 1;
                  return `Matchweek ${lastMatchweek}`;
                } catch (error) {
                  console.error("Error fetching matchweeks:", error);
                  return "Matchweek 1"; // Fallback if fetching fails
                }
              },
            }),
            defineField({
              name: "startDate",
              title: "Start Date",
              type: "date",
              validation: (Rule) =>
                Rule.required().custom((startDate: any, context: any) => {
                  const endDate =
                    context?.document?.matchweeks?.[context.index]?.endDate;
                  if (endDate) {
                    const start = new Date(startDate).getTime();
                    const end = new Date(endDate).getTime();
                    if (end - start !== 6 * 24 * 60 * 60 * 1000) {
                      return "Matchweek must span exactly 7 days.";
                    }
                  }
                  return true;
                }),
              initialValue: getTodayDateISOString(),
            }),
            defineField({
              name: "endDate",
              title: "End Date",
              type: "date",
              validation: (Rule) =>
                Rule.required().custom((endDate: any, context: any) => {
                  const startDate =
                    context?.document?.matchweeks?.[context.index]?.startDate;
                  if (startDate) {
                    const start = new Date(startDate).getTime();
                    const end = new Date(endDate).getTime();
                    if (end - start !== 6 * 24 * 60 * 60 * 1000) {
                      return "Matchweek must span exactly 7 days.";
                    }
                  }
                  return true;
                }),
              initialValue: () =>
                addDaysToISOString(getTodayDateISOString(), 6), // End date 6 days after start date
            }),
            defineField({
              name: "days",
              title: "Days",
              type: "array",
              of: [
                // Array member definition for matchweek days
                defineArrayMember({
                  type: "object",
                  preview: {
                    select: {
                      datetime: "date",
                    },
                    prepare({ datetime }) {
                      return {
                        title: `${new Date(datetime).toLocaleString()}`,
                        media: CalendarIcon,
                      };
                    },
                  },
                  fields: [
                    defineField({
                      name: "date",
                      title: "Date",
                      type: "date",
                      validation: (Rule) =>
                        Rule.custom((date: any, context: any) => {
                          const matchweek =
                            context?.document?.matchweeks?.[context.index];
                          if (matchweek) {
                            const startDate = new Date(
                              matchweek.startDate
                            ).getTime();
                            const endDate = new Date(
                              matchweek.endDate
                            ).getTime();
                            const currentDate = new Date(date).getTime();
                            if (
                              currentDate < startDate ||
                              currentDate > endDate
                            ) {
                              return "Date must be within the matchweek date range.";
                            }
                          }
                          return true;
                        }),
                    }),
                    defineField({
                      name: "fixtures",
                      title: "Fixtures",
                      type: "array",
                      of: [
                        // Array member definition for fixtures
                        defineArrayMember({
                          type: "object",
                          fields: [
                            defineField({
                              name: "home_club",
                              title: "Home Club",
                              type: "reference",
                              to: [{ type: "clubs" }],
                            }),
                            defineField({
                              name: "away_club",
                              title: "Away Club",
                              type: "reference",
                              to: [{ type: "clubs" }],
                            }),
                            defineField({
                              name: "location",
                              title: "Location",
                              type: "string",
                            }),
                            defineField({
                              name: "score",
                              title: "Score",
                              type: "object",
                              fields: [
                                defineField({
                                  name: "home_score",
                                  title: "Home Club Score",
                                  type: "number",
                                  initialValue: 0,
                                }),
                                defineField({
                                  name: "away_score",
                                  title: "Away Club Score",
                                  type: "number",
                                  initialValue: 0,
                                }),
                              ],
                            }),
                            defineField({
                              name: "scheduled_date_time",
                              title: "Scheduled Date & Time",
                              type: "datetime",
                              validation: (Rule) => Rule.required(),
                            }),
                            defineField({
                              name: "live_mode",
                              type: "boolean",
                              title: "Live Mode",
                            }),
                          ],
                          // Preview configuration for fixtures
                          preview: {
                            select: {
                              home_club: "home_club.name",
                              away_club: "away_club.name",
                              datetime: "scheduled_date_time",
                            },
                            prepare({ home_club, away_club, datetime }) {
                              return {
                                title: `${home_club} vs ${away_club}`,
                                subtitle: `Scheduled: ${new Date(
                                  datetime
                                ).toLocaleString()}`,
                                media: ColorWheelIcon,
                              };
                            },
                          },
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
    }),
  ],
});

export default seasons;
