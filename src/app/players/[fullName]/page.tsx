import { Footer, NewsList } from "@/components";
import dynamic from "next/dynamic";
import { kanit_bold, montserrat, inter, rowdies } from "../../../fonts";
import countries from "world-countries";
import Flag from "react-world-flags";
import { notFound } from "next/navigation";
const Header = dynamic(() => import("../../../components/Header"), {
  ssr: true,
});
import { sanityFetch } from "@/lib/fetch";
import {
  clubsQuery,
  footerQuery,
  generalQuery,
  navQuery,
  navResponse,
  policiesQuery,
  socialQuery,
  Sponsor,
  sponsorsQuery,
  playerQuery,
  Player,
  bannerQuery,
  BannerResponse,
  News,
  Video,
  relatedNewsAndVideosQuery,
} from "@/lib/queries";
import { urlForImage } from "@/lib/utils";
import Image from "next/image";

export default async function PlayerPage({
  params,
}: {
  params: { fullName: string };
}) {
  const [firstName, lastName] = params.fullName.split("-");

  const fetchPlayerData = async () => {
    const playerResponse = await sanityFetch<Player>({
      query: playerQuery(firstName, lastName),
    });

    if (!playerResponse) {
      notFound();
    }

    const relatedArticlesResponse = await sanityFetch<{
      news: News[];
      videos: Video[];
    }>({
      query: relatedNewsAndVideosQuery(playerResponse._id),
    });

    return { player: playerResponse, relatedArticles: relatedArticlesResponse };
  };

  const [
    nav,
    clubs,
    general,
    sponsors,
    footer,
    social,
    policies,
    banner,
    { player, relatedArticles },
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
    sanityFetch<Sponsor[]>({
      query: sponsorsQuery,
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
    sanityFetch<BannerResponse>({
      query: bannerQuery,
    }),
    fetchPlayerData(),
  ]);

  const additionalCountries = [
    { title: "England", value: "GB-ENG" },
    { title: "Scotland", value: "GB-SCT" },
    { title: "Wales", value: "GB-WLS" },
    { title: "Northern Ireland", value: "GB-NIR" },
  ];

  const getCountryInfo = (isoCode: string) => {
    return (
      countries.find((country) => country.cca3 === isoCode)?.name.common ||
      additionalCountries.find((country) => country.value === isoCode)?.title ||
      "Not Found"
    );
  };

  function getAge(dateString: string) {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const jsonLd = {
    "@context": "http://schema.org",
    "@type": "Person",
    name: `${player.first_name} ${player.last_name}`,
    givenName: player.first_name,
    familyName: player.last_name,
    birthDate: player.date_of_birth,
    nationality: getCountryInfo(player.nationality),
    height: `${player.height} cm`,
    url: typeof window !== "undefined" ? window.location.href : "",
    affiliation: {
      "@type": "SportsTeam",
      name: player.club.name,
      url: player.club.link,
      logo: urlForImage(player.club.image)?.url(),
      sport: "Soccer",
    },
    memberOf: {
      "@type": "SportsOrganization",
      name: "Liigi football League",
      sport: "Football",
    },
    jobTitle: player.position,
    additionalType: "http://schema.org/Athlete",
    image: urlForImage(player.profile)?.url(),
    potentialAction: {
      "@type": "SearchAction",
      target:
        typeof window !== "undefined"
          ? `${window.location.origin}/search?q={search_term_string}`
          : "",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header pageId={"player"} logo={general} clubs={clubs} menuItems={nav} />
      <main className="mt-[160px]">
        <div className="w-full relative h-fit py-10 min-h-[200px] max-h-[250px]">
          {banner.background && (
            <Image
              fill
              src={urlForImage(banner.background)?.url() || ""}
              alt="banner"
              className="object-cover w-full h-full"
            />
          )}
          {player && (
            <>
              <div className="absolute top-0 left-0 flex justify-around items-center  xxl:px-0 xl:px-0 lg:px-0 md:px-0 max-[510px]:px-5 w-full h-full">
                <div className="flex flex-col">
                  <h1
                    className={`${kanit_bold.className} text-white sm:text-xl md:text-5xl lg:text-7xl xl:text-7xl xxl:text-7xl`}
                  >
                    {player?.first_name} {player?.last_name}
                  </h1>
                  <h2
                    className={`${kanit_bold.className} sm:block md:hidden lg:hidden xl:hidden xxl:hidden text-white text-7xl`}
                  >
                    {player?.number}
                  </h2>
                </div>
                <Image
                  width={200}
                  height={200}
                  alt="playerProfile"
                  src={urlForImage(player.profile)?.url() || ""}
                />
                <h2
                  className={`${kanit_bold.className} sm:hidden md:block lg:block xl:block xxl:block text-white text-9xl`}
                >
                  {player?.number}
                </h2>
              </div>
              <div className="absolute bottom-0 left-0">
                <div className="flex">
                  {player?.social_media.map((social) => (
                    <a href={social.url} target="_blank">
                      <Image
                        width={25}
                        height={25}
                        src={
                          (social?.icon && urlForImage(social?.icon)?.url()) ||
                          ""
                        }
                        alt={social.platform_name}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="max-[570px]:w-full md:w-[90%] lg:w-[90%] xl:-[w-90%] xxl:w-[90%] mx-auto mt-10">
          <div className="w-full h-fit border-gray-100 border-[1px] py-10 my-5">
            <div className="flex group sm:flex-col md:flex-col lg:flex-row xl:flex-row xxl:flex-row w-full h-full sm:items-start md:items-start lg:items-center xl:items-center xxl:items-center justify-around">
              <div className="flex sm:w-full sm:justify-between sm:px-2 md:w-full md:justify-between md:px-2 lg:justify-center lg:w-fit lg:px-0 xl:justify-center xl:w-fit xl:px-0 xxl:justify-center xxl:w-fit xxl:px-0  items-center">
                <span
                  className={`font-normal mx-2 text-xs ${montserrat.className}`}
                >
                  Position
                </span>
                <h6 className={`${inter.className}`}>{player?.position}</h6>
              </div>
              <div className="flex sm:w-full sm:justify-between sm:px-2 md:w-full md:justify-between md:px-2 lg:justify-center lg:w-fit lg:px-0 xl:justify-center xl:w-fit xl:px-0 xxl:justify-center xxl:w-fit xxl:px-0  items-center">
                <span
                  className={`font-normal mx-2 text-xs ${montserrat.className}`}
                >
                  Club
                </span>
                <a
                  className="flex items-center hover:underline"
                  target="_blank"
                  href={player?.club.link}
                >
                  <h6 className={`${inter.className}`}>{player?.club.name}</h6>
                  <Image
                    width={30}
                    height={20}
                    alt={player?.club.name}
                    title={player?.club.name}
                    src={urlForImage(player?.club.image)?.url() || ""}
                  />
                </a>
              </div>
              <div className="flex sm:w-full sm:justify-between sm:px-2 md:w-full md:justify-between md:px-2 lg:justify-center lg:w-fit lg:px-0 xl:justify-center xl:w-fit xl:px-0 xxl:justify-center xxl:w-fit xxl:px-0  items-center">
                <span
                  className={`font-normal mx-2 text-xs ${montserrat.className}`}
                >
                  Nationality
                </span>
                <div className="flex items-center">
                  <Flag
                    code={player?.nationality}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                  <h6 className={`${inter.className}`}>
                    {getCountryInfo(player?.nationality)}
                  </h6>
                </div>
              </div>
              <div className="flex sm:w-full sm:justify-between sm:px-2 md:w-full md:justify-between md:px-2 lg:justify-center lg:w-fit lg:px-0 xl:justify-center xl:w-fit xl:px-0 xxl:justify-center xxl:w-fit xxl:px-0  items-center">
                <span
                  className={`font-normal mx-2 text-xs ${montserrat.className}`}
                >
                  Date of Birth
                </span>
                <h6 className={`${inter.className}`}>
                  {new Date(player?.date_of_birth).toLocaleDateString()}
                </h6>
              </div>
              <div className="flex sm:w-full sm:justify-between sm:px-2 md:w-full md:justify-between md:px-2 lg:justify-center lg:w-fit lg:px-0 xl:justify-center xl:w-fit xl:px-0 xxl:justify-center xxl:w-fit xxl:px-0  items-center">
                <span
                  className={`font-normal mx-2 text-xs ${montserrat.className}`}
                >
                  Age
                </span>
                <h6 className={`${inter.className}`}>
                  {getAge(player?.date_of_birth)}
                </h6>
              </div>
              <div className="flex sm:w-full sm:justify-between sm:px-2 md:w-full md:justify-between md:px-2 lg:justify-center lg:w-fit lg:px-0 xl:justify-center xl:w-fit xl:px-0 xxl:justify-center xxl:w-fit xxl:px-0  items-center">
                <span
                  className={`font-normal mx-2 text-xs ${montserrat.className}`}
                >
                  Height
                </span>
                <h6 className={`${inter.className}`}>{player?.height}cm</h6>
              </div>
            </div>
          </div>
          {player?.season_stats ? (
            <div id="stats">
              <section className="my-5">
                <div className="border-[1px] border-gray-100 p-5">
                  <h3 className={`${rowdies.className} text-center text-2xl`}>
                    Overall Stats
                  </h3>
                  <div className="mt-5">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-4">
                      <div className="text-left rounded-[10px] text-white mt-4  py-5 mx-2 px-5 bg-gradient-to-r from-primary to-secondary">
                        <p className={`${montserrat.className} text-md`}>
                          Appearances
                        </p>
                        <p className={`${kanit_bold.className} text-6xl`}>
                          {player?.season_stats?.reduce(
                            (acc, stat) => acc + (stat?.appearances || 0),
                            0
                          )}
                        </p>
                      </div>
                      <div className="text-left rounded-[10px] text-white mt-4 py-5 mx-2 px-5 bg-gradient-to-r from-primary to-secondary">
                        <p className={`${montserrat.className} text-md`}>
                          Goals
                        </p>
                        <p className={`${kanit_bold.className} text-6xl`}>
                          {player?.season_stats?.reduce(
                            (acc, stat) => acc + (stat?.goals || 0),
                            0
                          )}
                        </p>
                      </div>
                      <div className="text-left rounded-[10px] text-white py-5 mx-2 mt-4  px-5 bg-gradient-to-r from-primary to-secondary">
                        <p className={`${montserrat.className} text-md`}>
                          Assists
                        </p>
                        <p className={`${kanit_bold.className} text-6xl`}>
                          {player?.season_stats?.reduce(
                            (acc, stat) => acc + (stat?.assists || 0),
                            0
                          )}
                        </p>
                      </div>
                      <div className="text-left rounded-[10px] text-white py-5 mx-2 mt-4  px-5 bg-gradient-to-r from-primary to-secondary">
                        <p className={`${montserrat.className} text-md`}>
                          Clean Sheets
                        </p>
                        <p className={`${kanit_bold.className} text-6xl`}>
                          {player?.season_stats?.reduce(
                            (acc, stat) => acc + (stat?.clean_sheets || 0),
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="my-5">
                <div className="border-[1px] border-gray-100 p-5">
                  <h3 className={`${rowdies.className} text-center text-2xl`}>
                    Season Stats
                  </h3>
                  <div className="mt-3 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Season
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Club
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Appearances
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Goals
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Assists
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Clean Sheets
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {player?.season_stats?.map((stat: any, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {stat?.season?.season}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              <a
                                className="flex items-center hover:underline"
                                target="_blank"
                                href={player?.club.link}
                              >
                                <h6 className={`${rowdies.className}`}>
                                  {stat?.club?.name}
                                </h6>
                                <Image
                                  width={30}
                                  height={20}
                                  alt={player?.club.name}
                                  title={player?.club.name}
                                  src={
                                    urlForImage(player?.club.image)?.url() || ""
                                  }
                                />
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              <h6 className={`${rowdies.className}`}>
                                {stat?.appearances}
                              </h6>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              <h6 className={`${rowdies.className}`}>
                                {stat?.goals}
                              </h6>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              <h6 className={`${rowdies.className}`}>
                                {stat?.assists}
                              </h6>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              <h6 className={`${rowdies.className}`}>
                                {stat?.clean_sheets}
                              </h6>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div />
          )}
        </div>
        <div id="related">
          {relatedArticles?.news?.length ? (
            <section>
              <h2
                className={`xl:text-5xl md:text-4xl sm:text-3xl lg:text-5xl py-5 font-bold ${kanit_bold.className} ml-10`}
              >
                Related News
              </h2>
              <NewsList type="news" news={relatedArticles.news} />
            </section>
          ) : (
            <div />
          )}
          {relatedArticles?.videos?.length ? (
            <section>
              <h2
                className={`xl:text-5xl md:text-4xl sm:text-3xl lg:text-5xl py-5 font-bold ${kanit_bold.className} ml-10`}
              >
                Related Videos
              </h2>
              <NewsList type="video" news={relatedArticles.videos} />
            </section>
          ) : (
            <div />
          )}
        </div>
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
