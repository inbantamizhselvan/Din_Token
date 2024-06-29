import ReactDOM from 'react-dom/client'
import React from 'react'
import App from "./components/App";
import { AuthClient } from '@dfinity/auth-client';


const init = async () => { 
  const authClient = await AuthClient.create();
  if(await authClient.isAuthenticated()){
    console.log("Logged In");
    handleLogin(authClient);
  } else {
    await authClient.login({
      identityProvider : "https://identity.ic0.app/#authorize",
      onSucess: () =>{
        handleLogin(authClient);
      }
    }
    );
  }
}
async function handleLogin(authClient){
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

init();
