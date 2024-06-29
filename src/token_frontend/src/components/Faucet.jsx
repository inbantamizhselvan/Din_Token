import React, { useState } from "react";
import { token_backend } from "../../../declarations/token_backend";
import { Principal } from "@dfinity/principal";

function Faucet() {
  const [isDisabled, setDisabled] = useState(false);
  const [buttonText, setButton] = useState("Gimme Gimme");
  const [alterLabel, setLabel] = useState("Get your free Din tokens here! Claim 10,000 Din coins to your account.")

  async function handleClick(event) {
    setDisabled(true);
    const result = await token_backend.payOut();
    const owner = await token_backend.getOwner();
    const ownerText = owner.toString();
    setButton(result);
    console.log(ownerText);
    if(result=="success"){
      const newLabel = "10000 Din coins have been sent to the account: " + ownerText;
      console.log(newLabel);
      setLabel(newLabel);
    }
    else if( result =="Already Claimed"){
      const claimedLabel = "You have already claimed 10000 Din coins to your account: " + ownerText;
      setLabel(claimedLabel);
    }
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>{alterLabel}</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick}
        disabled={isDisabled}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
