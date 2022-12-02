import { useAccount, useConnect, useContractReads, useDisconnect } from "wagmi";
import { addressSummary } from "../../utils/address";
import { formatUSD } from "../../utils/currency";
import dyadABI from "../../consts/abi/dNFTABI.json";
import poolABI from "../../consts/abi/poolABI.json";
import Button from "../Button";
import { useState } from "react";
import { CONTRACT_DYAD, CONTRACT_POOL } from "../../consts/contract";
import logo from "../../static/dyad-logo.svg";
import WalletOutlined from "@ant-design/icons/lib/icons/WalletOutlined";
import { dNFT_PRICE } from "../../consts/consts";
import ProgressBar from "../ProgressBar";
import { CloseOutlined, MenuOutlined, WarningFilled } from "@ant-design/icons";
import MobileMenu from "../MobileMenu";
import useTVL from "../../hooks/useTVL";

export const NavBar = ({ isSafetyModeActivated, reload }) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { tvl } = useTVL([reload]);

  const [balanceOf, setBalanceOf] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);

  const {} = useContractReads({
    contracts: [
      {
        addressOrName: CONTRACT_DYAD,
        contractInterface: dyadABI,
        functionName: "balanceOf",
        args: [address],
      },
      {
        addressOrName: CONTRACT_POOL,
        contractInterface: poolABI,
        functionName: "lastEthPrice",
      },
    ],
    onSuccess: (data) => {
      if (data) {
        setBalanceOf(parseInt(data[0]._hex) / 10 ** 18);
        setEthPrice(parseInt(data[1]._hex) / 10 ** 8);
      }
    },
  });
  return (
    <div>
      <div
        className="flex items-center justify-between border-b border-gray-800 p-2"
        style={{
          backgroundColor: isSafetyModeActivated && "#2F0F13",
          borderBottom: "0.02rem solid #403B39",
        }}
      >
        <div className="flex md:gap-16 items-center justiy-center">
          <div
            className="md:hidden mr-2 ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </div>
          <img src={logo} alt="logo" className="w-14" />
          {isSafetyModeActivated && (
            <div className="hidden md:flex gap-2 items-center justify-center">
              <WarningFilled style={{ color: "#E34158" }} />
              <div style={{ color: "#E34158" }}>Safety Mode Activated</div>
            </div>
          )}
        </div>
        {!isMenuOpen && (
          <div className="flex gap-8 items-center justify-center">
            <div className="gap-8 items-center justify-center hidden md:flex  mr-8">
              <div className="flex gap-4">
                <div>TVL</div>
                <div>{formatUSD(tvl)}</div>
              </div>
              <div className="w-[2px] h-[2rem] bg-[#737E76]"></div>
              <div className="flex gap-4">
                <div>dNFT Floor</div>
                <div>{formatUSD(dNFT_PRICE)}</div>
              </div>
              <div className="w-[2px] h-[2rem] bg-[#737E76]"></div>
              <div className="flex gap-1 items-center justify-center">
                <div>CR</div>
                <ProgressBar percent={23} />
              </div>
              {address ? (
                <Button
                  onClick={() => disconnect()}
                  borderColor="#463D81"
                  bgColor="#0F0D1B"
                >
                  <div className="flex items-center gap-2">
                    <a className="cursor-pointer">Disconnect</a>
                    <div>{addressSummary(address, 3)}</div>
                  </div>
                </Button>
              ) : (
                <Button
                  borderColor="#463D81"
                  bgColor="#0F0D1B"
                  onClick={() => {
                    connect({ connector: connectors[4] }); // 4 is for metamask
                  }}
                >
                  <div className="flex gap-2 items-center justify-center">
                    <WalletOutlined />
                    <div>Connect</div>
                  </div>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {isMenuOpen && <MobileMenu tvl={tvl} />}
      {isSafetyModeActivated && (
        <div className="md:hidden flex gap-2 items-center justify-center m-2">
          <WarningFilled style={{ color: "#E34158" }} />
          <div style={{ color: "#E34158" }}>Safety Mode Activated</div>
        </div>
      )}
    </div>
  );
};
