import React, { useState, useEffect } from "react";
import { WagmiConfig, useAccount } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { eligible } from "@attestate/delegator2";

import { getLocalAccount } from "./session.mjs";
import { client, chains, useProvider } from "./client.mjs";
import { fetchKarma } from "./API.mjs";

const Avatar = (props) => {
  let address;
  const account = useAccount();
  const localAccount = getLocalAccount(account.address);
  if (account.isConnected) {
    address = account.address;
  }
  if (localAccount) {
    address = localAccount.identity;
  }
  const isEligible =
    address && eligible(props.allowlist, props.delegations, address);

  const [avatar, setAvatar] = useState("");
  const [points, setPoints] = useState(0);
  const provider = useProvider({ chainId: 1 });

  useEffect(() => {
    const getAvatar = async () => {
      if (!address) return;

      const name = await provider.lookupAddress(address);
      if (!name) return;

      const ensResolver = await provider.getResolver(name);
      if (!ensResolver) return;

      const avatarUrl = await ensResolver.getAvatar();
      setAvatar(avatarUrl.url);
    };
    const getPoints = async () => {
      if (!address) return;

      const data = await fetchKarma(address);
      if (data && data.karma) {
        setPoints(data.karma);
      }
    };

    getPoints();
    getAvatar();
  }, [address, account.isConnected, provider]);

  if (avatar && points) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="sidebar-toggle"
          style={{
            width: "33%",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "left",
            padding: "12px 0 7px 7px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {isEligible && !localAccount && (
              <span
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0px",
                  backgroundColor: "red",
                  borderRadius: "2px",
                  minWidth: "8px",
                  height: "8px",
                }}
              />
            )}
            <img
              src={avatar}
              style={{
                borderRadius: "2px",
                height: "18px",
                width: "18px",
                border: "1px solid #828282",
              }}
            />
            <span
              style={{
                fontWeight: "bold",
                fontSize: "8px",
                marginTop: "-2px",
                color: "black",
              }}
            >
              {points.toString()}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "left",
            padding: "7px 0 7px 7px",
            position: "relative",
          }}
        >
          {isEligible && !localAccount && (
            <span
              style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                backgroundColor: "red",
                borderRadius: "2px",
                minWidth: "8px",
                height: "8px",
              }}
            />
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ paddingTop: "2px" }}
            viewBox="0 0 100 80"
            width="20"
            height="20"
          >
            <rect width="100" height="10"></rect>
            <rect y="30" width="100" height="10"></rect>
            <rect y="60" width="100" height="10"></rect>
          </svg>
          <span style={{ color: "black", marginLeft: "10px" }}>Menu</span>
        </div>
      </div>
    );
  }
};

const Form = (props) => {
  return (
    <WagmiConfig config={client}>
      <RainbowKitProvider chains={chains}>
        <Avatar {...props} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Form;
