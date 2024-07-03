import React, {useState, useEffect} from "react";
import { Principal } from "@dfinity/principal";
import { token_backend } from "../../../declarations/token_backend";
import Transactions from "./Transactions";

function Transfer() {
  const [recipientID, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [feedback, setFeedback] = useState("")
  const [isHidden, setHidden] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [textColor, setTextColor] = useState();
  const [loaderHidden, setLoader] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const transactionList = await token_backend.getTransactions();
      console.log(transactionList);
      setTransactions(transactionList);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  async function handleClick() {
    console.log(loaderHidden);
    setLoader(false);
    console.log(loaderHidden)
    setHidden(true);
    setDisabled(true);
    const recipient=Principal.fromText(recipientID);
    const amountToTransfer=Number(amount);
    try {
      const result = await token_backend.transfer(recipient, amountToTransfer);
      setFeedback(result);
      setHidden(false);
      setDisabled(false);
      if (result === "success") {
        fetchTransactions();
        setTextColor("green");
      }
      else{
        setTextColor("red");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setFeedback("Transfer failed. Please try again.");
      setHidden(false);
      setDisabled(false);
    }
    setLoader(true);
    console.log(loaderHidden)
    console.log(transactions);
  }
  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recipientID}
                onChange={(e)=> setRecipient(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
        <button id="btn-transfer" onClick={handleClick} disabled={isDisabled}>
          Transfer
        </button>
        </p>
        <div hidden={loaderHidden} className="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        </div>
        <p hidden={isHidden} style={{color:textColor}}><b>{feedback}</b></p>
        <Transactions transactionAttr={transactions}/>
      </div>
    </div>
  );
}

export default Transfer;
