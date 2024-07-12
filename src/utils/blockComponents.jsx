import { inter, kanit_bold, montserrat_italic, rowdies } from "@/fonts";
import Image from "next/image";
import React from "react";
import { urlForImage, getSanityFileUrl } from "@/lib/utils";
const SampleImageComponent = ({ value }) => {
  return (
    <div key={value} className="relative h-full w-full">
      <figure className="my-4 w-full flex flex-col h-[500px]">
        <a
          href={
            value &&
            urlForImage(value)?.url()
          }
          target={"_blank"}
        >
          <Image
            objectFit="cover"
            layout="responsive"
            width={100}
            height={35}
            className="cursor-pointer my-2"
            src={
              value &&
              urlForImage(value)?.url() 
            }
            alt={value.alt || "photo"}
            title={value.alt}
          />
        </a>
        <div className="flex items-center mt-3">
          <div className="w-[2.5px] h-5 bg-black mr-2" />
          <figcaption className={`${inter.className} text-sm`}>
            {value.alt}
          </figcaption>
        </div>
      </figure>
    </div>
  );
};
const SampleFileComponent = ({ value }) => {
  const fileUrl = value && getSanityFileUrl(value);

  return (
    <div className="my-4">
      {fileUrl && (
        <a
          href={fileUrl}
          target={"_blank"}
          download
          className={`underline text-secondary ${rowdies.className}`}
        >
          {value.name}
        </a>
      )}
    </div>
  );
};
export const components = {
  types: {
    image: SampleImageComponent,
    file: SampleFileComponent,
    // Any other custom types you have in your content
    // Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
  },
  marks: {
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          className={`underline text-secondary ${rowdies.className}`}
          href={target}
        >
          {children}
        </a>
      );
    },
    quote: ({ value }) => {
      return (
        <blockquote>
          <p className={`${montserrat_italic.className} flex-1 `}>
            {value.text}
          </p>
          <span>{value.author}</span>
        </blockquote>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className={`${kanit_bold.className} text-5xl py-2`}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className={`${kanit_bold.className} text-4xl py-2`}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className={`${kanit_bold.className} text-3xl py-2`}>{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className={`${kanit_bold.className} text-2xl py-2`}>{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className={`${kanit_bold.className} text-xl py-2`}>{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className={`${kanit_bold.className} text-lg py-2`}>{children}</h6>
    ),
    normal: ({ children }) => (
      <p className={`py-3 text-md font-medium`}>{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="ulContentList">{children}</ul>,
    number: ({ children }) => <ol className="olContentList">{children}</ol>,
  },
  listItem: ({ children }) => (
    <li className={`${inter.className} pl-5`}>{children}</li>
  ),
};
