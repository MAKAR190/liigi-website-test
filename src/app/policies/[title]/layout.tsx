import type { Metadata, ResolvingMetadata  } from "next";
import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: "400" });
type Props = {
    params: { category: string, title:string }
}
import { sanityFetch } from "@/lib/fetch";
import {
   policyQuery, PolicyResponse,generalQuery,generalResponse
} from "@/lib/queries";
import {urlForImage} from "@/lib/utils";
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const [ policy, general] = await Promise.all([
        sanityFetch<PolicyResponse>({
            query: policyQuery,
            params:{title:params.title}
        }),

        sanityFetch<generalResponse>({
            query: generalQuery,
        }),
    ]);
    const title = policy?.title;

    return {
        title: `${general.title} - ${title}`,
        description: "Our policies information",
        icons: {
            icon: general?.logo && urlForImage(general.logo)?.url()
        },
        openGraph: {
            title: `${general.title} - ${title}`,
            description: "Our policies information",
            images:[`${general?.logo && urlForImage(general.logo)?.url()}`]
        },
    }
}
export default function Page({
                                 children,
                             }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
        <body className={roboto.className}>{children}</body>
        </html>
    );
}
