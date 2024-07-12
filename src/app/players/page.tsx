"use server";
import { Footer } from "@/components";
import PlayerFilters from "./components/PlayerFilters";
import PlayersTable from "./components/PlayersTable";
import PlayersBanner from "./components/PlayersBanner";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("../../components/Header"), {
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
  bannerQuery,
  BannerResponse,
  playersQuery,
  Player,
  ClubItem,
  seasonsQuery,
  Season,
} from "@/lib/queries";
type Props = {
  params: {};
  searchParams: { club: string; season: string; search: string };
};
export default async function Players(props: Props) {
  const [
    nav,
    clubs,
    general,
    sponsors,
    footer,
    social,
    policies,
    players,
    banner,
    seasons,
  ] = await Promise.all([
    sanityFetch<navResponse>({
      query: navQuery,
    }),
    sanityFetch<ClubItem[]>({
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
    sanityFetch<Player[]>({
      query: playersQuery,
    }),
    sanityFetch<BannerResponse>({
      query: bannerQuery,
    }),
    sanityFetch<Season[]>({
      query: seasonsQuery,
    }),
  ]);

  return (
    <>
      <Header pageId={"players"} logo={general} clubs={clubs} menuItems={nav} />
      <main className="mt-[120px]">
        <PlayersBanner banner={banner} />
        <PlayerFilters clubs={clubs} seasons={seasons} />
        <div id="table">
          <PlayersTable
            searchClub={props.searchParams.club}
            searchName={props.searchParams.search}
            searchSeason={props.searchParams.season}
            players={players ? players : []}
          />
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
