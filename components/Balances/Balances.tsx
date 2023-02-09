import React, { useEffect, useState } from "react";
import useWeb3 from "../../hooks/useWeb3";
import ERC721 from "../../config/abis/ERC721.json";
import { NFT_CONTRACT } from "../../config/addresses";
import { useWeb3React } from "@web3-react/core";
import { Toaster, toast } from "react-hot-toast";
import { genericMulticall } from "../../utils/multicall";
import uriToHttp from "../../utils";
import axios from "axios";

type Props = {};

function NftBalances({}: Props) {
  const { web3 } = useWeb3();
  const { account } = useWeb3React();
  const nftContract = new web3.eth.Contract(ERC721, NFT_CONTRACT);
  const [nftBalIds, setnftBalIds] = useState([]);
  const [nftBalancesWithMetaData, setnftBalancesWithMetaData] = useState([]);
  useEffect(() => {
    const fetchNftBalances = async () => {
      const nftBalIds = await nftContract.methods.walletOfOwner(account).call();
      setnftBalIds(nftBalIds);
      console.log("====================================");
      console.log({ nftBalIds });
      console.log("====================================");

      const nftMetaCalls = nftBalIds?.map((nftId) => {
        return {
          address: NFT_CONTRACT,
          name: "tokenURI",
          params: [nftId],
        };
      });
      const multiRes = await genericMulticall(ERC721, nftMetaCalls);
      console.log("====================================");
      console.log({ multiRes });
      console.log("====================================");

      if (multiRes?.length) {
        const metaData = multiRes?.map(async ([_uri]) => {
          const [parsedUri] = uriToHttp(_uri);
          console.log("====================================");
          console.log({ parsedUri });
          console.log("====================================");
          const { data } = await axios.get(parsedUri, {
            headers: {},
          });
          if (data) {
            console.log("====================================");
            console.log({ data });
            console.log("====================================");
            return data;
          }
        });
        Promise.allSettled(metaData).then((vals) => {
          console.log("====================================");
          console.log({ vals });
          console.log("====================================");
          if (vals?.length) {
            const parsedValues = vals
              ?.filter((v) => v?.value)
              ?.map(({ value: v }) => {
                console.log("====================================");
                console.log({ v });
                console.log("====================================");
                const [parsedUri] = uriToHttp(v?.image);
                console.log("====================================");
                console.log({ parsedUri, v });
                console.log("====================================");
                return { ...v, image: parsedUri };
              });
            console.log("====================================");
            console.log({ parsedValues });
            console.log("====================================");
            setnftBalancesWithMetaData(parsedValues);
          }
        });
      }
    };
    if (account) {
      fetchNftBalances();
    }
  }, [account]);

  return (
    <div className="flex flex-wrap gap-5">
      {!nftBalancesWithMetaData.length &&
        !nftBalIds.length &&
        new Array(3)
          .fill(1)
          ?.map((attr, idx) => <NftCardLoading key={attr + idx} />)}
      {!nftBalancesWithMetaData.length &&
        nftBalIds.length &&
        nftBalIds?.map((id) => <NftCardLoading id={id} />)}

      {nftBalancesWithMetaData?.map((nft) => {
        return <NftCard {...nft} key={nft?.id} />;
      })}
    </div>
  );
}

export default NftBalances;

function NftCard({ name, id, description, image = null, attrtibutes = null }) {
  console.log("====================================");
  console.log({
    name,
    id,
    description,
    image,
    attrtibutes,
  });
  console.log("====================================");

  return (
    <div className="overflow-hidden bg-black rounded-xl h-fit">
      <div className="flex items-center gap-5 p-5 shadow-xl bg-gray-800/90 ">
        <img
          src={
            image ??
            "https://cloudflare-ipfs.com/ipfs/QmaxaYVeFQ6weWCeP2v5Q6KMFfifVVPTduuukvRnWxNcv9"
          }
          alt={name ?? "Workoholic"}
          className="w-32 my-5 rounded-2xl"
        />

        <div className="mt-0 ">
          <h2 className="text-5xl font-bold text-pink-500">#{id}</h2>
          <h2 className="text-lg font-bold ">{name}</h2>
          <p className="text-sm">{description}</p>
        </div>
      </div>
      {attrtibutes?.length && (
        <div className="mt-0 card-body">
          <h2 className="text-xl font-bold ">Attributes</h2>
          <div className="grid grid-cols-3 gap-4">
            {attrtibutes?.map((attr) => {
              return (
                <div className="px-4 py-1 rounded-md bg-gray-400/30 w-fit">
                  <p className="text-xs capitalize">{attr?.name}</p>
                  <p className="text-sm">{JSON.stringify(attr?.value)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
function NftCardLoading({ loading = true, id = "" }) {
  return (
    <div className="overflow-hidden bg-black rounded-xl h-fit">
      <div className="flex items-center gap-5 p-5 shadow-xl bg-gray-800/90 ">
        <div className="bg-black rounded-xl h-52 w-52 animate animate-pulse"></div>

        <div className="mt-0 ">
          <h2 className="text-5xl font-bold text-pink-500 animate animate-pulse">
            #{id}
          </h2>
          <h2 className="text-lg font-bold "></h2>
          <p className="text-sm"></p>
        </div>
      </div>

      <div className="mt-0 card-body">
        <h2 className="text-xl font-bold "></h2>
        <div className="grid grid-cols-3 gap-4">
          {new Array(5).fill(1)?.map((attr) => {
            return (
              <div className="px-10 py-5 rounded-md bg-gray-400/30 w-fit animate animate-pulse">
                <p className="text-xs capitalize"></p>
                <p className="text-sm"></p>
              </div>
            );
          })}
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
