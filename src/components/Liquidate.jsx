import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { CONTRACT_POOL } from "../consts/contract";
import { round } from "../utils/currency";
import PoolABI from "../abi/Pool.json";
import { useState } from "react";
import TextInput from "./TextInput";
import { parseEther } from "../utils/currency";
import PopupContent from "./PopupContent";
import useEthBalance from "../hooks/useEthBalance";
import useNfts from "../hooks/useNfts";

export default function Liquidate({ nft, tokenId, onClose, setTxHash }) {
  console.log("id", tokenId);
  const [wETH, setWETH] = useState("");
  const { address } = useAccount();
  const { ethBalance } = useEthBalance();

  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_POOL,
    contractInterface: PoolABI["abi"],
    functionName: "claim",
    args: [tokenId, address],
    overrides: {
      value: parseEther(wETH),
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess: (data) => {
      onClose();
      setTxHash(data?.hash);
    },
  });

  return (
    <PopupContent
      title="Claim dNFT"
      btnText="CLAIM"
      onClick={() => {
        onClose();
        write?.();
      }}
      isDisabled={!write}
    >
      <div className="flex flex-col gap-2 items-center">
        <div className="flex gap-4 justify-between items-between w-full">
          <TextInput
            value={wETH}
            onChange={(v) => {
              setWETH(v);
            }}
            placeholder={0}
            type="number"
          />
          <div className="items-end flex flex-col">
            <div className="flex items-center justify-center gap-1">
              <div>
                <img
                  className="w-4"
                  src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png"
                  alt=""
                />
              </div>
              <div>ETH</div>
            </div>
            <div className="text-[#737E76]">Balance:{round(ethBalance, 2)}</div>
          </div>
        </div>
      </div>
    </PopupContent>
  );
}
