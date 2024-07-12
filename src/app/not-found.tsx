import { Header, Footer, NewsList } from "../components";
import { inter, kanit_bold, montserrat, rowdies } from "../fonts";
import Link from "next/link";
import { sanityFetch } from "../lib/fetch";
import {
  clubsQuery,
  footerQuery,
  generalQuery,
  navQuery,
  socialQuery,
  sponsorsQuery,
  policiesQuery,
  newsQuery,
} from "../lib/queries";

export default async function NotFound() {
  const [nav, clubs, general, sponsors, footer, social, policies, news] =
    await Promise.all([
      sanityFetch({
        query: navQuery,
      }),
      sanityFetch({
        query: clubsQuery,
      }),
      sanityFetch({
        query: generalQuery,
      }),
      sanityFetch({
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
      sanityFetch({
        query: newsQuery,
      }),
    ]);

  // Check if 'news' is undefined, and default to an empty array if it is
  const newsList = news || [];
  const navItems = nav || [];
  const clubsItems = clubs || [];
  return (
    <>
      <Header
        pageId={"not-found"}
        logo={general}
        clubs={clubsItems}
        menuItems={navItems}
      />
      <div className="mt-[150px] w-full flex justify-center items-center flex-col">
        <h1 className={`${kanit_bold.className} text-center text-5xl`}>
          Oops...
        </h1>
        <p className={`${montserrat.className} text-center text-md mt-5`}>
          The page you were looking for is not found.
        </p>
        <p className={`${rowdies.className} text-center text-md mt-1`}>
          Sorry, if the page you are looking for is no longer available.
        </p>
        <Link href={"/"}>
          <button
            className={`mt-5 text-center text-white bg-black border-black border-2 outline-none duration-[0.1s] hover:underline hover:rounded-[8px] text-md ${inter.className} px-6 py-3 rounded-[4px]`}
          >
            Go Home
          </button>
        </Link>
      </div>
      {/* Pass 'newsList' instead of 'news' */}
      <NewsList news={newsList} />
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
