import type { Metadata, ResolvingMetadata } from "next";
import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: "400" });
type Props = {
  params: { fullName: string };
};
import { sanityFetch } from "@/lib/fetch";
import {
  playerQuery,
  Player,
  generalQuery,
  generalResponse,
} from "@/lib/queries";
import { urlForImage } from "@/lib/utils";
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const [firstName, lastName] = params.fullName.split("-");

  const [player, general] = await Promise.all([
    sanityFetch<Player>({
      query: playerQuery(firstName, lastName),
    }),

    sanityFetch<generalResponse>({
      query: generalQuery,
    }),
  ]);

  return {
    title: `${general.title} - ${player?.first_name + " " + player?.last_name}`,
    description: `Player overview - ${
      player?.first_name + " " + player?.last_name
    }`,
    icons: {
      icon: player?.profile && urlForImage(player?.profile)?.url(),
    },
    openGraph: {
      title: `${general.title} - ${player?.first_name + " " + player?.last_name}`,
      description: `Player overview - ${
        player?.first_name + " " + player?.last_name
      }`,
      images: [`${player?.profile && urlForImage(player?.profile)?.url()}`],
    },
  };
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
