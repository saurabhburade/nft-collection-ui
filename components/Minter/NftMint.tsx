import React, { useEffect, useState } from "react";
import useWeb3 from "../../hooks/useWeb3";
import ERC721 from "../../config/abis/ERC721.json";
import { NFT_CONTRACT } from "../../config/addresses";
import { useWeb3React } from "@web3-react/core";
import { Toaster, toast } from "react-hot-toast";
type Props = {};

function NftMint({}: Props) {
  const { web3 } = useWeb3();
  const { account } = useWeb3React();
  const nftContract = new web3.eth.Contract(ERC721, NFT_CONTRACT);
  const [maxMintLimit, setmaxMintLimit] = useState(0);
  const [amountToMint, setamountToMint] = useState(1);
  const [nftCost, setnftCost] = useState(0);
  const [isOwner, setisOwner] = useState(false);
  useEffect(() => {
    const fetchMintLimit = async () => {
      const maxMintLimit = await nftContract.methods.maxMintAmount().call();
      const cost = await nftContract.methods.cost().call();
      const _owner = await nftContract.methods.owner().call();

      if (_owner == account) {
        setisOwner(true);
      }

      setmaxMintLimit(Number(maxMintLimit));
      setnftCost(cost);
    };
    fetchMintLimit();
  }, []);
  const handleOnMint = async () => {
    const toastId = toast.loading("Pending...");

    if (!account) {
      //   alert("Please connect wallet");
      toast.error("Please connect wallet", {
        id: toastId,
      });
      toast.dismiss(toastId);

      return;
    }
    try {
      const txn = isOwner
        ? await nftContract.methods.mint(amountToMint).send({
            from: account,
          })
        : await nftContract.methods.mint(amountToMint).send({
            from: account,
            value: amountToMint * nftCost,
          });
      console.log("====================================");
      console.log({ txn });
      console.log("====================================");
      if (txn?.status) {
        toast.success("Transaction Success!", {
          id: toastId,
        });

        // alert("Transaction Success!!");
      } else {
        // alert("Transaction Failed!!");
        toast.error("Transaction Failed!", {
          id: toastId,
        });
      }
    } catch (error) {
      //   alert("Transaction Failed!!");
      toast.error("Transaction Failed!", {
        id: toastId,
      });
      console.log({ error });
    }
  };
  const handleAmountToMint = async (e) => {
    const val = e?.target?.value;
    if (val && Number(val) <= maxMintLimit && Number(val) > 0) {
      setamountToMint(val);
    }
  };
  return (
    <div className="w-full">
      <div>
        <p>Max Mints : {maxMintLimit}</p>
        <p>Unit NFT Cost : {web3?.utils?.fromWei(nftCost?.toString())}</p>
        <p>
          Payable NFT Cost :{" "}
          {isOwner
            ? 0
            : web3?.utils?.fromWei((nftCost * amountToMint)?.toString())}
        </p>
      </div>
      <div>
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="flex items-center gap-5">
          <input
            type="number"
            id="search"
            className="block p-4 text-sm text-gray-900 border border-gray-300 rounded-lg w-72 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter token amount"
            min={1}
            max={2}
            value={amountToMint}
            onChange={handleAmountToMint}
            required
          />
          <button
            className="btn btn-primary"
            onClick={handleOnMint}
            disabled={nftCost <= 0}
          >
            Mint
          </button>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default NftMint;
