import { useAccount, useContractReads } from "wagmi";
import { dNFT_PRICE } from "../consts/consts";
import { CONTRACT_dNFT } from "../consts/contract";
import abi from "../consts/abi/dNFTABI.json";
import { useEffect, useState } from "react";
import { formatUSD } from "../utils/currency";
import { calcRank, dyadMultiplier, xpCurve } from "../utils/stats";
import Mint from "./Mint";
import Popup from "./Popup";
import { useDisclosure } from "@chakra-ui/react";
import Button from "./Button";
import Sync from "./Sync";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

export default function NFT({ averageXP, index, reload, setReload, xps }) {
  const TD = {};

  const { address } = useAccount();

  const [xp, setXP] = useState();
  const [dyad, setDyad] = useState();
  const [dyadBalance, setDyadBalance] = useState();

  const [tokenId, setTokenId] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenSync,
    onOpen: onOpenSync,
    onClose: onCloseSync,
  } = useDisclosure();
  const {
    isOpen: isOpenDeposit,
    onOpen: onOpenDeposit,
    onClose: onCloseDeposit,
  } = useDisclosure();
  const {
    isOpen: isOpenWithdraw,
    onOpen: onOpenWithdraw,
    onClose: onCloseWithdraw,
  } = useDisclosure();

  const {} = useContractReads({
    contracts: [
      {
        addressOrName: CONTRACT_dNFT,
        contractInterface: abi,
        functionName: "tokenOfOwnerByIndex",
        args: [address, index],
      },
    ],
    onSuccess: (data) => {
      console.log("tokenOfOwnerByIndex", parseInt(data[0]._hex));
      if (data && data[0]) {
        setTokenId(parseInt(data[0]._hex));
      }
    },
  });

  const { refetch } = useContractReads({
    contracts: [
      {
        addressOrName: CONTRACT_dNFT,
        contractInterface: abi,
        functionName: "xp",
        args: [tokenId],
      },
      {
        addressOrName: CONTRACT_dNFT,
        contractInterface: abi,
        functionName: "dyadMinted",
        args: [tokenId],
      },
      {
        addressOrName: CONTRACT_dNFT,
        contractInterface: abi,
        functionName: "virtualDyadBalance",
        args: [tokenId],
      },
    ],
    onSuccess: (data) => {
      if (data && data[0]) {
        console.log("xp", data[0]._hex);
        console.log("xp", parseInt(data[0]._hex));
        setXP(parseInt(data[0]._hex));
        setDyad(parseInt(data[1]._hex));
        setDyadBalance(parseInt(data[2]._hex));
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [reload]);

  const HEADER = "text-gray-500 text-sm";

  return (
    <>
      <tr className="flex">
        <td className="flex flex-col items-start">
          <div className={HEADER}>Rank</div>
          <div>#{calcRank(xps, xp)}</div>
        </td>
        <td className="flex flex-col items-start">
          <div className={HEADER}>Value</div>
          <div>{formatUSD(dNFT_PRICE)}</div>
        </td>
        <td className="flex flex-col items-start">
          <div className={HEADER}>Performance</div>
          <div className="flex flex-col text-s">
            <div>
              {dyadMultiplier(dNFT_PRICE, dNFT_PRICE, xp, averageXP)}x/
              {1 / dyadMultiplier(dNFT_PRICE, dNFT_PRICE, xp, averageXP)}x
            </div>
            <div className="w-[5rem]">
              {Math.round(xpCurve(1) * 10000) / 10000}x XP
            </div>
          </div>
        </td>
        <td className="flex flex-col items-start">
          <div className={HEADER}>Minted $DYAD</div>
          <div className="flex">
            <div>{dyad && Math.round((dyad / 10 ** 18) * 100) / 100}</div>
            <Button onClick={onOpen}>mint</Button>
          </div>
        </td>
        <td style={TD}> </td>
        <td style={TD}></td>
        <td style={TD}>
          {dyadBalance && Math.round((dyadBalance / 10 ** 18) * 100) / 100}{" "}
        </td>
        <td style={TD}>
          <Button onClick={onOpenDeposit}>deposit</Button>
        </td>
        <td style={TD}>
          <Button onClick={onOpenWithdraw}>withdraw</Button>
        </td>
        <td style={TD}>{xp && xp}</td>
        <td>
          <Button onClick={onOpenSync}>sync</Button>
        </td>
      </tr>
      <Popup isOpen={isOpen} onClose={onClose}>
        <Mint
          tokenId={tokenId}
          reload={reload}
          setReload={setReload}
          onClose={onClose}
        />
      </Popup>
      <Popup isOpen={isOpenDeposit} onClose={onCloseDeposit}>
        <Deposit
          tokenId={tokenId}
          reload={reload}
          setReload={setReload}
          onClose={onCloseDeposit}
        />
      </Popup>
      <Popup isOpen={isOpenWithdraw} onClose={onCloseWithdraw}>
        <Withdraw
          tokenId={tokenId}
          reload={reload}
          setReload={setReload}
          onClose={onCloseWithdraw}
        />
      </Popup>
      <Popup isOpen={isOpenSync} onClose={onCloseSync}>
        <Sync address={address} tokenId={tokenId} />
      </Popup>
    </>
  );
}
