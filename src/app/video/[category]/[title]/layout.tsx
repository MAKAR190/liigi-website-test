import type { Metadata, ResolvingMetadata  } from "next";
import { Roboto } from "next/font/google";
import {
    generalResponse,
    generalQuery,
    videoSingleQuery,
    Video
} from "@/lib/queries";
import {urlForImage} from "@/lib/utils"
import {sanityFetch} from "@/lib/fetch";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });
type Props = {
    params: { category: string, title:string }
}
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const category = params.category;
    const title = params.title;

    const [general, video] = await Promise.all([
        sanityFetch<generalResponse>({
            query: generalQuery,
        }),
        sanityFetch<Video>({
            query: videoSingleQuery,
            params:{title}
        }),
    ]);
    return {
        title: `${general.title} Video & ${category.charAt(0).toUpperCase() + category.slice(1, category.length)} & ${title}`,
        description: `For all the latest ${general.title}  news, visit the official website of the ${general.title}.`,
        icons: {
            icon:  video?.video?.preview && urlForImage(video.video.preview)?.url() || general.logo && urlForImage(general.logo )?.url()
        },
        openGraph: {
            title: `${general.title} Video & ${category.charAt(0).toUpperCase() + category.slice(1, category.length)} & ${title}`,
            description: `For all the latest ${general.title}  news, visit the official website of the ${general.title} .`,
            images: [`${video?.video?.preview && urlForImage(video.video.preview)?.url()}`] || general.logo && [`${urlForImage(general.logo)?.url()}`]
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
