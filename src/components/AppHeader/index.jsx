/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import "./index.scss";
import { useWeb3React } from "@web3-react/core";
import Button from "../ConnectButton";
import ConnectWallet from "../ConnectWallet";
import logo from "../../assets/images/logo.png";
import { useHistory, useLocation } from "react-router-dom";
import { subSplit } from "../../util";
import { Menu, Dropdown, Spin, Select } from "antd";
import useAuth from "hooks/useAuth";
import burger from "../../assets/images/burger.png";
import HomeTool from "../../utils/index_c";

function Index(props) {
  const history = useHistory();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { account } = useWeb3React();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  // window.ethereum &&
  //   window.ethereum.on("chainChanged", (_chainId) => window.location.reload());

  window.ethereum &&
    window.ethereum.on("accountsChanged", (accounts) => {
      window.location.reload();
    });

  const nameList = {
    "/": "HOME",
    "/l2wallet": "L2 WALLET",
    "/pool": "POOL",
    "/swap": "SWAP",
  };
  const MenuList = [
    {
      name: "HOME",
      url: "/",
    },
    // {
    //   name: "POOL",
    //   url: "/pool",
    // },
    {
      name: "SWAP",
      url: "/swap",
    },
  ];

  const onClick = ({ key }) => {
    logout();
    window.localStorage.removeItem("connectorId");
    window.location.reload();
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="logout">Disconnect Wallet</Menu.Item>
    </Menu>
  );
  const [network, setNetwork] = useState("1");
  const selectNet = async (value) => {
    const result = await HomeTool.switchChain(
      +value === 1 ? 8007736 : 10067275
    );
    !setShowMenu(false);
    !result && setNetwork(value);
    !result && window.changeNet(+value);
  };
  useEffect(() => {
    const { location } = history;
    switch (location.pathname) {
      case "/":
        setActive(0);
        break;
      // case "/pool":
      //   setActive(1);
      //   break;
      case "/swap":
        setActive(1);
        break;
      default:
        setActive(0);
    }
    setTimeout(() => {
      const { ethereum } = window;
      const chainId = HomeTool.web3.utils.hexToNumber(ethereum.chainId);
      console.log(chainId);
      setNetwork(chainId === 8007736 ? "1" : "2");
    },100);
  }, []);
  return (
    <header className="flex items-center header">
      <div className="flex items-center justify-between header-wrap flex-nowrap">
        <img src={logo} alt="piswap" className="logo" />
        <>
          <div className="hidden header-title sm:block">
            <ul>
              {MenuList.map((item, index) => {
                return (
                  <li
                    key={`menu-${item.name}`}
                    onClick={async () => {
                      // const result = await HomeTool.switchChain(
                      //   item.name === "HOME" ? 8007736 : 2099156
                      // );
                      // if(result != null){
                      //   return
                      // }
                      setLoading(true);
                      setTimeout(
                        () => {
                          setLoading(false);
                          history.push(item.url);
                          setActive(index);
                        },
                        item.name === "SWAP" ? 1500 : 200
                      );
                    }}
                    className={`${active === index ? "active" : ""}`}
                  >
                    {item.name}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="block header-title sm:hidden">
            {nameList[location.pathname]}
          </div>
        </>
        <>
          <div
            className="items-center hidden mt-4 sm:mt-0 sm:flex"
            id="header-right"
          >
            {/* <WalletOption /> */}
            <div className="select-network">
              <Select
                defaultValue="1"
                style={{ width: 220 }}
                value={network}
                onChange={selectNet}
                size="large"
                options={[
                  {
                    value: "1",
                    label: "Plian Mainnet Subchain 1",
                  },
                  {
                    value: "2",
                    label: "Plian Testnet Subchain 1",
                  },
                ]}
              />
            </div>
            {account ? (
              <Dropdown
                overlay={menu}
                trigger={["click"]}
                getPopupContainer={() =>
                  document.getElementById("header-right")
                }
              >
                <Button>{subSplit(account, 6, 4)}</Button>
              </Dropdown>
            ) : (
              <ConnectWallet>
                <Button>Connect Wallet</Button>
              </ConnectWallet>
            )}
          </div>
          <div
            className="block burger sm:hidden"
            onClick={() => setShowMenu(true)}
          >
            <img src={burger} alt="memu" />
          </div>
        </>
      </div>

      {showMenu && (
        <div className="block open-menu sm:hidden">
          <div
            className="menu-mask"
            onClick={() => {
              setShowMenu(false);
            }}
          ></div>
          <div className="menu-inner">
            <div className="flex items-center justify-between">
              <img src={logo} alt="piswap" className="logo" />
              <span className="close" onClick={() => setShowMenu(false)}>
                &times;
              </span>
            </div>
            <ul className="cell-list">
              {MenuList.map((item, index) => {
                return (
                  <li
                    key={`menu-${item.name}`}
                    onClick={async () => {
                      // const result = await HomeTool.switchChain(
                      //   item.name === "HOME" ? 8007736 : 2099156
                      // );
                      // if(result != null){
                      //   return
                      // }
                      setLoading(true);
                      setShowMenu(false);
                      setTimeout(
                        () => {
                          setLoading(false);
                          history.push(item.url);
                          setActive(index);
                        },
                        item.name === "SWAP" ? 1500 : 200
                      );
                    }}
                    className={`${active === index ? "active" : ""}`}
                  >
                    {item.name}
                  </li>
                );
              })}
            </ul>
            <div className="oper-drop">
              <div className="select-network">
                <Select
                  defaultValue="1"
                  style={{ width: 120 }}
                  value={network}
                  onChange={selectNet}
                  size="large"
                  options={[
                    {
                      value: "1",
                      label: "Mainnet",
                    },
                    {
                      value: "2",
                      label: "Testnet",
                    },
                  ]}
                />
              </div>
              {account ? (
                <button onClick={onClick}>Disconnect wallet</button>
              ) : (
                <ConnectWallet>
                  <button className="connect-wallet-side">
                    Connect Wallet
                  </button>
                </ConnectWallet>
              )}
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="waiting-route">
          <div className="loading">
            <Spin size="large" />
            <p>Please wait...</p>
          </div>
        </div>
      )}
    </header>
  );
}

export default Index;
