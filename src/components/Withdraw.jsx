import { useContractWrite, usePrepareContractWrite, useAccount } from "wagmi";
import { CONTRACT_dNFT } from "../consts/contract";
import Button from "./Button";
import abi from "../consts/abi/dyadABI.json";
import { useEffect, useState } from "react";
import TextInput from "./TextInput";

export default function Withdraw({ address, tokenId }) {
  const [dyad, setDyad] = useState(0);
  const [ethToUSD, setEthToUSD] = useState(0);

  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_dNFT,
    contractInterface: abi,
    functionName: "withdraw",
    args: [tokenId, dyad],
  });

  useEffect(() => {
    async function getETHPrice() {
      const res = await fetch(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR"
      );
      const data = await res.json();
      setEthToUSD(data.USD);
    }

    getETHPrice();
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <div className="flex flex-col gap-4 items-center p-4">
      <div className="flex gap-2 text-2xl items-center">
        <div className="w-[10rem]">
          <TextInput
            value={dyad}
            onChange={(v) => setDyad(v)}
            placeholder={0}
          />
        </div>
        <div className="underline">$DYAD</div>
      </div>
      {/* <div>to</div> */}
      {/* <div className="text-2xl">${wETH * ethToUSD} ETH</div> */}
      <Button disabled={!write} onClick={() => write?.()}>
        withdraw DYAD
      </Button>
    </div>
  );
}