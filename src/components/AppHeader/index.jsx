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
import WalletOption from "../WalletOption";
import logo from "../../assets/images/logo.png";
import { useHistory, useLocation } from "react-router-dom";
import { subSplit } from "../../util";
import { Menu, Dropdown } from "antd";
import useAuth from "hooks/useAuth";
import burger from "../../assets/images/burger.png";

function Index(props) {
  const history = useHistory();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { account } = useWeb3React();
  const { logout } = useAuth();
  const [active, setActive] = useState(0);

  window.ethereum &&
    window.ethereum.on("chainChanged", (_chainId) => window.location.reload());

  window.ethereum &&
    window.ethereum.on("accountsChanged", (accounts) => {
      console.log(accounts);
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
    {
      name: "POOL",
      url: "/pool",
    },
    {
      name: "SWAP",
      url: "/swap",
    },
  ];

  const onClick = ({ key }) => {
    if (key === "logout") {
      logout();
      window.localStorage.removeItem("connectorId");
    }
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="logout">Disconnect Wallet</Menu.Item>
    </Menu>
  );
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
                    onClick={() => {
                      history.push(item.url);
                      setActive(index);
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
            <WalletOption />
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
          <div className="flex items-center justify-between">
            <img src={logo} alt="piswap" className="logo" />
            <span className="close" onClick={() => setShowMenu(false)}>
              &times;
            </span>
          </div>
          <ul className="cell-list">
            {Object.keys(nameList).map((name) => {
              return (
                <li className={name === "/swap" ? "active" : ""} key={name}>
                  <a href={name === "/l2wallet" ? "/l2wallet?withdraw" : name}>
                    {nameList[name]}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Index;
