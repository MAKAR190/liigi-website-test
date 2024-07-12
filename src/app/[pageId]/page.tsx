import { Footer, RichText } from "@/components";
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
} from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function Policy({
  params,
}: {
  params: { pageId: string };
}) {
  const [nav, clubs, general, sponsors, footer, social, policies] =
    await Promise.all([
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
    ]);
  const page = nav.pages.find((page) => page.id === params.pageId);
  const section = page?.page_sections?.find(
    (section) => section.id === "content",
  );
  if (!page) {
    notFound();
  }
  return (
    <>
      <Header pageId={page.id} logo={general} clubs={clubs} menuItems={nav} />
      {page && (
        <main className="mt-[160px]">
          <h2 className="text-5xl text-center">{page?.title}</h2>
          <div className="sm:w-full md:w-[95%] lg:w-[90%] xl:w-[90%] mx-auto my-10">
            <RichText content={section?.blockContent} />
          </div>
        </main>
      )}
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
