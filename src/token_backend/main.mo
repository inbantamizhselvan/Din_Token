import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import List "mo:base/List";
import Config "config";

actor Token{
  private type Transaction = {
    receiver: Principal;
    receivedAmount: Nat;
    balance : Nat;
  };
  private var transactionList :List.List<Transaction> = List.nil<Transaction>();
  private var transactions = HashMap.HashMap<Principal, Transaction>(1, Principal.equal, Principal.hash);
  var owner : Principal = Principal.fromText(Config.MY_PRINCIPAL);
  var totalSupply : Nat = 1000000000;
  var symbol : Text = "Din";

  private stable var balanceEntries : [(Principal, Nat)] = [];
  private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash );
  if( balances.size() < 1) {
  balances.put(owner, totalSupply);
  };
  
  public query func balanceOf(who : Principal) : async Nat{
    let balance : Nat = switch (balances.get(who)){
      case null 0;
      case (?result) result;
    };
    return balance;
  };
  public query func getSymbol() : async Text{
    return symbol;
  };
  public shared(msg) func getOwner() : async Principal {
    return msg.caller;
  };
  public shared(msg) func payOut() : async Text{
    if(balances.get(msg.caller)==null){
    let result: Text=await transfer(msg.caller, 10000);
     Debug.print(debug_show(msg.caller));
      return result;
    } else {
      return "Already Claimed";
    }
  };
  public shared(msg) func transfer(to: Principal, amount : Nat) : async Text{
    let fromBalance =  await balanceOf(msg.caller);
    if(fromBalance > amount){
      let newFromBalance : Nat = fromBalance - amount;
      balances.put(msg.caller, newFromBalance);
      let toBalance:Nat = await balanceOf(to);
      let newToBalance:Nat = toBalance + amount;
      balances.put(to, newToBalance);
      let newTransactionList : Transaction = {
        receiver = to;
        receivedAmount = amount ;
        balance = fromBalance - amount;
      };
      transactions.put(msg.caller, newTransactionList);
      transactionList := List.push(newTransactionList, transactionList);
      return "success";
    } else {
      return "Insufficient Funds";
  };
};
public query func getTransactions() : async [Transaction] {


        // Convert List.List<Transaction> to array [Transaction]
        let transactionArray = List.toArray(transactionList);
        Debug.print(debug_show(transactionArray));
        return transactionArray;
};
system func preupgrade(){
  balanceEntries := Iter.toArray(balances.entries());
};
system func postupgrade() {
  balances :=  HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash );
  if( balances.size() < 1){
  balances.put(owner, totalSupply);
  };
};
}
