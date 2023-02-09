import type { NextPage } from "next";
import Head from "next/head";

import Header from "../components/Header";
import { useEffect, useState } from "react";

import { injected } from "../config/wallets";
import { useWeb3React } from "@web3-react/core";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import NftMint from "../components/Minter/NftMint";

const Home: NextPage = () => {
  const { activate } = useWeb3React();

  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    if (window?.ethereum) {
      activate(injected);
    } else {
      alert("You need to install a crypto wallet to run this Dapp!!");
    }
  }, [activate]);
  return (
    <div className="">
      <Head>
        <title>Workoholic NFTs Shardeum </title>
        <meta
          name="description"
          content="Workoholic NFTs collection workshop"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />

        <div className="container flex h-screen gap-5 mx-auto my-5">
          <img
            src="https://gateway.pinata.cloud/ipfs/QmaxaYVeFQ6weWCeP2v5Q6KMFfifVVPTduuukvRnWxNcv9"
            alt=""
            className=" h-fit rounded-xl w-52"
          />
          <NftMint />
        </div>
      </main>
    </div>
  );
};

export default Home;
