"use client";
import { BannerResponse } from "@/lib/queries";
import { kanit_bold } from "../../../fonts";
import { urlForImage } from "@/lib/utils";

interface Props {
  banner: BannerResponse;
}

const TableBanner = ({ banner }: Props) => {
  return (
    <div className="w-full relative h-fit py-10">
      <img
        src={banner.background && urlForImage(banner.background)?.url()}
        alt="banner"
        className="object-cover w-full h-full min-h-[150px] max-h-[150px]"
      />
      <div className="absolute sm:flex-col sm:justify-center md:flex-row lg:flex-row xl:flex-row xxl:flex-row top-0 left-0 flex md:justify-start lg:justify-start xl:justify-start xxl:justify-start items-center w-full h-full">
        <h1
          className={`group-hover:underline sm:ml-0 md:ml-40 lg:ml-40 xl:ml-40 xxl:ml-40 text-left xl:text-5xl text-white md:text-4xl sm:text-3xl lg:text-5xl  font-bold ${kanit_bold.className} group-hover:underline xl:text-5xl md:text-4xl sm:text-3xl lg:text-5xl py-5 font-bold ${kanit_bold.className}`}
        >
          Fixtures
        </h1>
      </div>
    </div>
  );
};

export default TableBanner;
