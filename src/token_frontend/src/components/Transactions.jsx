import React, { useState, useEffect } from "react";
import { token_backend } from "../../../declarations/token_backend";
import { Principal } from "@dfinity/principal";

function Transactions(props) {
  return (
    <div className="window white">
      <h2 align="center">Transaction History</h2>
      <ul>
        {props.transactionAttr.map((transaction, index) => (
          <li key={index}>
            <div>
              <b>To: </b>
              {transaction.receiver.toText()}
            </div>
            <div>
              <b>Amount: </b>
              {transaction.receivedAmount.toString()}
            </div>
            <div>
              <b>Balance: </b>
              {transaction.balance.toString()}
            </div>
            <p></p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;