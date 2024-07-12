"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components";

import { rowdies } from "../../../fonts";
import { Season } from "@/lib/queries";

const PlayerFilters = ({ clubs, seasons }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedClub, setSelectedClub] = useState(
    searchParams.get("club") || "All Clubs"
  );
  const mainSeason =
    seasons.find((season: Season) => season.main)?.season || seasons[0].season;
  const [selectedSeason, setSelectedSeason] = useState(
    searchParams.get("season") || mainSeason
  );

  const sortedSeasons = [
    mainSeason,
    ...seasons
      .map((season: Season) => season.season)
      .filter((season: any) => season !== mainSeason),
  ];
  const handleClubChange = (club: string) => {
    setSelectedClub(club);
    updateQueryString(club, selectedSeason);
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    updateQueryString(selectedClub, season);
  };

  const updateQueryString = (club: string, season: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("club", club);
    params.set("season", season);
    router.push(`/players?${params.toString()}`);
  };

  return (
    <div className="max-[570px]:w-full w-[90%] mx-auto h-fit border-gray-100 border-[1px] py-5">
      <div className="flex max-[570px]:items-start max-[570px]:flex-col-reverse md:flex-row lg:flex-row xl:flex-row xxl:flex-row justify-between items-center mx-5">
        <div className="w-fit flex flex-row ">
          <Select
            label="Filter By Club"
            options={["All Clubs", ...clubs.map((club: any) => club.name)]}
            selected={selectedClub}
            onChange={handleClubChange}
          />
          <div className="ml-5" />
          <Select
            label="Filter By Season"
            options={sortedSeasons}
            selected={selectedSeason}
            onChange={handleSeasonChange}
          />
        </div>
        <div
          onClick={() => {
            handleClubChange("All Clubs");
            handleSeasonChange("2024/2025");
          }}
          className="flex group justify-around max-w-[138px] min-w-[138px] cursor-pointer max-[570px]:mb-5"
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

export default PlayerFilters;
