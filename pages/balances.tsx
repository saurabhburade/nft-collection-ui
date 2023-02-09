import React from "react";
import Header from "../components/Header";
import NftMint from "../components/Minter/NftMint";
import { useWeb3React } from "@web3-react/core";
import NftBalances from "../components/Balances/Balances";

type Props = {};

function balances({}: Props) {
  const { activate, account } = useWeb3React();

  return (
    <main>
      <Header />

        <div className="flex h-screen gap-5 mx-10 my-5 ">
          <NftBalances />
        </div>

    </main>
  );
}

export default balances;
