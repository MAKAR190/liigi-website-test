import { Footer, RichText } from "@/components"
import dynamic from 'next/dynamic';


const Header = dynamic(() => import('../../../components/Header'), {
    ssr: true
});
import { sanityFetch } from "@/lib/fetch";
import {
    clubsQuery, footerQuery, generalQuery,
    navQuery,
    navResponse,policiesQuery,PolicyResponse,
    policyQuery, socialQuery, Sponsor, sponsorsQuery,
} from "@/lib/queries";
import {notFound} from "next/navigation";

export default async function Policy({params}:{params:{title:string}}){
    const [nav, clubs, general, sponsors, footer, social, policies, policy] = await Promise.all([
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
        }),  sanityFetch({
            query: socialQuery,
        }),  sanityFetch({
            query: policiesQuery,
        }),
        sanityFetch<PolicyResponse>({
            query: policyQuery,
            params:{title:params.title}
        }),
    ]);
    if(!policy){
        notFound();
    }
return (
    <>
        <Header pageId={"policy"} logo={general} clubs={clubs} menuItems={nav} />
        {policy && <main className="mt-[160px]">
            <h2 className="text-5xl text-center">{policy?.title}</h2>
          <div className="sm:w-full md:w-[95%] lg:w-[90%] xl:w-[90%] mx-auto my-10">
              <RichText content={policy.blockContent}/>
          </div>
        </main>}
        <Footer sponsors={sponsors} data={footer} social={social} policies={policies} general={general}/>
    </>
)
}