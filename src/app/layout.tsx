import type { Metadata, ResolvingMetadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
const roboto = Roboto({ subsets: ["latin"], weight: "400" });
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "react-multi-carousel/lib/styles.css";
import { sanityFetch } from "@/lib/fetch";
import { generalResponse, generalQuery } from "@/lib/queries";
import { urlForImage } from "@/lib/utils";
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);
export async function generateMetadata(
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [general] = await Promise.all([
    sanityFetch<generalResponse>({
      query: generalQuery,
    }),
  ]);

  return {
    title: `Lagos-based Professional League News, Fixtures, Scores & Results`,
    description: `For all the latest ${general.title} news, visit the official website of the ${general.title}.`,
    icons: {
      icon: general.logo && urlForImage(general.logo)?.url(),
    },
    openGraph: {
      title: `Lagos-based Professional League News, Fixtures, Scores & Results`,
      description: `For all the latest ${general.title} news, visit the official website of the ${general.title}.`,
      images: general.logo && [`${urlForImage(general?.logo)?.url()}`],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [general] = await Promise.all([
    sanityFetch<generalResponse>({
      query: generalQuery,
    }),
  ]);
  return (
    <html lang="en">
      <body className={roboto.className}>
        <style>{`
      :root{
                  --foreground-rgb: 0, 0, 0;
                  --background-start-rgb: 214, 219, 220;
                  --background-end-rgb: 255, 255, 255;
                  --primary-color: ${general?.primary_color.hex};
                  --secondary-color: ${general?.secondary_color.hex};
      }
      
      `}</style>
        {children}
      </body>
    </html>
  );
}
