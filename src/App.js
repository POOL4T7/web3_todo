import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// import Landing from './pages/Landing';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import Web3 from 'web3';

function App() {
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState({
    web3: '',
    account: '',
  });

  const conenctWalletHandler = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web = new Web3(window.ethereum);
        const accounts = await web.eth.getAccounts();
        setWallet({ web3: web, account: accounts[0] });
      } catch (e) {
        console.log('coonect wallet error: ', e);
        setError(e.message);
      }
    } else {
      console.log('Please install metamask');
      setError('Please install metamask');
    }
  };

  const { web3, account } = wallet;
  useEffect(() => {
    if (!account) {
      conenctWalletHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  // useEffect(() => {
  //   loadWeb3();
  //   loadBlockchainData();
  // }, []);

  // const loadWeb3 = async () => {
  //   try {
  //     if (window.ethereum) {
  //       window.web3 = new Web3(window.ethereum);
  //       await window.ethereum.enable();
  //     } else if (window.web3) {
  //       window.web3 = new Web3(window.web3.currentProvider);
  //     } else {
  //       alert(
  //         'Non-Ethereum browser detected. You should consider trying MetaMask!'
  //       );
  //     }
  //   } catch (e) {
  //     console.log('load web3: ' + e.message);
  //   }
  // };

  // const loadBlockchainData = async () => {
  //   try {
  //     const web3 = window.web3;
  //     // Load account
  //     const accounts = await web3.eth.getAccounts();
  //     // setAccount(accounts[0]);
  //     // Network ID
  //     const networkId = await web3.eth.net.getId();
  //     // const networkData = Decentragram.networks[networkId];
  //     // if (networkData) {
  //     //   const dGram = new web3.eth.Contract(
  //     //     Decentragram.abi,
  //     //     networkData.address
  //     //   );
  //     //   setDecentagram(dGram);

  //     // } else {
  //     //   window.alert('Decentragram contract not deployed to detected network.');
  //     // }
  //   } catch (e) {
  //     console.log(e.message);
  //   }
  // };

  return (
    <BrowserRouter>
      <Navbar account={account} connectWallet={conenctWalletHandler} />
      <main>
        {error}
        <Routes>
          <Route path='/' element={<Home account={account} web3={web3} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
