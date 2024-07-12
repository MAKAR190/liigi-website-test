"use client";

import { useState, useEffect } from "react";
import { Fixture, Matchweek, Season } from "@/lib/queries";
import { urlForImage } from "@/lib/utils";
import { kanit, rowdies, inter, montserrat } from "../../../fonts";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";

interface PlayersPageProps {
  seasons: Season[];
  seasonParam: string;
  matchweekParam: string;
}

const Table: React.FC<PlayersPageProps> = ({
  seasons,
  seasonParam,
  matchweekParam,
}) => {
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [fixturesToShow, setFixturesToShow] = useState<Fixture[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [matchweeks, setMatchweeks] = useState<Matchweek[]>([]);
  const [noFixtures, setNoFixtures] = useState(false);

  const fixturesPerPage = 10;

  // Find the matching season based on seasonParam
  const searchSeason =
    seasons?.find((season) => season.season === seasonParam) ||
    seasons?.find((season) => season.main === true);

  // Load matchweeks based on season and matchweekParam
  useEffect(() => {
    setIsLoading(true);

    let allMatchweeks = [];

    if (!matchweekParam || matchweekParam === "all matchweeks") {
      allMatchweeks = searchSeason?.matchweeks || [];
    } else {
      const selectedMatchweek = searchSeason?.matchweeks?.find(
        (matchweek) =>
          matchweek.name.toLowerCase() === matchweekParam.toLowerCase()
      );
      allMatchweeks = selectedMatchweek ? [selectedMatchweek] : [];
    }

    setMatchweeks(allMatchweeks);
    setFixturesToShow([]);
    setCurrentPage(1);
    setHasMore(true);
    setIsLoading(false);

    // Check if there are no fixtures
    const hasNoFixtures =
      allMatchweeks.length === 0 ||
      allMatchweeks.every((mw) => !mw.days?.length);
    setNoFixtures(hasNoFixtures);
  }, [seasons, seasonParam, matchweekParam]);

  // Load initial fixtures when matchweeks change
  useEffect(() => {
    if (matchweeks.length > 0) {
      loadInitialFixtures();
    }
  }, [matchweeks]);

  // Function to load initial fixtures
  const loadInitialFixtures = () => {
    const initialFixturesToShow = matchweeks
      .flatMap(
        (matchweek) => matchweek.days?.flatMap((day) => day.fixtures) || []
      )
      .slice(0, fixturesPerPage);

    setFixturesToShow(initialFixturesToShow);
    setCurrentPage(1);
    setHasMore(initialFixturesToShow.length === fixturesPerPage);
  };

  // Function to load more fixtures
  const loadMoreFixtures = () => {
    const startIndex = currentPage * fixturesPerPage;
    const endIndex = startIndex + fixturesPerPage;

    const newFixturesToShow = matchweeks
      .flatMap(
        (matchweek) => matchweek.days?.flatMap((day) => day.fixtures) || []
      )
      .slice(startIndex, endIndex);

    setFixturesToShow((prevFixtures) => [
      ...prevFixtures,
      ...newFixturesToShow,
    ]);
    setCurrentPage((prevPage) => prevPage + 1);
    setHasMore(newFixturesToShow.length === fixturesPerPage);
  };

  const isMatchStarted = (scheduledDateTime: any) => {
    const now = new Date();
    return new Date(scheduledDateTime) <= now;
  };

  const groupFixturesByDay = (fixtures: Fixture[]) => {
    return fixtures.reduce((groupedFixtures, fixture) => {
      const date = new Date(fixture.scheduled_date_time).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
        }
      );
      if (!groupedFixtures[date]) {
        groupedFixtures[date] = [];
      }
      groupedFixtures[date].push(fixture);
      return groupedFixtures;
    }, {} as { [key: string]: Fixture[] });
  };

  return (
    <div className="bg-white border-gray-100 border-[1px] p-3">
      {noFixtures ? (
        <p className="text-center font-semibold my-5">
          No fixtures found for this matchweek
        </p>
      ) : (
        <InfiniteScroll
          dataLength={fixturesToShow.length}
          next={loadMoreFixtures}
          hasMore={hasMore}
          loader={<div></div>}
        >
          {Object.entries(groupFixturesByDay(fixturesToShow)).map(
            ([date, fixtures]) => (
              <div key={date}>
                <h2
                  className={`${montserrat.className} text-lg font-bold mb-4 ml-20 mt-10`}
                >
                  {date}
                </h2>
                {fixtures.map((fixture: Fixture) => (
                  <div key={fixture._key} className="group">
                    <div className="grid grid-cols-3 place-items-center hover:bg-primary group relative w-full border-b py-4">
                      <div className="flex items-center justify-center col-span-1">
                        <Image
                          width={40}
                          height={40}
                          quality={100}
                          src={
                            (fixture.home_club?.image &&
                              urlForImage(fixture.home_club.image)?.url()) ||
                            ""
                          }
                          alt={fixture.home_club?.name}
                          title={fixture.home_club?.name}
                          className="mr-4"
                        />
                        <span
                          className={`mr-2 font-bold text-green-primary group-hover:text-white  hover:underline  ${kanit.className}`}
                        >
                          <a target="_blank" href={fixture.home_club.link}>
                            {fixture.home_club?.name}
                          </a>
                        </span>
                        <span
                          className={`${inter.className} text-gray-500 group-hover:text-gray-200 `}
                        >
                          vs
                        </span>
                        <span
                          className={`ml-2 font-bold text-green-primary group-hover:text-white hover:underline ${kanit.className}`}
                        >
                          <a target="_blank" href={fixture.away_club.link}>
                            {fixture.away_club?.name}
                          </a>
                        </span>
                        <Image
                          width={40}
                          height={40}
                          quality={100}
                          src={
                            (fixture.away_club?.image &&
                              urlForImage(fixture.away_club.image)?.url()) ||
                            ""
                          }
                          alt={fixture.away_club?.name}
                          title={fixture.away_club?.name}
                          className="ml-4"
                        />
                      </div>
                      <div className="flex items-center  group-hover:text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 1 1 1 8.965 3.525"
                          />
                        </svg>
                        <h6 className="col-span-1 ml-2">{fixture.location}</h6>
                      </div>
                      <div className="flex flex-col items-end col-span-1">
                        <span
                          className={`text-sm text-gray-600 group-hover:text-gray-200  ${
                            rowdies.className
                          } ${
                            isMatchStarted(fixture.scheduled_date_time) &&
                            "line-through"
                          }`}
                        >
                          {new Date(
                            fixture.scheduled_date_time
                          ).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </span>
                        {fixture.score &&
                          (isMatchStarted(fixture.scheduled_date_time) ||
                            fixture.live_mode) && (
                            <span
                              className={`font-bold ${rowdies.className} text-lg  group-hover:text-secondary `}
                            >
                              {fixture.score.home_score} -{" "}
                              {fixture.score.away_score}
                            </span>
                          )}
                        {fixture.live_mode && (
                          <span className="text-white bg-red-500 font-bold text-sm uppercase absolute right-0 bottom-0 px-3">
                            Live
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Table;
