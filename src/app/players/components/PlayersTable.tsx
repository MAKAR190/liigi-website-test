"use client";
import { useEffect, useState } from "react";
import { Player } from "@/lib/queries";
import countries from "world-countries";
import Flag from "react-world-flags";
import InfiniteScroll from "react-infinite-scroll-component";
import { urlForImage } from "@/lib/utils";
import Link from "next/link";
import { inter, kanit } from "@/fonts";

interface PlayersPageProps {
  players: Player[];
  searchClub: string;
  searchName: string;
  searchSeason: string;
}

const PlayersPage: React.FC<PlayersPageProps> = ({
  players,
  searchClub,
  searchName,
  searchSeason,
}) => {
  const additionalCountries = [
    { title: "England", value: "GB-ENG" },
    { title: "Scotland", value: "GB-SCT" },
    { title: "Wales", value: "GB-WLS" },
    { title: "Northern Ireland", value: "GB-NIR" },
  ];

  const getCountryInfo = (isoCode: string) => {
    return (
      countries.find((country) => country.cca3 === isoCode)?.name.common ||
      additionalCountries.find((country) => country.value === isoCode)?.title ||
      "Not Found"
    );
  };

  function getAge(dateString: string) {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const filterPlayers = () => {
    const lowerSearchClub = searchClub?.toLowerCase();
    const lowerSearchName = searchName?.toLowerCase();

    let filtered = players;

    if (searchClub !== "All Clubs" && searchClub) {
      filtered = filtered.filter(
        (player) => player.club.name.toLowerCase() === lowerSearchClub
      );
    }

    if (searchName) {
      filtered = filtered.filter((player) =>
        `${player.first_name.toLowerCase()} ${player.last_name.toLowerCase()}`.includes(
          lowerSearchName
        )
      );
    }

    if (searchSeason) {
      filtered = filtered.filter((player) =>
        player.related_seasons?.some((season) => season.season === searchSeason)
      );
    }

    return filtered;
  };

  useEffect(() => {
    setLoading(true); // Set loading to true before filtering
    const filtered = filterPlayers();
    setFilteredPlayers(filtered.slice(0, 7));
    setHasMore(filtered.length > 7);
    setLoading(false); // Set loading to false after filtering is done
  }, [players, searchClub, searchName, searchSeason]);

  const fetchMorePlayers = () => {
    const currentLength = filteredPlayers.length;
    const filtered = filterPlayers();

    const newPlayers = filtered.slice(currentLength, currentLength + 7);
    setFilteredPlayers((prev) => [...prev, ...newPlayers]);
    setHasMore(currentLength + 7 < filtered.length);
  };

  return (
    <div className="overflow-x-auto my-5">
      <InfiniteScroll
        dataLength={filteredPlayers.length}
        next={fetchMorePlayers}
        hasMore={hasMore}
        loader={<p></p>}
      >
        <table className="min-w-full bg-white border-collapse shadow-md">
          <thead>
            <tr
              className={`bg-gray-100 text-gray-600 text-sm leading-normal ${kanit.className}`}
            >
              <th className="py-3 px-6 text-left">Player</th>
              <th className="py-3 px-6 text-left">Nationality</th>
              <th className="py-3 px-6 text-left">Age</th>
              <th className="py-3 px-6 text-left">Height (cm)</th>
              <th className="py-3 px-6 text-left">Position</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredPlayers.map((player) => (
              <tr
                key={player._id}
                className={`${inter.className} font-medium border-b border-gray-200 hover:bg-gray-100`}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <Link
                    className="group"
                    href={`/players/${player.first_name.toLowerCase()}-${player.last_name.toLowerCase()}`}
                  >
                    <div className="flex items-center">
                      <div className="mr-2">
                        <img
                          className="w-10 min-w-[40px] h-10 rounded-full"
                          src={
                            player.profile && urlForImage(player.profile)?.url()
                          }
                          alt={`Avatar of ${player.first_name} ${player.last_name}`}
                        />
                      </div>
                      <span className={`group-hover:underline`}>
                        {player.first_name} {player.last_name}
                      </span>
                    </div>
                  </Link>
                </td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <Flag
                      code={player.nationality}
                      style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    <h6>{getCountryInfo(player.nationality)}</h6>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <h6>{getAge(player.date_of_birth)}</h6>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <h6>{player.height}</h6>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">{player.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
      {!loading && !filteredPlayers.length && (
        <p className="text-center font-semibold my-5">
          No players have been found for this request
        </p>
      )}
    </div>
  );
};

export default PlayersPage;
