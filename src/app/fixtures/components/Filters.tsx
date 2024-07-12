"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components";
import { rowdies } from "../../../fonts";
import { Season } from "@/lib/queries";

interface Props {
  seasons: Season[];
}

const TableFilters = ({ seasons }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Find the season where main is true
  const mainSeason =
    seasons.find((season: Season) => season.main)?.season || seasons[0].season;

  // Rearrange options to place mainSeason first
  const sortedSeasons = [
    mainSeason,
    ...seasons
      .map((season: Season) => season.season)
      .filter((season) => season !== mainSeason),
  ];

  const [selectedSeason, setSelectedSeason] = useState(
    searchParams.get("season") || mainSeason
  );

  // Initialize selectedMatchweek with capitalized first letter from query params or default to "All Matchweeks"
  const initialSelectedMatchweek = searchParams.get("matchweek")
    ? searchParams.get("matchweek")!.charAt(0).toUpperCase() +
      searchParams.get("matchweek")!.slice(1)
    : "All Matchweeks";

  const [selectedMatchweek, setSelectedMatchweek] = useState(
    initialSelectedMatchweek
  );

  const sortedMatchweeks = [
    "All Matchweeks",
    ...(seasons
      .find((seasonEl: any) => seasonEl.season === selectedSeason)
      ?.matchweeks?.map(
        (matchweek) =>
          matchweek.name.charAt(0).toUpperCase() + matchweek.name.slice(1)
      ) || []),
  ];

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    updateQueryString(season, selectedMatchweek.toLowerCase()); // Update query string here
  };

  const handleMatchweekChange = (matchweek: string) => {
    setSelectedMatchweek(matchweek); // Set selected matchweek with capitalized first letter
    updateQueryString(selectedSeason, matchweek.toLowerCase()); // Update query string here with lowercase matchweek
  };

  const resetFilters = () => {
    handleSeasonChange(mainSeason); // Reset season
    handleMatchweekChange("All Matchweeks"); // Reset matchweek
  };

  const updateQueryString = (season?: string, matchweek?: string) => {
    const params = new URLSearchParams(window.location.search);
    if (season?.length) {
      params.set("season", season);
    }
    if (matchweek?.length) {
      params.set("matchweek", matchweek);
    }
    router.push(`/fixtures?${params.toString()}`);
  };

  return (
    <div className="max-[570px]:w-full w-[90%] mx-auto h-fit border-gray-100 border-[1px] py-5">
      <div className="flex max-[570px]:items-start max-[570px]:flex-col-reverse md:flex-row lg:flex-row xl:flex-row xxl:flex-row justify-between items-center mx-5">
        <div className="w-fit flex flex-row">
          <div className="ml-5">
            <Select
              label="Filter By Season"
              options={sortedSeasons}
              selected={selectedSeason}
              onChange={handleSeasonChange}
            />
          </div>
          <div className="ml-5">
            <Select
              label="Filter By Matchweek"
              options={sortedMatchweeks}
              selected={selectedMatchweek}
              onChange={handleMatchweekChange}
            />
          </div>
        </div>
        <div
          onClick={resetFilters} // Use resetFilters function directly
          className="flex group justify-around max-w-[138px] min-w-[138px] cursor-pointer max-[570px]:mb-5 mx-5" // Added mx-5 for spacing
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 group-hover:stroke-green-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <h6 className={`group-hover:text-green-500 ${rowdies.className}`}>
            Reset Filters
          </h6>
        </div>
      </div>
    </div>
  );
};

export default TableFilters;
