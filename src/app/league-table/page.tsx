"use server";
import { Footer } from "@/components";
import Filters from "./components/Filters";
import Table from "./components/Table";
import Banner from "./components/Banner";
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
  ClubItem,
  seasonsQuery,
  Season,
} from "@/lib/queries";
type Props = {
  params: {};
  searchParams: { season: string };
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
        <Banner banner={banner} />
        <Filters seasons={seasons} />
        <div id="table">
          <Table seasons={seasons} seasonParam={props.searchParams.season} />
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
