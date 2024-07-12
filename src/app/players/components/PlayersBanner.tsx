"use client";
import { BannerResponse } from "@/lib/queries";
import { useState, useEffect } from "react";
import { kanit_bold } from "../../../fonts";
import { urlForImage } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation"; 

interface Props {
  banner: BannerResponse;
}

const PlayersBanner = ({ banner }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setSearchTerm(search);
  }, [searchParams]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    handleSearch(searchTerm); // Call custom search handling function
  };

  // Function to handle search
  const handleSearch = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", searchTerm); // Update the search parameter

    const newUrl = `/players?${params.toString()}`;
    router.push(newUrl);
  };

  return (
    <div className="w-full relative h-fit py-10">
      <img
        src={banner.background && urlForImage(banner.background)?.url()}
        alt="banner"
        className="object-cover w-full h-full min-h-[150px] max-h-[200px]"
      />
      <div className="absolute sm:flex-col sm:justify-center md:flex-row lg:flex-row xl:flex-row xxl:flex-row top-0 left-0 flex md:justify-around lg:justify-around xl:justify-around xxl:justify-around items-center w-full h-full">
        <h1
          className={`group-hover:underline xl:text-5xl text-white md:text-4xl sm:text-3xl lg:text-5xl  font-bold ${kanit_bold.className} group-hover:underline xl:text-5xl md:text-4xl sm:text-3xl lg:text-5xl py-5 font-bold ${kanit_bold.className}`}
        >
          Players
        </h1>
        <form className="min-w-[300px]" onSubmit={handleSubmit}>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium sr-only"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-black"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full transition duration-100 hover:border-gray-950 cursor-pointer p-4 ps-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500"
              placeholder="Search players by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              
            />
            <button
              type="submit"
              className="text-white absolute transition duration-100 end-2.5 bottom-2.5 bg-gray-950 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayersBanner;
