import { Header, Footer, Social, TracingBeam, RichText } from "@/components"
import { rowdies, montserrat, inter } from "@/fonts"
import Image from "next/image"
import {toPlainText} from "@portabletext/react"
import Link from "next/link"
import { notFound } from 'next/navigation';
import React from "react";
import { sanityFetch } from "@/lib/fetch";
import {
    navQuery,
    clubsQuery,
    generalQuery,
    sponsorsQuery,
    footerQuery,
    socialQuery,
    policiesQuery,
    articleQuery,
    categoriesQuery,
    Category,
    News,
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

function getTimeOfRead(content:any){
    const plain = toPlainText(content);

    const wordCount = plain.split(/\s+/).length;

    // Average reading speed in words per minute
    const wordsPerMinute = 200;

    // Calculate the estimated reading time in minutes
    const readingTimeInMinutes = wordCount / wordsPerMinute;

    // Round up to the nearest minute and return
    return Math.ceil(readingTimeInMinutes);
}

export default async function Article({params}:{params:{title:string, category:string}}){

    const [nav, clubs, general, sponsors, footer, social, policies, article, categories] = await Promise.all([
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
        sanityFetch<News>({
            query: articleQuery,
            params:{title:params.title}
        }),
        sanityFetch<Category[]>({
            query: categoriesQuery,
        }),
    ]);
    if(!article){
        notFound();
    }
    const shuffledCategories = categories.sort(() => Math.random() - 0.5);

    // Slice the first 5 elements (or fewer if the array has less than 5 elements)
    const selectedCategories = shuffledCategories.slice(0, 5);

    const article_page = nav.pages.find(p => p.id==="article");
    const cta_section = article_page?.page_sections.find(p => p.id==="cta");


    const jsonLd = {
      "@context": "http://schema.org",
      "@type": "BlogPosting",
      headline: params.title,
      image: article.preview && urlForImage(article.preview)?.url(),
      description: article.short_description,
      author: {
        "@type": "Person",
        name: article.author.name,
      },
      datePublished: createDate(article._createdAt),
      dateModified: createDate(article._updatedAt),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": typeof window !== "undefined" ? window.location.href : "",
      },
    };
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header pageId={"article"} logo={general} clubs={clubs} menuItems={nav} />
            <main className="mt-[200px] mb-[100px] w-full flex flex-col">
                    <div className="flex flex-col justify-center items-start sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] m-auto">
                        <div className="flex-row flex">
                          <p className="pr-2">News</p>
                            <Image src={"/black-arrow-down.svg"} alt={"arrow-down"} width={10} height={10} className="-rotate-90" />
                            <p className="px-2 first-letter:uppercase">{params.category}</p>
                        </div>
                        <h1 className="font-bold mt-2 sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl leading-snug">{article.title}</h1>
                        <div className="xl:my-10 lg:my-10 md:my-10 sm:my-4 flex xl:flex-row lg:flex-row flex-row md:flex-row  max-[480px]:flex-col justify-between xl:items-center lg:items-center items-start md:items-center w-full">
<div className='flex flex-col items-start sm:my-4 md:my-0 xl:my-0 lg:my-0'>
    <p className="font-bold">By {article.author.name}</p>
    <div className="flex">
        <p className="pr-2">{createDate(article._createdAt)}</p>
        <Image src={"/ball.svg"} alt={"arrow-down"} width={15} height={15} />
        <p className="px-2">{getTimeOfRead(article.blockContent) == 1 ? getTimeOfRead(article.blockContent) +" "+"Minute Read"  : getTimeOfRead(article.blockContent) +" "+"Minutes Read"}</p>
    </div>
</div>
                           <Social />
                        </div>
                    </div>
                    <a href={article?.preview && urlForImage(article?.preview)?.url()} id={"preview"} target={"_blank"}>
                        <Image
                            id={"content"}
                            className="m-auto"
                            src={article.preview && urlForImage(article?.preview)?.url() || ""}
                            alt={article.title || ''}
                            title={article.title || ''}
                            width={1300}
                            height={1300}
                            quality={100}
                        />
                    </a>
                    <TracingBeam className="sm:hidden md:block lg:block xl:block">
                        <div  className="flex flex-col sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] m-auto my-10">
                            <RichText content={article.blockContent} />
                      </div>
                    </TracingBeam>
<div className="sm:block md:hidden lg:hidden xl:hidden">
    <div  className="flex flex-col sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] m-auto my-10">
        <RichText content={article.blockContent} />
    </div>
</div>
                    <p  className="text-center font-bold text-lg my-5">Read More</p>
                    <div id={'share'} className="flex justify-center items-center">
                       <Social/>
                    </div>
                    <div  className="flex max-[500px]:justify-start justify-center md:justify-center lg:justify-center xl:justify-center w-full whitespace-nowrap items-center overflow-x-auto mb-5 mt-10">
                        {selectedCategories.map(category => (
                            <div className="hover:bg-primary duration-[0.2s] bg-[#EEEEEE] w-fit px-3 mx-2 py-1.5 cursor-pointer group">
                                <h6 className={`text-sm text-black group-hover:text-white font-bold ${rowdies.className}`}>{category.title}</h6>
                            </div>
                        ))}
                    </div>
                    <div  className="bg-black w-[70%] h-[0.8px] mx-auto my-5"/>
                    <p className="font-bold text-center mt-5">{article.author.name}</p>
                    <p className="text-center mt-2">{article.author.position}</p>
                    <div className="flex px-10  lg:items-center md:items-center sm:items-start xl:items-center mt-[100px] w-full lg:flex-row xl:flex-row md:flex-row sm:flex-col justify-between">
                     <div className="flex flex-col items-start sm:w-full lg:w-[50%] xl:w-[50%] md:w-[50%] ">
                      <h2 className="font-bold xl:text-5xl lg:text-5xl md:text-5xl sm:text-4xl">{cta_section?.title}</h2>
                         <p className={`${montserrat.className} text-md my-5`}>{cta_section?.description}</p>
                         <div className="flex items-start justify-start mt-2">
                             <Link href={cta_section?.cta[0].link || "#"}>
                             <button className={`mt-3 text-center mb-5 text-white bg-black border-black border-2 outline-none duration-[0.1s] hover:underline hover:rounded-[8px] text-md ${inter.className} xl:px-6 lg:px-6 md:px-6 sm:px-4 xl:py-3 lg:py-3 md:py-3 sm:py-2 rounded-[4px]`}>{cta_section?.cta[0].title}</button>
                             </Link>
                             <Link href={cta_section?.cta[1].link || "#"}>
                                 <button  className={`mt-3 ml-5 text-center mb-5 text-black bg-white border-black border-2 outline-none duration-[0.1s] hover:underline hover:rounded-[8px]  text-md ${inter.className} xl:px-6 lg:px-6 md:px-6 sm:px-4 xl:py-3 lg:py-3 md:py-3 sm:py-2 rounded-[4px]`}>{cta_section?.cta[1].title}</button>
                             </Link>
                             </div>
                     </div>
                        <div className="sm:w-full lg:w-[50%] xl:w-[50%] md:w-[50%] flex overflow-hidden xl:justify-center md:justify-center lg:justify-center sm:justify-start sm:mt-5">
                            <img alt={cta_section?.title} title={cta_section?.title} src={cta_section?.image && urlForImage(cta_section?.image)?.url()} className="w-[90%] duration-[0.2s] group-hover:scale-125 h-full lg:min-h-[400px] md:min-h-[300px] xl:min-h-[400px] sm:min-h-[200px] min-w-[300px] object-cover"/>
                        </div>
                    </div>
               </main>
            <Footer sponsors={sponsors} data={footer} social={social} policies={policies} general={general}/>
        </>
    )
}