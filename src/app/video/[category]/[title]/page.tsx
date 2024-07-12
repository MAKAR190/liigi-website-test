import { Header, Footer, Player, NewsList, Social } from "@/components"
import Image from "next/image"
import Link from "next/link"
import React from "react";
import { notFound } from 'next/navigation';
import { sanityFetch } from "@/lib/fetch";
import {
    navQuery,
    clubsQuery,
    generalQuery,
    sponsorsQuery,
    footerQuery,
    socialQuery,
    policiesQuery,
    videoQuery,
    videoSingleQuery,
    Video,
    navResponse,
    Sponsor,
} from "@/lib/queries";
import {urlForImage} from "@/lib/utils"
function  createDate(date:string){
    const createdAtDate = new Date(date);
    return createdAtDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default async function VideoPage({params}:{params:{title:string, category:string}}){
    const [nav, clubs, general, sponsors, footer, social, policies, video, videos] = await Promise.all([
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
        sanityFetch<Video>({
            query: videoSingleQuery,
            params:{title:params.title}
        }),
        sanityFetch<Video[]>({
            query: videoQuery,
        }),
    ]);
    if(!video){
        notFound();
    }
    const jsonLd = {
      "@context": "http://schema.org",
      "@type": "BlogPosting",
      headline: params.title,
      image: video.video.preview && urlForImage(video.video.preview)?.url(),
      description: video.short_description,
      author: {
        "@type": "Person",
        name: video.author.name,
      },
      datePublished: createDate(video._createdAt),
      dateModified: createDate(video._updatedAt),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": typeof window !== "undefined" ? window.location.href : "",
      },
    };
    return(
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header pageId={"video"} logo={general} clubs={clubs} menuItems={nav} />
            <main className="my-[200px] h-full w-full">
                <div id={"preview"} className="sm:w-full lg:items-center md:items-center sm:items-start xl:items-center md:w-[98%] lg:w-[90%] xl:w-[90%] mx-auto max-[570px]:h-[55vh] h-[75vh] lg:h-[40vh] md:h-[40vh] xl:h-[40vh] flex xl:flex-row lg:flex-row md:flex-row sm:flex-col sm:px-0 lg:px-5 md:px-5 xl:px-5 my-10">
                    <div className="flex flex-col justify-center items-start sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] sm:px-2 md:px-10 lg:px-10 xl:px-10 m-auto">
                        <div className="flex-row flex">
                            <p className="pr-2">Video</p>
                            <Image src={"/black-arrow-down.svg"} alt={"arrow-down"} width={10} height={10} className="-rotate-90" />
                            <p className="px-2 first-letter:uppercase">{params.category}</p>
                        </div>
                        <h1 className="font-bold mt-5 sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl leading-snug">{video.title}</h1>
                        <div className="xl:my-10 lg:my-10 md:my-10 sm:my-4 flex flex-col justify-between items-start w-full">
                            <div className='flex flex-col items-start sm:my-4 md:my-0 xl:my-0 lg:my-0'>
                                <p className="font-bold text-sm">By {video.author.name}</p>
                                <div className="flex py-1">
                                    <p className="pr-2 text-sm">{createDate(video._createdAt)}</p>
                                </div>
                                <p className="font-bold text-md">Share This Video</p>
                            </div>
                            <Social/>
                        </div>
                    </div>
                    <div className="w-full  h-full block">
                        <Player url={video.video.url} preview={video.video.preview && urlForImage(video.video.preview)?.url()} />
                    </div>
                </div>
            </main>
            <NewsList type={"video"} news={videos} />
            <Footer sponsors={sponsors} data={footer} social={social} policies={policies} general={general}/>
        </>
    )
}