import { createClient } from "@sanity/client";

// function debounce(func: Function, delay: number) {
//   let timeoutId: NodeJS.Timeout;
//   return (...args: any) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => {
//       func(...args);
//     }, delay);
//   };
// }

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
  useCdn: false, // set to `false` to bypass the edge cache
  apiVersion: "2024-03-23", // use current date (YYYY-MM-DD) to target the latest API version
});

// For seasons

// function updatePositionChange(entries: any) {
//   entries.sort((a: any, b: any) => b.points - a.points);

//   entries.forEach((entry: any, index: number) => {
//     const previousIndex = index - 1;
//     if (previousIndex >= 0) {
//       const previousPoints = entries[previousIndex].points;
//       if (entry.points > previousPoints) {
//         entry.positionChange = "up";
//       } else if (entry.points < previousPoints) {
//         entry.positionChange = "down";
//       } else {
//         entry.positionChange = "neither";
//       }
//     }
//   });

//   return entries;
// }

// async function listenAndUpdatePositionChange() {
//   try {
//     const query = `*[_type == "seasons" && !(_id in path("drafts.**"))]`;
//     const seasons = await client.fetch(query);

//     seasons.forEach(async (season: any) => {
//       const entries = season.league_table;
//       const entriesWithUpdatedPosition = updatePositionChange(entries);

//       await client
//         .patch(season._id)
//         .set({ league_table: entriesWithUpdatedPosition })
//         .commit();

//       console.log(`Position changes updated for season ${season._id}`);
//     });
//   } catch (error) {
//     console.error("Error listening and updating position changes:", error);
//   }
// }

// const seasonsListener = client.listen('*[_type == "seasons"]');
// const debouncedUpdateSeasonsEntries = debounce(
//   listenAndUpdatePositionChange,
//   10000
// );

// seasonsListener.subscribe(debouncedUpdateSeasonsEntries);

// // Define a function to fetch latest references of news and video documents
// const fetchLatestReferences = async () => {
//   try {
//     const references = await client.fetch(
//       '*[_type in ["news", "video"] && !(_id in path("drafts.**"))] | order(_updatedAt desc) [0..4]',
//     );
//     return references.map((ref: any) => ({ _ref: ref._id, _key: ref._id }));
//   } catch (error) {
//     console.error("Error fetching latest references:", error);
//     return [];
//   }
// };
// // Define a function to update the banner document
// const updateBannerItems = async () => {
//   try {
//     const latestContent = await fetchLatestReferences();

//     // Update banner document with latest references
//     await client
//       .patch("8b7f0efe-d1e7-4f20-9520-38e38de135b1")
//       .set({ items: latestContent })
//       .commit();
//     console.log("Banner items updated successfully.");
//   } catch (error) {
//     console.error("Error updating banner items:", error);
//   }
// };

// // Set up listeners for news and video documents
// const newsListener = client.listen('*[_type == "news"]');
// const videoListener = client.listen('*[_type == "video"]');

// const debouncedUpdateBannerItems = debounce(updateBannerItems, 10000);
// // Listen for changes and update banner items accordingly
// newsListener.subscribe(debouncedUpdateBannerItems);
// videoListener.subscribe(debouncedUpdateBannerItems);
