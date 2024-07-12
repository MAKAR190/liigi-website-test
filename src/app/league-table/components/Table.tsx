"use client";
import { useEffect, useState } from "react";
import { Season } from "@/lib/queries";
import { urlForImage } from "@/lib/utils";
import { kanit, rowdies, inter } from "../../../fonts";
import Image from "next/image";
import { client } from "../../../../sanity";

interface PlayersPageProps {
  seasons: Season[];
  seasonParam: string;
}

const Table: React.FC<PlayersPageProps> = ({ seasons, seasonParam }) => {
  const [previousLeagueTable, setPreviousLeagueTable] = useState<{
    [key: string]: number;
  }>({});

  const searchSeason =
    seasons?.find((season) => season.season === seasonParam) ||
    seasons?.find((season) => season.main === true);

  const sortedLeagueTable = searchSeason?.league_table
    ?.slice()
    .sort((a, b) => b.points - a.points);

  const calculatePreviousSeason = (currentSeason: string) => {
    const [startYear, endYear] = currentSeason.split("/").map(Number);
    const previousStartYear = startYear - 1;
    const previousEndYear = endYear - 1;
    return `${previousStartYear}/${previousEndYear}`;
  };

  useEffect(() => {
    const fetchPreviousLeagueTable = async () => {
      try {
        const previousSeasonString = calculatePreviousSeason(
          searchSeason?.season ||
            seasons?.find((season) => season.main === true)?.season ||
            ""
        );
        const previousSeason = await client.fetch(
          `*[_type == "seasons" && season == $previousSeasonString][0]{
          league_table
        }`,
          { previousSeasonString }
        );
        const previousTable = previousSeason?.league_table || [];
        const previousTableMap: { [key: string]: number } = {};
        previousTable.forEach((entry: any, index: number) => {
          previousTableMap[entry.club._ref] = index + 1;
        });
        setPreviousLeagueTable(previousTableMap);
      } catch (error) {
        console.error("Error fetching previous league table:", error);
      }
    };

    if (searchSeason?.season) {
      fetchPreviousLeagueTable();
    }
  }, [seasonParam, searchSeason?.season]);

  const getPositionChange = (clubRef: string, currentIndex: number) => {
    const previousIndex = previousLeagueTable[clubRef];
    if (previousIndex === undefined || previousIndex === currentIndex) {
      return "neutral";
    }
    if (currentIndex < previousIndex) {
      return "up";
    }
    if (currentIndex > previousIndex) {
      return "down";
    }
    return "neutral";
  };

  useEffect(() => {
    const updatePositionChanges = async () => {
      if (!sortedLeagueTable) return;

      const updates = sortedLeagueTable.map((entry, index) => {
        const positionChange = getPositionChange(entry?.club?._ref, index + 1);
        return {
          ...entry,
          club: {
            _ref: entry?.club?._ref,
            _type: "reference",
          },
          position_change: positionChange,
        };
      });

      try {
        await client
          .patch(searchSeason?._id || "")
          .set({ league_table: updates })
          .commit();
      } catch (error) {
        console.error("Error updating position changes:", error);
      }
    };

    updatePositionChanges();
  }, [sortedLeagueTable]);

  return (
    <div className="my-5 overflow-x-auto">
      <table className="min-w-full bg-white border-collapse shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-xs leading-normal">
            <th className={`py-3 px-2 text-center ${kanit.className}`}>
              Position
            </th>
            <th className={`py-3 px-7 text-left ${kanit.className}`}>Club</th>
            <th className={`py-3 px-2 text-center ${kanit.className}`}>
              Played
            </th>
            <th className={`py-3 px-2 text-center ${kanit.className}`}>Won</th>
            <th className={`py-3 px-2 text-center ${kanit.className}`}>
              Drawn
            </th>
            <th className={`py-3 px-2 text-center ${kanit.className}`}>Lost</th>
            <th className={`py-3 px-2 text-center ${kanit.className}`}>GF</th>
            <th className={`py-3 px-2 text-center ${kanit.className}`}>GA</th>
            <th className={`py-3 px-2 text-center ${kanit.className}`}>
              Points
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sortedLeagueTable?.map((entry, index) => {
            const positionChange = getPositionChange(
              entry?.club?._ref,
              index + 1
            );
            return (
              <tr
                key={entry?._key}
                className="border-b border-gray-200 hover:bg-gray-100 group "
              >
                <td
                  className={`py-3 px-2 text-center ${rowdies.className} text-black`}
                >
                  <div className="flex items-center justify-center">
                    {index + 1}
                    {positionChange === "up" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3.5}
                        stroke="green"
                        className="size-3 ml-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    )}
                    {positionChange === "down" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3.5}
                        stroke="red"
                        className="size-3 ml-4 rotate-180"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    )}
                    {positionChange === "neutral" && (
                      <div className="w-1 h-1 rounded-full bg-slate-400 ml-4" />
                    )}
                  </div>
                </td>
                <td className="py-3 px-6 text-left min-w-[200px] flex items-center">
                  <Image
                    width={40}
                    height={40}
                    quality={100}
                    src={
                      (entry?.club?.image &&
                        urlForImage(entry?.club?.image)?.url()) ||
                      ""
                    }
                    alt={entry?.club?.name}
                    title={entry?.club?.name}
                  />
                  <h6 className="ml-2 font-bold text-primary group-hover:underline underline-offset-1 cursor-pointer">
                    <a href={entry?.club?.link} target="_blank">
                      {entry?.club?.name}
                    </a>
                  </h6>
                </td>
                <td className={`py-3 px-4 text-center ${inter.className}`}>
                  {entry?.played}
                </td>
                <td className={`py-3 px-3 text-center ${inter.className}`}>
                  {entry?.won}
                </td>
                <td className={`py-3 px-3 text-center ${inter.className}`}>
                  {entry?.drawn}
                </td>
                <td className={`py-3 px-3 text-center ${inter.className}`}>
                  {entry?.lost}
                </td>
                <td className={`py-3 px-3 text-center ${inter.className}`}>
                  {entry?.gf}
                </td>
                <td className={`py-3 px-3 text-center ${inter.className}`}>
                  {entry?.ga}
                </td>
                <td
                  className={`py-3 px-3 text-center font-bold  ${rowdies.className}`}
                >
                  {entry?.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
