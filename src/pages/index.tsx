import React, { useEffect, useState } from "react";
import Wrapper from "@/components/Wrapper";
import { FadeIn } from "@/components/FadeIn";
import Image from "next/image";
import { useNFTCollectibles } from "@/lib/hooks/useNFTCollectibles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profile } from "@/data/profile";
import { ConnectKitButton } from "connectkit";
import { SendTransaction } from "@/components/SendTransaction";
import FarcasterTable from "@/components/FarcasterTable";
import { fetchFollowers, fetchFriends } from "@/scripts/Farcaster.cjs"; // Update the correct path

function LinkCard({
  href,
  title,
  image,
}: {
  href: string;
  title: string;
  image?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-1 w-full hover:scale-105 transition-all bg-purple rounded-xl mb-3 max-w-md"
    >
      <div className="flex items-center text-center max-h-12 h-12 w-full">
        <div className="w-4 h-4 ml-6">
          {image && (
            <Image
              className="rounded-sm"
              alt={title}
              src={image}
              width={16}
              height={16}
            />
          )}
        </div>
        <h2 className="flex justify-center items-center font-semibold w-full text-white -ml-10">
          {title}
        </h2>
      </div>
    </a>
  );
}

const Page: React.FC = () => {
  const [followersData, setFollowersData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const identity = "";
        const fansList = await fetchFollowers(identity);
        setFollowersData(fansList);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchData();
  }, []);

  const [friendsData, setFriendsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const identity = "";
        const fansList = await fetchFriends(identity);
        setFollowersData(fansList);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchData();
  }, []);

  const {
    loading: nftLoading,
    error: nftError,
    data: nfts,
  } = useNFTCollectibles(profile.address);
  const processAllNfts = () => {
    let nftData: any = [];
    if (!nfts[0]) return [];
    if (nfts[0]?.maticNfts?.ownedNfts)
      nftData = [...nftData, ...nfts[0].maticNfts.ownedNfts];
    if (nfts[0]?.mainnetNfts?.ownedNfts)
      nftData = [...nftData, ...nfts[0].mainnetNfts.ownedNfts];
    if (nfts[0]?.optimismNfts?.ownedNfts)
      nftData = [...nftData, ...nfts[0].optimismNfts.ownedNfts];
    return nftData;
  };
  const allNfts = processAllNfts().filter(
    (nft: any) => nft.tokenType !== "ERC1155"
  );
  // Render the profile information

  return (
    <main>
      <Image
        alt="background-image"
        src="/Banner.svg"
        height="380"
        width="2000"
        className="fixed z-[-1] top-0 left-0 object-cover md:h-96 min-h-48 w-full"
      />
      <div className="fixed top-3 right-3 z-10">
        <ConnectKitButton />
      </div>
      <Wrapper>
        <FadeIn>
          <div className="flex items-center flex-col mx-auto w-full mt-16 md:mt-32 justify-center px-2 md:px-8">
            <div className="h-40 w-40 md:h-72 md:w-72">
              <img
                className="rounded-full h-40 w-40 md:h-72  md:w-72 border"
                alt="Picture of the author"
                src={profile?.imageUrl ?? ""}
                width={288}
                height={288}
              />
            </div>
            <p className="text-white text-center text-base my-8">
              {profile?.bio ?? ""}
            </p>
            <Tabs defaultValue="Game" className="w-full">
              <TabsList className="flex items-center justify-center">
                <TabsTrigger value="Game">Play Game</TabsTrigger>
                <TabsTrigger value="Fans">Fans</TabsTrigger>
                <TabsTrigger value="Friends">Friends</TabsTrigger>
              </TabsList>

              <TabsContent value="Game">
                <SendTransaction />
              </TabsContent>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <TabsContent // AMS - replace with table of users - date followed
                  value="Fans"
                  className="place-self-center mx-auto"
                >
                  {nftLoading && <p>Loading...</p>}
                  <FarcasterTable />
                </TabsContent>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <TabsContent // AMS - remove list of NFTs
                  value="Friends" // AMS - replace with table of users - date followed
                  className="place-self-center mx-auto"
                >
                  {nftLoading && <p>Loading...</p>}
                  <FarcasterTable />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </FadeIn>
      </Wrapper>
    </main>
  );
};

export default Page;
