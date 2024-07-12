import type { Metadata, ResolvingMetadata } from "next";
import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: "400" });
type Props = {
  params: {};
  searchParams: { season: string; };
};
import { sanityFetch } from "@/lib/fetch";
import { generalQuery, generalResponse } from "@/lib/queries";
import { urlForImage } from "@/lib/utils";

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const [general] = await Promise.all([
    sanityFetch<generalResponse>({
      query: generalQuery,
    }),
  ]);

  return {
    title: `${general.title} League Tables`,
    description: `Tables of ${general.title} football league`,
    icons: {
      icon: general?.logo && urlForImage(general.logo)?.url(),
    },
    openGraph: {
      title: `${general.title} League Tables`,
      description: `Tables of ${general.title} football league`,
      images: [`${general?.logo && urlForImage(general.logo)?.url()}`],
    },
  };
}
export default function Page({
  children,
  props,
}: Readonly<{
  children: React.ReactNode;
  props: Props;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
