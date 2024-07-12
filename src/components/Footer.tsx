"use client";
import React, { useState, useEffect } from "react";
import { inter, kanit, kanit_bold, montserrat, rowdies } from "@/fonts";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/utils";
const MainFooter = ({ data, social }: any) => {
  return (
    <div className="w-full bg-black p-5 flex flex-col">
      <div className="flex lg:flex-row xl:flex-row md:flex-row sm:flex-col justify-between items-start m-2 w-full">
        <div className="flex  flex-col items-start">
          <h3
            className={`text-4xl text-white pb-1 font-bold ${kanit_bold.className}`}
          >
            {data.title}
          </h3>
          <p className={`${rowdies.className} text-md text-secondary`}>
            {data.tagline}
          </p>
        </div>
        <div className="flex sm:py-5 mr-5  sm:justify-between md:justify-evenly lg:justify-evenly xl:justify-evenly ">
          {social.map((el: any, i: number) => (
            <div
              className="bg-white mx-2 rounded-full duration-[0.2s] relative hover:bg-secondary cursor-pointer p-2"
              key={el._id}
            >
              <Link href={el.url || "#"}>
                <img
                  src={el.icon && urlForImage(el.icon)?.url()}
                  className="w-8 h-8 duration-[0.2s]"
                  alt={el.name}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="grid max-[450px]:grid-cols-1 grid-cols-3 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-5 w-full mx-2 my-10">
        {data.cols.map((col: any) => (
          <div className="flex flex-col items-start">
            <Link href={col.headline_link || "#"}>
              <h6
                className={`mb-3 text-lg text-amber-50 ${rowdies.className} hover:underline decoration-dashed underline-offset-2`}
              >
                {col.headline}
              </h6>
            </Link>
            {col.links &&
              col.links.map((link: any) => (
                <Link href={link.col_link_link || "#"}>
                  <p className="text-sm text-white my-2 hover:text-secondary">
                    {link.col_title}
                  </p>
                </Link>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};
const SubFooter = ({ policies, general }: any) => {
  return (
    <div className="flex lg:flex-row xl:flex-row md:flex-row sm:flex-col justify-between items-center p-1">
      <div className="flex">
        <Image
          className="cursor-pointer sm:py-2 md:py-0 xl:py-0 lg:py-0"
          src={general.logo && urlForImage(general.logo)?.url()}
          alt={`${general.title}_LoGo`}
          title={general.title}
          width={100}
          height={100}
        />
        <Image
          className="cursor-pointer scale-75 sm:py-2 md:py-0 xl:py-0 lg:py-0"
          src={general.second_logo && urlForImage(general.second_logo)?.url()}
          alt={`${general.title}_LoGo`}
          title={general.title}
          width={100}
          height={100}
        />
      </div>
      <div className="flex sm:py-5 md:py-0 xl:py-0 lg:py-0 justify-evenly w-[25%] min-w-[300px] items-center">
        {policies.map((policy: any) => (
          <Link href={`/policies/${policy.slug.current}`}>
            <p className="text-sm underline hover:underline-offset-2 duration-[0.1s] underline-offset-1">
              {policy.title}
            </p>
          </Link>
        ))}
        <Link href={"#"}>
          <p className="text-sm underline hover:underline-offset-2 duration-[0.1s] underline-offset-1">
            Back To Top
          </p>
        </Link>
      </div>
      <p
        className={`${montserrat.className} sm:py-2 md:py-0 xl:py-0 lg:py-0 text-md`}
      >
        © {new Date().getFullYear()} {general.title}. All rights reserved.
      </p>
    </div>
  );
};
const Footer = ({ sponsors, data, social, policies, general }: any) => {
  return (
    <div id="footer">
      <section className="mt-[80px]">
        <div className="flex justify-around lg:w-[90%] md:w-[90%] sm:w-[99%] xl:w-[90%] mx-auto flex-wrap items-center">
          {sponsors.map((sponsor: any) => (
            <Link
              key={sponsor._id}
              href={sponsor.link || "#"}
              className="p-4 flex flex-grow lg:w-[22.5%] md:w-[22.5%] sm:w-[45%] xl:w-[22.5%] min-h-[160px] justify-around items-center flex-col"
            >
              <img
                src={sponsor?.image && urlForImage(sponsor?.image)?.url()}
                title={sponsor.kind}
                alt={sponsor.kind}
                className="min-w-[150px] max-h-[180px] min-h-[30px] max-w-[180px]"
              />
              <p className={`${montserrat.className} text-sm`}>
                {sponsor.kind}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <footer className="flex flex-col w-full mt-10">
        <MainFooter data={data} social={social} />
        <SubFooter policies={policies} general={general} />
      </footer>
    </div>
  );
};
export default Footer;
