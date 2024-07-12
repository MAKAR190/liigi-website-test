"use client";
import { inter, kanit, montserrat, rowdies } from "@/fonts";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import VideoMark from "./videoMark";
import Link from "next/link";
import { urlForImage } from "@/lib/utils";

function createSlug(category: string, slug: string, type: string) {
  return `/${type}/${
    category.charAt(0).toLowerCase() + category.slice(1, category.length)
  }/${slug}`;
}

const NewsList = ({ type, news }: { type?: string; news: any }) => {
  const productListRef = useRef<HTMLDivElement>(null);
  const product = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkScrollLimit = () => {
      if (productListRef.current) {
        const list = productListRef.current;
        const left = list.scrollLeft;
        const width = list.clientWidth;
        const scrollWidth = list.scrollWidth;

        const newCanScrollLeft = left > 0;
        const newCanScrollRight = left + width < scrollWidth - 10;

        setCanScrollLeft(newCanScrollLeft);
        setCanScrollRight(newCanScrollRight);
      }
    };

    checkScrollLimit();

    const productListElement = productListRef.current;
    if (productListElement) {
      productListElement.addEventListener("scroll", checkScrollLimit);
      return () => {
        productListElement.removeEventListener("scroll", checkScrollLimit);
      };
    }
  }, [canScrollLeft, canScrollRight]);

  const scrollByAmount = (amount: number) => {
    if (productListRef.current) {
      productListRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Sort the news items by _updatedAt in descending order
  const sortedNews = news.sort((a: any, b: any) => {
    return new Date(b._updatedAt).getTime() - new Date(a._updatedAt).getTime();
  });

  return (
    <section
      id="news"
      className="mt-10 product-list-container overflow-auto whitespace-nowrap w-full"
    >
      <div
        ref={productListRef}
        id="product-list"
        className="product-list-container relative overflow-auto whitespace-nowrap w-full py-5"
      >
        <div className="product-list inline-flex w-full xl:px-8 lg:px-8 md:px-6 sm:px-0">
          {sortedNews.map((newsItem: any) => (
            <div
              key={newsItem._id}
              ref={product}
              className={`product group max-w-[500px] lg:w-[50%] xl:w-[50%] md:w-[35%] sm:w-[20%] cursor-pointer inline-block px-2 sm:min-w-[320px] md:min-w-[420px] lg:min-w-[420px] xl:min-w-[420px]`}
            >
              <Link
                href={createSlug(
                  newsItem.category.title,
                  newsItem.slug.current,
                  newsItem._type
                )}
              >
                <div
                  className={`square-image-wrapper relative overflow-hidden ${
                    type === "video" ? "rounded-[4px]" : "rounded-none"
                  }`}
                >
                  <img
                    alt={newsItem.title}
                    title={newsItem.title}
                    src={
                      newsItem._type === "video"
                        ? newsItem.video.preview &&
                          urlForImage(newsItem.video.preview)?.url()
                        : newsItem.preview &&
                          urlForImage(newsItem.preview)?.url()
                    }
                    className="w-full duration-[0.2s] group-hover:scale-125 md:min-h-[300px] lg:min-h-[300px] xl:min-h-[300px] sm:min-h-[200px] object-cover"
                  />
                  {type === "video" && <VideoMark url={newsItem.video.url} />}
                </div>
              </Link>
              <div className="text-wrap">
                <div className="flex items-center mt-4">
                  <div className="bg-primary w-fit px-3 py-1.5">
                    <h6
                      className={`text-sm text-white font-bold ${rowdies.className}`}
                    >
                      {newsItem.category.title}
                    </h6>
                  </div>
                  <p
                    className={`font-medium text-sm text-center ml-3 ${rowdies.className}`}
                  >
                    {formatDate(newsItem._createdAt)}
                  </p>
                </div>
                <Link
                  href={createSlug(
                    newsItem.category.title,
                    newsItem.slug.current,
                    newsItem._type
                  )}
                >
                  <h3
                    className={`text-lg group-hover:underline font-bold py-2 ${kanit.className}`}
                  >
                    {newsItem.title}
                  </h3>
                </Link>
                {type !== "video" && (
                  <>
                    <p
                      className={`text-md font-medium ${montserrat.className}`}
                    >
                      {newsItem.shortDescription}
                    </p>
                    <Link
                      href={createSlug(
                        newsItem.category.title,
                        newsItem.slug.current,
                        newsItem._type
                      )}
                    >
                      <button
                        className={`my-4 duration-[0.1s] flex items-center text-md ${inter.className}`}
                      >
                        Read More
                        <Image
                          className={
                            "ml-3 -rotate-90 group-hover:ml-4 duration-[0.1s]"
                          }
                          src={"/black-arrow-down.svg"}
                          alt={"arrow-down"}
                          width={15}
                          height={15}
                        />
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-[1024px]:hidden justify-end items-center flex pr-[3%] mt-[2%]">
        <button
          disabled={!canScrollLeft}
          onClick={() => scrollByAmount(-500)}
          className="disabled:opacity-25 group scroll-button-left bg-white active:outline-blue-700 focus:outline-blue-700 focus:outline-1 active:outline-1 flex hover:bg-[#000] hover:border-white duration-[0.2s] cursor-pointer border-[1px] border-black justify-center items-center rounded-[50%] min-w-[70px] mx-2 min-h-[70px] w-fit"
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="group-hover:fill-amber-50"
              d="M20 10.9998H7.83L13.42 5.40976L12 3.99976L4 11.9998L12 19.9998L13.41 18.5898L7.83 12.9998H20V10.9998Z"
              fill="black"
            />
          </svg>
        </button>
        <button
          disabled={!canScrollRight}
          onClick={() => scrollByAmount(500)}
          className="disabled:opacity-25 group scroll-button-left bg-white active:outline-blue-700 focus:outline-blue-700 focus:outline-1 active:outline-1 flex hover:bg-[#000] hover:border-white duration-[0.2s] cursor-pointer border-[1px] border-black justify-center items-center rounded-[50%] min-w-[70px] mx-2 min-h-[70px] w-fit"
        >
          <svg
            className="rotate-180"
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="group-hover:fill-amber-50 "
              d="M20 10.9998H7.83L13.42 5.40976L12 3.99976L4 11.9998L12 19.9998L13.41 18.5898L7.83 12.9998H20V10.9998Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default NewsList;
