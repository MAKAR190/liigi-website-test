import { Carousel, NewsList, Footer, VideoMark, Tabs } from "../components";
import Image from "next/image";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("../components/Header"), {
  ssr: true,
});
import Link from "next/link";
import { kanit, kanit_bold, rowdies, montserrat, inter } from "../fonts";
import { sanityFetch } from "@/lib/fetch";
import {
  navQuery,
  clubsQuery,
  generalQuery,
  bannerQuery,
  sponsorsQuery,
  newsQuery,
  videoQuery,
  footerQuery,
  socialQuery,
  policiesQuery,
  Video,
  News,
  navResponse,
  BannerResponse,
  Sponsor,
  seasonsQuery,
  Season,
  Matchweek,
} from "@/lib/queries";
import { urlForImage } from "@/lib/utils";
import React from "react";
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 8,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
  },
};

function createSlug(category: string, slug: string, type: string) {
  return `/${type}/${
    category?.charAt(0).toLowerCase() + category?.slice(1, category.length)
  }/${slug}`;
}

export default async function Home() {
  const [
    nav,
    clubs,
    general,
    banner,
    sponsors,
    news,
    video,
    footer,
    social,
    policies,
    seasons,
  ] = await Promise.all([
    sanityFetch<navResponse>({
      query: navQuery,
    }),
    sanityFetch({
      query: clubsQuery,
    }),
    sanityFetch({
      query: generalQuery,
    }),
    sanityFetch<BannerResponse>({
      query: bannerQuery,
    }),
    sanityFetch<Sponsor[]>({
      query: sponsorsQuery,
    }),
    sanityFetch<News[]>({
      query: newsQuery,
    }),
    sanityFetch<Video[]>({
      query: videoQuery,
    }),
    sanityFetch({
      query: footerQuery,
    }),
    sanityFetch({
      query: socialQuery,
    }),
    sanityFetch({
      query: policiesQuery,
    }),
    sanityFetch<Season[]>({
      query: seasonsQuery,
    }),
  ]);
  const home = nav.pages.find((p) => p.id === "home");
  const currentSeason = seasons?.find((season) => season.main == true);
  let closestMatchweek: Matchweek | null = null;
  const sortedLeagueTable = currentSeason?.league_table
    ?.slice()
    .sort((a, b) => b.points - a.points);

  if (currentSeason) {
    // Sort matchweeks by startDate
    currentSeason.matchweeks?.sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateA - dateB;
    });

    // Find the closest matchweek based on current date or nearest future matchweek
    const currentDate = new Date().getTime();

    for (let i = 0; i < currentSeason.matchweeks?.length; i++) {
      const matchweek = currentSeason.matchweeks[i];
      const startDate = new Date(matchweek.startDate).getTime();
      const endDate = new Date(matchweek.endDate).getTime();

      // Check if current date is within matchweek's date range
      if (currentDate >= startDate && currentDate <= endDate) {
        closestMatchweek = matchweek;
        break;
      } else if (currentDate < startDate) {
        // If current date is before the start of this matchweek
        closestMatchweek = matchweek;
        break;
      }
    }

    // Sort days within the closest matchweek by date
    if (closestMatchweek) {
      closestMatchweek.days.sort((dayA, dayB) => {
        const dateA = new Date(dayA.date).getTime();
        const dateB = new Date(dayB.date).getTime();
        return dateA - dateB;
      });
    }
  }

  const isMatchStarted = (scheduledDateTime: any) => {
    const now = new Date();
    return new Date(scheduledDateTime) <= now;
  };

  const maxFixtures =
    typeof window !== "undefined" && window.innerWidth >= 1024 ? 7 : 10;

  const allFixtures = closestMatchweek?.days
    .flatMap((day) =>
      day.fixtures.map((fixture) => ({
        ...fixture,
        date: day.date,
      }))
    )
    .slice(0, maxFixtures);

  const tabs = [
    {
      title: "News",
      value: "news",
      content: (
        <div className="flex">
          <div className="flex-1">
            <div>
              <div />
              <section
                id="banner"
                className="sm:p-0 md:px-5 md:py-5 lg:px-5 lg:py-5 xl:px-5 xl:py-5 w-full h-fit relative"
              >
                <Image
                  alt="banner"
                  src={
                    (banner.background &&
                      urlForImage(banner.background)?.url()) ||
                    ""
                  }
                  fill
                  quality={100}
                />
                <div className="grid sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 gap-4 h-fit">
                  {/* Big element */}
                  <div className="col-span-2 row-span-1 max-h-[835px] h-full relative z-0 sm:border-0 sm:rounded-none sm:w-full bg-white rounded-[4px] border-[1px] border-black group">
                    <div className="flex flex-col h-full justify-between items-start">
                      <div className="sm:py-0 md:py-10 lg:py-10 xl:py-10">
                        <h6
                          className={`text-sm font-semibold py-2 ${rowdies.className} text-primary px-5`}
                        >
                          {banner.items[0].category?.title}
                        </h6>
                        <Link
                          href={createSlug(
                            banner.items[0].category?.title,
                            banner.items[0].slug.current,
                            banner.items[0]._type
                          )}
                        >
                          <h2
                            className={`px-5 group-hover:underline xl:text-5xl md:text-4xl sm:text-3xl lg:text-5xl py-5 font-bold ${kanit_bold.className}`}
                          >
                            {banner.items[0].title}
                          </h2>
                        </Link>
                        <p
                          className={`${montserrat.className} py-3 text-sm px-5`}
                        >
                          {banner.items[0].short_description}
                        </p>
                        <Link
                          href={createSlug(
                            banner.items[0].category?.title,
                            banner.items[0].slug.current,
                            banner.items[0]._type
                          )}
                        >
                          <button
                            className={`mx-5 mt-10 text-center text-black bg-white border-black border-2 outline-none duration-[0.1s] hover:text-white hover:bg-black hover:border-white text-md ${inter.className} xl:px-6 lg:px-6 md:px-5 sm:px-4 xl:py-3 lg:py-3 md:py-3 sm:py-2 rounded-[4px]`}
                          >
                            More
                          </button>
                        </Link>
                      </div>
                      <Link
                        href={createSlug(
                          banner.items[0].category?.title,
                          banner.items[0].slug.current,
                          banner.items[0]._type
                        )}
                      >
                        <div className="w-full h-full relative sm:mt-5 md:mt-0 xl:mt-0 lg:mt-0 overflow-hidden cursor-pointer">
                          <img
                            src={
                              banner.items[0]._type === "video"
                                ? `${
                                    banner.items[0]?.video?.preview &&
                                    urlForImage(
                                      banner.items[0]?.video?.preview
                                    )?.url()
                                  }`
                                : `${
                                    banner.items[0].preview &&
                                    urlForImage(banner.items[0].preview)?.url()
                                  }`
                            }
                            alt={banner.items[0]?.title}
                            className="bg-no-repeat w-screen max-h-[400px] duration-[0.3s] h-full object-cover bg-center hover:scale-110"
                          />
                          {banner.items[0]._type == "video" && (
                            <VideoMark url={banner.items[0]?.video?.url} />
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="sm:hidden md:grid col-span-1 grid-cols-1 xl:grid lg:grid gap-4 h-full">
                    {banner.items.slice(1, 3).map((item, i) => (
                      <div
                        key={item.slug.current}
                        className="bg-white relative rounded-[4px] border-[1px] border-black overflow-hidden max-h-[410px] min-h-[410px]"
                      >
                        <div className="flex flex-col items-start px-4 py-5 group">
                          <h6
                            className={`text-sm font-semibold ${rowdies.className} text-primary`}
                          >
                            {item.category?.title}
                          </h6>
                          <Link
                            href={createSlug(
                              item.category?.title,
                              item.slug?.current,
                              item._type
                            )}
                          >
                            <h2
                              className={`group-hover:underline text-2xl cursor-pointer py-3 font-bold ${kanit.className}`}
                            >
                              {item.title}
                            </h2>
                          </Link>
                          <Link
                            href={createSlug(
                              item.category?.title,
                              item.slug?.current,
                              item._type
                            )}
                          >
                            <button
                              className={`mt-3 duration-[0.1s] flex items-center text-md ${inter.className}`}
                            >
                              More
                              <Image
                                className={
                                  "ml-3 -rotate-90 group-hover:ml-4 duration-[0.1s]"
                                }
                                src={"/black-arrow-down.svg"}
                                alt={"arrow-down"}
                                width={15}
                                height={15}
                              />
                            </button>
                          </Link>
                        </div>
                        <Link
                          href={createSlug(
                            item.category?.title,
                            item.slug?.current,
                            item._type
                          )}
                        >
                          <div className="overflow-hidden h-full">
                            <img
                              src={
                                item._type === "video"
                                  ? `${
                                      item?.video?.preview &&
                                      urlForImage(item?.video?.preview)?.url()
                                    }`
                                  : `${
                                      item.preview &&
                                      urlForImage(item.preview)?.url()
                                    }`
                              }
                              alt={item?.title}
                              className="bg-no-repeat w-full duration-[0.3s]  h-[258px]  object-cover bg-center hover:scale-110"
                            />
                            {item._type == "video" && (
                              <VideoMark url={item?.video?.url} />
                            )}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Table",
      value: "table",
      content: (
        <div className="w-full">
          <div className="animated-gradient relative group">
            <Link href={"/league-table"}>
              <h2
                className={`text-center group-hover:underline cursor-pointer text-white xl:text-4xl md:text-4xl sm:text-3xl lg:text-4xl py-5 font-bold ${kanit_bold.className}`}
              >
                Liigi League
              </h2>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="size-6 absolute right-2 top-[40%] rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                />
              </svg>
            </Link>
          </div>
          <div className="bg-white">
            <table className="min-w-full bg-white border-collapse shadow-md">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-xs leading-normal">
                  <th className={`py-3 px-2 text-center ${kanit.className}`}>
                    Pos
                  </th>
                  <th className={`py-3 px-7 text-left ${kanit.className}`}>
                    Club
                  </th>
                  <th className={`py-3 px-2 text-center ${kanit.className}`}>
                    Pl
                  </th>
                  <th className={`py-3 px-2 text-center ${kanit.className}`}>
                    GD
                  </th>
                  <th className={`py-3 px-2 text-center ${kanit.className}`}>
                    Pts
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {sortedLeagueTable?.map((entry, index) => (
                  <tr
                    key={entry?._key}
                    className="border-b border-gray-200 hover:bg-gray-100 group"
                  >
                    <td
                      className={`py-3 px-0 text-center whitespace-nowrap ${rowdies.className} text-black`}
                    >
                      {index + 1}.
                    </td>
                    <td className="py-2 px-6 text-center flex items-center">
                      <Image
                        width={25}
                        height={20}
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
                    <td className={`py-3 px-6 text-center ${inter.className}`}>
                      {entry?.played}
                    </td>
                    <td
                      className={`py-3 px-6 ${
                        entry?.gf - entry?.ga < 0
                          ? "text-red-500"
                          : entry?.gf - entry?.ga > 0
                          ? "text-green-500"
                          : ""
                      }  text-center ${inter.className}`}
                    >
                      {entry?.gf - entry?.ga < 0
                        ? "-"
                        : entry?.gf - entry?.ga > 0
                        ? "+"
                        : ""}
                      {entry?.gf - entry?.ga}
                    </td>
                    <td
                      className={`py-3 px-6 text-center font-bold  ${rowdies.className}`}
                    >
                      {entry?.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      title: "Matchweek",
      value: "matchweek",
      content: (
        <div className="w-full">
          <div className="animated-gradient relative group">
            <Link
              href={`/fxtures?matchweek=${closestMatchweek?.name.toLowerCase()}`}
            >
              <h2
                className={`text-center group-hover:underline cursor-pointer text-white xl:text-4xl md:text-4xl sm:text-3xl lg:text-4xl py-5 font-bold ${kanit_bold.className}`}
              >
                {closestMatchweek?.name}
              </h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="size-6 absolute right-2 top-[40%] rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                />
              </svg>
            </Link>
          </div>
          <div className="bg-white pt-3 shadow-md">
            {allFixtures?.map((fixture, index) => (
              <div key={fixture._key}>
                {index === 0 || fixture.date !== allFixtures[index - 1].date ? (
                  <div className="flex items-start">
                    <h2
                      className={`${kanit_bold.className} text-xl ml-4 font-bold mb-4 mt-1 h-[30px]`}
                    >
                      {new Date(fixture.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h2>
                  </div>
                ) : null}
                <div
                  className={`flex hover:bg-primary group items-center justify-between border-b ${
                    fixture.live_mode ? "py-4" : "py-3"
                  } px-3`}
                >
                  <div className="flex items-center">
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
                      className={`mr-2 font-bold text-green-primary group-hover:text-white group-hover:underline ${kanit.className}`}
                    >
                      <a href={fixture.home_club.link} target="_blank">
                        {fixture.home_club?.name}
                      </a>
                    </span>
                    <span
                      className={`${inter.className} text-gray-500 group-hover:text-gray-200`}
                    >
                      vs
                    </span>
                    <span
                      className={`ml-2 font-bold group-hover:text-white group-hover:underline text-green-primary ${kanit.className}`}
                    >
                      <a href={fixture.away_club.link} target="_blank">
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
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-sm text-gray-600 group-hover:text-gray-200 ${
                        rowdies.className
                      } ${
                        isMatchStarted(fixture.scheduled_date_time) &&
                        "line-through"
                      }`}
                    >
                      {new Date(fixture.scheduled_date_time).toLocaleTimeString(
                        "en-GB",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }
                      )}
                    </span>
                    {fixture.score &&
                      (isMatchStarted(fixture.scheduled_date_time) ||
                        fixture.live_mode) && (
                        <span
                          className={`font-bold ${rowdies.className} group-hover:text-secondary text-lg`}
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
            <Link
              href={`/fixtures?matchweek=${closestMatchweek?.name.toLowerCase()}`}
            >
              <button
                className={`text-center w-full text-black bg-white border-black border-2 outline-none duration-[0.1s] hover:text-white hover:bg-black hover:border-white  text-md font-sans-[${inter.className}] px-6 py-3`}
              >
                View More
              </button>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  // @ts-ignore
  return (
    <>
      <Header pageId={"home"} logo={general} clubs={clubs} menuItems={nav} />
      <main className="mt-[160px]">
        {home?.page_sections?.map((section) => (
          <>
            {section.visible && (
              <>
                {section?.id === "banner" && (
                  <>
                    <div className="sm:flex md:flex lg:hidden xl:hidden xxl:hidden sm:h-[40rem] md:h-[49rem]  [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40">
                      <Tabs tabs={tabs} />
                    </div>
                    <div className="sm:hidden md:hidden lg:flex xl:flex xxl:flex">
                      <div>
                        <div>
                          <div />
                          <section
                            id="banner"
                            key={section.id}
                            className="sm:p-0 md:px-5 md:py-5 lg:px-5 lg:py-5 xl:px-5 xl:py-5 w-full h-fit relative"
                          >
                            <Image
                              alt="banner"
                              src={
                                (banner.background &&
                                  urlForImage(banner.background)?.url()) ||
                                ""
                              }
                              fill
                            />
                            <div className="grid sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 gap-4 h-fit">
                              {/* Big element */}
                              <div className="col-span-2 row-span-1 max-h-[835px]  h-full relative z-0 sm:border-0 sm:rounded-none sm:w-full bg-white rounded-[4px] border-[1px] border-black group">
                                <div className="flex flex-col h-full  justify-between items-start">
                                  <div className="sm:py-0 md:py-10 lg:py-10 xl:py-10">
                                    <h6
                                      className={`text-sm font-semibold py-2 ${rowdies.className} text-primary px-5`}
                                    >
                                      {banner.items[0].category?.title}
                                    </h6>
                                    <Link
                                      href={createSlug(
                                        banner.items[0].category?.title,
                                        banner.items[0].slug.current,
                                        banner.items[0]._type
                                      )}
                                    >
                                      <h2
                                        className={`px-5 group-hover:underline xl:text-5xl md:text-4xl sm:text-3xl lg:text-5xl py-5 font-bold ${kanit_bold.className}`}
                                      >
                                        {banner.items[0].title}
                                      </h2>
                                    </Link>
                                    <p
                                      className={`${montserrat.className} py-3 text-sm px-5`}
                                    >
                                      {banner.items[0].short_description}
                                    </p>
                                    <Link
                                      href={createSlug(
                                        banner.items[0].category?.title,
                                        banner.items[0].slug.current,
                                        banner.items[0]._type
                                      )}
                                    >
                                      <button
                                        className={`mx-5 mt-10 text-center text-black bg-white border-black border-2 outline-none duration-[0.1s] hover:text-white hover:bg-black hover:border-white text-md ${inter.className} xl:px-6 lg:px-6 md:px-5 sm:px-4 xl:py-3 lg:py-3 md:py-3 sm:py-2 rounded-[4px]`}
                                      >
                                        More
                                      </button>
                                    </Link>
                                  </div>
                                  <Link
                                    href={createSlug(
                                      banner.items[0].category?.title,
                                      banner.items[0].slug.current,
                                      banner.items[0]._type
                                    )}
                                  >
                                    <div className="w-full h-full relative sm:mt-5 md:mt-0 xl:mt-0 lg:mt-0 overflow-hidden cursor-pointer">
                                      <img
                                        src={
                                          banner.items[0]._type === "video"
                                            ? `${
                                                banner.items[0]?.video
                                                  ?.preview &&
                                                urlForImage(
                                                  banner.items[0]?.video
                                                    ?.preview
                                                )?.url()
                                              }`
                                            : `${
                                                banner.items[0].preview &&
                                                urlForImage(
                                                  banner.items[0].preview
                                                )?.url()
                                              }`
                                        }
                                        alt={banner.items[0]?.title}
                                        className="bg-no-repeat w-screen max-h-[400px] duration-[0.3s] h-full object-cover bg-center hover:scale-110"
                                      />
                                      {banner.items[0]._type == "video" && (
                                        <VideoMark
                                          url={banner.items[0]?.video?.url}
                                        />
                                      )}
                                    </div>
                                  </Link>
                                </div>
                              </div>
                              <div className="sm:hidden md:grid col-span-1 grid-cols-1 xl:grid lg:grid gap-4 h-full">
                                {banner.items.slice(1, 3).map((item, i) => (
                                  <div
                                    key={item.slug.current}
                                    className="bg-white relative rounded-[4px] border-[1px] border-black overflow-hidden max-h-[410px] min-h-[410px]"
                                  >
                                    <div className="flex flex-col items-start px-4 py-5 group">
                                      <h6
                                        className={`text-sm font-semibold ${rowdies.className} text-primary`}
                                      >
                                        {item.category?.title}
                                      </h6>
                                      <Link
                                        href={createSlug(
                                          item.category?.title,
                                          item.slug?.current,
                                          item._type
                                        )}
                                      >
                                        <h2
                                          className={`group-hover:underline text-2xl cursor-pointer py-3 font-bold ${kanit.className}`}
                                        >
                                          {item.title}
                                        </h2>
                                      </Link>
                                      <Link
                                        href={createSlug(
                                          item.category?.title,
                                          item.slug?.current,
                                          item._type
                                        )}
                                      >
                                        <button
                                          className={`mt-3 duration-[0.1s] flex items-center text-md ${inter.className}`}
                                        >
                                          More
                                          <Image
                                            className={
                                              "ml-3 -rotate-90 group-hover:ml-4 duration-[0.1s]"
                                            }
                                            src={"/black-arrow-down.svg"}
                                            alt={"arrow-down"}
                                            width={15}
                                            height={15}
                                          />
                                        </button>
                                      </Link>
                                    </div>
                                    <Link
                                      href={createSlug(
                                        item.category?.title,
                                        item.slug?.current,
                                        item._type
                                      )}
                                    >
                                      <div className="overflow-hidden h-full">
                                        <img
                                          src={
                                            item._type === "video"
                                              ? `${
                                                  item?.video?.preview &&
                                                  urlForImage(
                                                    item?.video?.preview
                                                  )?.url()
                                                }`
                                              : `${
                                                  item.preview &&
                                                  urlForImage(
                                                    item.preview
                                                  )?.url()
                                                }`
                                          }
                                          alt={item?.title}
                                          className="bg-no-repeat w-full duration-[0.3s]  h-[258px]  object-cover bg-center hover:scale-110"
                                        />
                                        {item._type == "video" && (
                                          <VideoMark url={item?.video?.url} />
                                        )}
                                      </div>
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </section>
                        </div>
                        <section className="py-3 grid">
                          <p className="text-center sm:mt-5 text-lg font-semibold py-5">
                            Official Sponsors
                          </p>
                          <Carousel
                            responsive={responsive}
                            containerClassName={"w-full mx-auto"}
                            arrowsDesktop={false}
                            itemClass={"running-line-animation sponsor"}
                          >
                            {sponsors?.length < 8
                              ? Array.from({
                                  length: 8 - (sponsors?.length || 0),
                                }).map((_, index) => (
                                  <div
                                    key={`duplicate-${index}`}
                                    className="flex flex-col justify-center items-center w-fit h-fit mx-1"
                                  >
                                    <img
                                      src={urlForImage(
                                        sponsors[sponsors.length - 1].image
                                      )?.url()}
                                      alt={sponsors[sponsors.length - 1].kind}
                                      title={sponsors[sponsors.length - 1].kind}
                                      className="min-w-[150px] min-h-[20px] "
                                    />
                                    <p
                                      className={`${montserrat.className} text-sm pt-2 `}
                                    >
                                      {sponsors[sponsors.length - 1].kind}
                                    </p>
                                  </div>
                                ))
                              : sponsors?.map((sponsor) => (
                                  <div
                                    key={sponsor._id}
                                    className="flex justify-center flex-col items-center w-[150px] h-[150px]"
                                  >
                                    <img
                                      src={
                                        sponsor.image &&
                                        urlForImage(sponsor.image)?.url()
                                      }
                                      alt={sponsor.kind}
                                      title={sponsor.kind}
                                    />
                                    <p
                                      className={`${montserrat.className} text-sm pt-2`}
                                    >
                                      {sponsor.kind}
                                    </p>
                                  </div>
                                ))}
                          </Carousel>
                        </section>
                      </div>
                      <aside className="flex flex-col sm:hidden md:hidden lg:block xl:block xxl:block ">
                        <div className="w-full min-w-[380px]">
                          <div className="animated-gradient relative group">
                            <Link href={"/league-table"}>
                              <h2
                                className={`text-center group-hover:underline cursor-pointer text-white xl:text-4xl md:text-4xl sm:text-3xl lg:text-4xl py-5 font-bold ${kanit_bold.className}`}
                              >
                                Liigi League
                              </h2>

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="white"
                                className="size-6 absolute right-2 top-[40%] rotate-180"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                                />
                              </svg>
                            </Link>
                          </div>
                          <div className="bg-white">
                            <table className="min-w-full bg-white border-collapse shadow-md">
                              <thead>
                                <tr className="bg-gray-100 text-gray-600 text-xs leading-normal">
                                  <th
                                    className={`py-3 px-2 text-center ${kanit.className}`}
                                  >
                                    Pos
                                  </th>
                                  <th
                                    className={`py-3 px-7 text-left ${kanit.className}`}
                                  >
                                    Club
                                  </th>
                                  <th
                                    className={`py-3 px-2 text-center ${kanit.className}`}
                                  >
                                    Pl
                                  </th>
                                  <th
                                    className={`py-3 px-2 text-center ${kanit.className}`}
                                  >
                                    GD
                                  </th>
                                  <th
                                    className={`py-3 px-2 text-center ${kanit.className}`}
                                  >
                                    Pts
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="text-gray-600 text-sm font-light">
                                {sortedLeagueTable?.map((entry, index) => (
                                  <tr
                                    key={entry?._key}
                                    className="border-b border-gray-200 hover:bg-gray-100 group"
                                  >
                                    <td
                                      className={`py-3 px-0 text-center whitespace-nowrap ${rowdies.className} text-black`}
                                    >
                                      {index + 1}.
                                    </td>
                                    <td className="py-2 px-6 text-center flex items-center">
                                      <Image
                                        width={25}
                                        height={20}
                                        src={
                                          (entry?.club?.image &&
                                            urlForImage(
                                              entry?.club?.image
                                            )?.url()) ||
                                          ""
                                        }
                                        alt={entry?.club?.name}
                                        title={entry?.club?.name}
                                      />
                                      <h6 className="ml-2 font-bold text-primary group-hover:underline underline-offset-1 cursor-pointer">
                                        <a
                                          href={entry?.club?.link}
                                          target="_blank"
                                        >
                                          {entry?.club?.name}
                                        </a>
                                      </h6>
                                    </td>
                                    <td
                                      className={`py-3 px-6 text-center ${inter.className}`}
                                    >
                                      {entry?.played}
                                    </td>
                                    <td
                                      className={`py-3 px-6 ${
                                        entry?.gf - entry?.ga < 0
                                          ? "text-red-500"
                                          : entry?.gf - entry?.ga > 0
                                          ? "text-green-500"
                                          : ""
                                      }  text-center ${inter.className}`}
                                    >
                                      {entry?.gf - entry?.ga < 0
                                        ? "-"
                                        : entry?.gf - entry?.ga > 0
                                        ? "+"
                                        : ""}
                                      {entry?.gf - entry?.ga}
                                    </td>
                                    <td
                                      className={`py-3 px-6 text-center font-bold  ${rowdies.className}`}
                                    >
                                      {entry?.points}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="w-full min-w-[380px]">
                          <div className="animated-gradient relative group">
                            <Link
                              href={`/fixtures?matchweek=${closestMatchweek?.name.toLowerCase()}`}
                            >
                              <h2
                                className={`text-center group-hover:underline cursor-pointer text-white xl:text-4xl md:text-4xl sm:text-3xl lg:text-4xl py-5 font-bold ${kanit_bold.className}`}
                              >
                                {closestMatchweek?.name}
                              </h2>

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="white"
                                className="size-6 absolute right-2 top-[40%] rotate-180"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                                />
                              </svg>
                            </Link>
                          </div>
                          <div className="bg-white pt-3 shadow-md">
                            {allFixtures?.map((fixture, index) => (
                              <div key={fixture._key}>
                                {index === 0 ||
                                fixture.date !== allFixtures[index - 1].date ? (
                                  <div className="flex items-start">
                                    <h2
                                      className={`${kanit_bold.className} text-xl ml-4 font-bold mb-4 mt-1 h-[30px]`}
                                    >
                                      {new Date(
                                        fixture.date
                                      ).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                      })}
                                    </h2>
                                  </div>
                                ) : null}
                                <div
                                  className={`flex hover:bg-primary group items-center justify-between border-b ${
                                    fixture.live_mode ? "py-4" : "py-3"
                                  } px-3`}
                                >
                                  <div className="flex items-center">
                                    <Image
                                      width={40}
                                      height={40}
                                      quality={100}
                                      src={
                                        (fixture.home_club?.image &&
                                          urlForImage(
                                            fixture.home_club.image
                                          )?.url()) ||
                                        ""
                                      }
                                      alt={fixture.home_club?.name}
                                      title={fixture.home_club?.name}
                                      className="mr-4"
                                    />

                                    <span
                                      className={`mr-2 font-bold text-green-primary group-hover:text-white group-hover:underline ${kanit.className}`}
                                    >
                                      <a
                                        href={fixture.home_club.link}
                                        target="_blank"
                                      >
                                        {fixture.home_club?.name}
                                      </a>
                                    </span>
                                    <span
                                      className={`${inter.className} text-gray-500 group-hover:text-gray-200`}
                                    >
                                      vs
                                    </span>
                                    <span
                                      className={`ml-2 font-bold group-hover:text-white group-hover:underline text-green-primary ${kanit.className}`}
                                    >
                                      <a
                                        href={fixture.away_club.link}
                                        target="_blank"
                                      >
                                        {fixture.away_club?.name}
                                      </a>
                                    </span>
                                    <Image
                                      width={40}
                                      height={40}
                                      quality={100}
                                      src={
                                        (fixture.away_club?.image &&
                                          urlForImage(
                                            fixture.away_club.image
                                          )?.url()) ||
                                        ""
                                      }
                                      alt={fixture.away_club?.name}
                                      title={fixture.away_club?.name}
                                      className="ml-4"
                                    />
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span
                                      className={`text-sm text-gray-600 group-hover:text-gray-200 ${
                                        rowdies.className
                                      } ${
                                        isMatchStarted(
                                          fixture.scheduled_date_time
                                        ) && "line-through"
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
                                      (isMatchStarted(
                                        fixture.scheduled_date_time
                                      ) ||
                                        fixture.live_mode) && (
                                        <span
                                          className={`font-bold ${rowdies.className} group-hover:text-secondary text-lg`}
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
                            <Link
                              href={`/fixtures?matchweek=${closestMatchweek?.name.toLowerCase()}`}
                            >
                              <button
                                className={`text-center w-full text-black bg-white border-black border-2 outline-none duration-[0.1s] hover:text-white hover:bg-black hover:border-white  text-md font-sans-[${inter.className}] px-6 py-3`}
                              >
                                View More
                              </button>
                            </Link>
                          </div>
                        </div>
                      </aside>
                    </div>
                  </>
                )}
                {section.id === "sponsors-line" && (
                  <section
                    key={section.id}
                    className="py-3 grid sm:grid md:grid lg:hidden xl:hidden xxl:hidden"
                  >
                    <p className="text-center sm:mt-5 text-lg font-semibold py-5">
                      {section.title}
                    </p>
                    <Carousel
                      responsive={responsive}
                      containerClassName={"w-[98.5vw] mx-auto"}
                      arrowsDesktop={false}
                      itemClass={"running-line-animation sponsor"}
                    >
                      {sponsors?.length < 8
                        ? Array.from({
                            length: 8 - (sponsors?.length || 0),
                          }).map((_, index) => (
                            <div
                              key={`duplicate-${index}`}
                              className="flex flex-col justify-center items-center w-fit h-fit mx-1"
                            >
                              <img
                                src={urlForImage(
                                  sponsors[sponsors.length - 1].image
                                )?.url()}
                                alt={sponsors[sponsors.length - 1].kind}
                                title={sponsors[sponsors.length - 1].kind}
                                className="min-w-[150px] min-h-[20px] "
                              />
                              <p
                                className={`${montserrat.className} text-sm pt-2 `}
                              >
                                {sponsors[sponsors.length - 1].kind}
                              </p>
                            </div>
                          ))
                        : sponsors?.map((sponsor) => (
                            <div
                              key={sponsor._id}
                              className="flex justify-center flex-col items-center w-[150px] h-[150px]"
                            >
                              <img
                                src={
                                  sponsor.image &&
                                  urlForImage(sponsor.image)?.url()
                                }
                                alt={sponsor.kind}
                                title={sponsor.kind}
                              />
                              <p
                                className={`${montserrat.className} text-sm pt-2`}
                              >
                                {sponsor.kind}
                              </p>
                            </div>
                          ))}
                    </Carousel>
                  </section>
                )}
                {section.id === "cta" && (
                  <section
                    key={section.id}
                    className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-2 gap-4 w-full xl:x-16 lg:px-16 lg:py-16 md:px-16 md:py-16 sm:px-5 sm:py-12 xl:py-16 xl:mt-0 lg:mt-0 md:mt-0 sm:mt-0"
                  >
                    <h1
                      className={` xl:text-6xl lg:text-6xl md:text-5xl sm:text-4xl  leading-snug w-[100%] font-bold  `}
                    >
                      {section.title}
                    </h1>
                    <div className="flex flex-col  w-[100%] xl:pl-10 lg:pl-10 md:pl-10 sm:pl-0">
                      <p className="text-md  font-medium">
                        {section.description}
                      </p>
                      <div className="flex items-start justify-start mt-3">
                        <Link href={section.cta[0].link}>
                          <button
                            className={`mt-3 text-center mb-5 text-white bg-black border-black border-2 outline-none duration-[0.1s] hover:underline hover:rounded-[8px] text-md ${inter.className} px-6 py-3 rounded-[4px]`}
                          >
                            {section.cta[0].title}
                          </button>
                        </Link>
                        <Link href={section.cta[1].link}>
                          <button
                            className={`mt-3 ml-5 text-center mb-5 text-black bg-white border-black border-2 outline-none duration-[0.1s] hover:underline hover:rounded-[8px]  text-md ${inter.className} px-6 py-3 rounded-[4px]`}
                          >
                            {section.cta[1].title}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </section>
                )}

                {section.id === "news" && (
                  <>
                    <div
                      key={section.id}
                      className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 w-full lg:gap-4 md:gap-4 sm:gap-0 xl:gap-4"
                    >
                      <div className="xl:p-10 lg:p-10 md:p-10 sm:p-5 text-wrap">
                        <h6
                          className={`text-sm font-semibold ${rowdies.className} text-primary`}
                        >
                          {section.tagline}
                        </h6>
                        <h2
                          className={`group-hover:underline xl:text-5xl md:text-4xl sm:text-3xl lg:text-5xl py-5 font-bold ${kanit_bold.className}`}
                        >
                          {section.title}
                        </h2>
                        <p className={`${montserrat.className} py-3 text-sm`}>
                          {section.description}
                        </p>
                      </div>
                      <div className="flex sm:justify-start md:justify-end lg:justify-end xl:justify-end items-end xl:mx-10 lg:mx-10 lg:my-10 md:my-10 md:mx-10 sm:mx-0 sm:my-0 xl:my-10">
                        <Link href={section.cta[0].link}>
                          <button
                            className={`mt-3 ml-5 text-center mb-5 text-black bg-white border-black border-2 outline-none duration-[0.1s] hover:text-white hover:bg-black hover:border-white  text-md font-sans-[${inter.className}] px-6 py-3 rounded-[4px]`}
                          >
                            {section.cta[0].title}
                          </button>
                        </Link>
                      </div>
                    </div>
                    <NewsList news={news} />
                  </>
                )}
                {section.id === "video" && (
                  <>
                    <div
                      key={section.id}
                      className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 w-full lg:gap-4 md:gap-4 sm:gap-0 xl:gap-4"
                    >
                      <div className="xl:p-10 lg:p-10 md:p-10 sm:p-5 text-wrap">
                        <h6
                          className={`text-sm font-semibold ${rowdies.className} text-primary`}
                        >
                          {section.tagline}
                        </h6>
                        <h2
                          className={`group-hover:underline xl:text-5xl md:text-4xl sm:text-3xl lg:text-5xl py-5 font-bold ${kanit_bold.className}`}
                        >
                          {section.title}
                        </h2>
                        <p className={`${montserrat.className} py-3 text-sm`}>
                          {section.description}
                        </p>
                      </div>
                      <div className="flex sm:justify-start md:justify-end lg:justify-end xl:justify-end items-end xl:mx-10 lg:mx-10 lg:my-10 md:my-10 md:mx-10 sm:mx-0 sm:my-0 xl:my-10">
                        <Link href={section.cta[0].link}>
                          <button
                            className={`mt-3 ml-5 text-center mb-5 text-black bg-white border-black border-2 outline-none duration-[0.1s] hover:text-white hover:bg-black hover:border-white  text-md font-sans-[${inter.className}] px-6 py-3 rounded-[4px]`}
                          >
                            {section.cta[0].title}
                          </button>
                        </Link>
                      </div>
                    </div>
                    <NewsList news={video} />
                  </>
                )}
              </>
            )}
          </>
        ))}
      </main>
      <Footer
        sponsors={sponsors}
        data={footer}
        social={social}
        policies={policies}
        general={general}
      />
    </>
  );
}

// <section key={section.id} id="video">
//   <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 w-full lg:gap-4 md:gap-4 sm:gap-0 xl:gap-4">
//     <div className="xl:p-10 lg:p-10 md:p-10 sm:p-5 ">
//       <h6
//         className={`text-sm font-semibold ${rowdies.className} text-primary`}
//       >
//         {section.tagline}
//       </h6>
//       <h2
//         className={`group-hover:underline xl:text-5xl md:text-4xl sm:text-3xl lg:text-5xl py-5 font-bold ${kanit_bold.className}`}
//       >
//         {section.title}
//       </h2>
//       <p className={`${montserrat.className} py-3 text-sm`}>
//         {section.description}
//       </p>
//     </div>
//     <div className="flex sm:justify-start md:justify-end lg:justify-end xl:justify-end items-end xl:mx-10 lg:mx-10 lg:my-10 md:my-10 md:mx-10 sm:mx-0 sm:my-0 xl:my-10">
//       <Link href={section.cta[0].link}>
//         <button
//           className={`mt-3 ml-5 text-center mb-5 text-black bg-white border-black border-2 outline-none duration-[0.1s] hover:text-white hover:bg-black hover:border-white  text-md font-sans-[${inter.className}] px-6 py-3 rounded-[4px]`}
//         >
//           {section.cta[0].title}
//         </button>
//       </Link>
//     </div>
//   </div>
//   <div className="grid xl:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-5 w-[95%] m-auto">
//     {video?.map((item) => (
//       <div
//         key={item._id}
//         className="flex sm:flex-col md:flex-col xl:flex-row lg:flex-col col-span-1 group w-full sm:items-start  md:items-start lg:items-start xl:items-center cursor-pointer"
//       >
//         <Link
//           href={createSlug(
//             item.category?.title,
//             item.slug?.current,
//             item._type
//           )}
//         >
//           <div className="square-image-wrapper relative rounded-[4px] overflow-hidden w-full min-w-[250px] max-w-[850px]">
//             <img
//               alt={item.title}
//               title={item.title}
//               src={
//                 item.video?.preview &&
//                 urlForImage(item.video.preview)?.url()
//               }
//               className="w-full duration-[0.2s] group-hover:scale-125 xxl:min-w-[600px] xxl:max-w-[600px] xl:min-w-[420px] xl:max-w-[420px] h-full lg:min-h-[300px] md:min-h-[200px] xl:min-h-[300px] object-cover"
//             />
//             <VideoMark url={item?.video?.url} />
//           </div>
//         </Link>
//         <div className="text-wrap flex flex-col items-start lg:px-0 md:px-0 sm:px-0 xl:px-10">
//           <div className="flex items-center mt-4">
//             <div className="bg-primary w-fit px-3 py-1.5">
//               <h6
//                 className={`text-sm text-white font-bold ${rowdies.className}`}
//               >
//                 {item?.category?.title}
//               </h6>
//             </div>
//             <p
//               className={`font-medium text-sm text-center ml-3 ${rowdies.className}`}
//             >
//               {createDate(item._createdAt)}
//             </p>
//           </div>
//           <Link
//             href={createSlug(
//               item.category?.title,
//               item.slug?.current,
//               item._type
//             )}
//           >
//             <h3
//               className={`text-xl group-hover:underline py-4 font-bold ${kanit.className}`}
//             >
//               {item.title}
//             </h3>
//           </Link>
//           <p
//             className={`text-sm py-2 font-medium ${montserrat.className}`}
//           >
//             {item.short_description}
//           </p>
//           <Link
//             href={createSlug(
//               item.category?.title,
//               item.slug?.current,
//               item._type
//             )}
//           >
//             <button
//               className={`my-4 duration-[0.1s] flex items-center text-md ${inter.className}`}
//             >
//               Read More
//               <Image
//                 className={
//                   "ml-3 -rotate-90 group-hover:ml-4 duration-[0.1s]"
//                 }
//                 src={"/black-arrow-down.svg"}
//                 alt={"arrow-down"}
//                 width={15}
//                 height={15}
//               />
//             </button>
//           </Link>
//         </div>
//       </div>
//     ))}
//   </div>
// </section>;
//  <div className="sm:hidden md:hidden col-span-1 grid-cols-1 xl:grid lg:grid gap-4">
{
  /* {banner.items.slice(3, 5).map((item, i) => (
                            <div
                              key={item.slug.current}
                              className="bg-white relative rounded-[4px] border-[1px] border-black overflow-hidden max-h-[410px] min-h-[410px]"
                            >
                              <div className="flex flex-col items-start px-4 py-5 group">
                                <h6
                                  className={`text-sm font-semibold ${rowdies.className} text-primary`}
                                >
                                  {item.category.title}
                                </h6>
                                <Link
                                  href={createSlug(
                                    item.category.title,
                                    item.slug.current,
                                    item._type
                                  )}
                                >
                                  <h2
                                    className={`group-hover:underline text-2xl cursor-pointer py-3 font-bold ${kanit.className}`}
                                  >
                                    {item.title}
                                  </h2>
                                </Link>
                                <Link
                                  href={createSlug(
                                    item.category?.title,
                                    item.slug?.current,
                                    item._type
                                  )}
                                >
                                  <button
                                    className={`mt-3 duration-[0.1s] flex items-center text-md ${inter.className}`}
                                  >
                                    More
                                    <Image
                                      className={
                                        "ml-3 -rotate-90 group-hover:ml-4 duration-[0.1s]"
                                      }
                                      src={"/black-arrow-down.svg"}
                                      alt={"arrow-down"}
                                      width={15}
                                      height={15}
                                    />
                                  </button>
                                </Link>
                              </div>
                              <Link
                                href={createSlug(
                                  item.category.title,
                                  item.slug.current,
                                  item._type
                                )}
                              >
                                <div className="overflow-hidden h-[100%]">
                                  <img
                                    src={
                                      item._type === "video"
                                        ? `${
                                            item?.video?.preview &&
                                            urlForImage(
                                              item?.video?.preview
                                            )?.url()
                                          }`
                                        : `${
                                            item.preview &&
                                            urlForImage(item.preview)?.url()
                                          }`
                                    }
                                    alt={item?.title}
                                    className="bg-no-repeat w-full duration-[0.3s] h-[258px]  object-cover bg-center hover:scale-110"
                                  />
                                  {item._type == "video" && (
                                    <VideoMark url={item?.video?.url} />
                                  )}
                                </div>
                              </Link>
                            </div>
                          ))} */
}
{
  /* </div>; */
}
