import React, { useState } from 'react';
import axios from 'axios';
import { SiweMessage } from 'siwe';
import Web3 from 'web3';

const SignerApp = () => {
  const [signature, setSignature] = useState('');
  const [signerData, setSignerData] = useState(null)
  const [hash, setHash] = useState('')
  const [recoveredAddress, setRecoveredAddress] = useState('')

  const SEPOLIA_TESTNET_CHAIN_ID = 11155111

  const createEthereumSignedAuthToken = async (chainId = SEPOLIA_TESTNET_CHAIN_ID) => {
    const typedData = JSON.stringify({
      domain: {
        chainId,
        name: "NFT Marketplace",
        version: "1"
      },
      message: {
        marketplace: "0x1aE99B75dC4F5Fd9B3cb191b31dde7eB7dA9D0Bb",
        admin: "0x5cc163BCf461482813a0E2c26a00b9FAaBf612eF",
        signer: "0x6b9FE9aE37908e1d80796139132B77c9c671e0C6",
        royalty: "0.001",
        createdAt: `${Date.now()}`,
      },
      primaryType: "MarketplaceSettings",
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string'},
          { name: 'chainId', type: 'uint256' },
        ],
        MarketplaceSettings: [
          { name: 'marketplace', type: 'address' },
          { name: 'admin', type: 'address' },
          { name: 'signer', type: 'address' },
          { name: 'royalty', type: 'string' },
          { name: 'createdAt', type: 'uint256' }
        ]
      }
    })

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    var from = accounts[0]

    var params = [from, typedData]
    var method = 'eth_signTypedData_v4'

    const signature = await window.ethereum.request({ method, params })

    setSignature(signature)

    return {
      typed_data: btoa(typedData),
      signature,
    }
  }   

  const signMessage = async () => {
    const data = await createEthereumSignedAuthToken()
    console.log(data)
    axios({
      method: 'post',
      url: 'http://localhost:9090/api/v0.1/marketplace-settings',
      data: data
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log("Some error happened, check the backend...")
    })
  };

  const loginWithEthereum = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    var from = accounts[0]

    var nonce = await fetchNonce(from)
    //const message = createMessage(signer.address, nonce)
    const signature = await createSignature(Web3.utils.toChecksumAddress(from), nonce)
    console.log(signature)
  }

  const fetchNonce = async (address) => {
    const res = await axios({
      method: 'get',
      url: `http://localhost:9090/api/v0.1/auth/${address}/nonce`
    })

    console.log(res.data.data.nonce)
    return res.data.data.nonce
  }

  const createMessage = (address, nonce) => {
    console.log(address)
    const domain = 'localhost:3000'
    const origin = 'http://localhost:3000'
    const statement = 'Welcome to Clover Marketplace. Please sign this message to login.'
    const siweMessage = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: '1',
      chainId: SEPOLIA_TESTNET_CHAIN_ID,
      nonce: nonce,
    })
    return siweMessage.prepareMessage()
    return (
      "clover.com wants to sign in with your Ethereum account:\n" +
       address + "\n" +
       "\n" +
       "Log in to Clover Marketplace" + "\n" +
       "\n" +
       "URI: https://clover.com/login\n" +
       "Version: 1\n" +
       "Nonce: " + nonce + "\n"
       // "Chain ID: " + chainId +"\n" +
       // "Issued At: " + issuedAt + "\n" +
       // "Expiration Time: " + expiresAt + "\n"
    )
  }

  const createSignature = async (address, nonce) => {
    const message = createMessage(address, nonce)
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    var from = accounts[0]
    const sign = await ethereum.request({
      method: 'personal_sign',
      params: [message, from]
    })
    console.log(sign)
    await authSignature(from, message, sign)
  }

  const authSignature = async (address, message, signature) => {
    //setVerified(false)
    const res = await axios({
      method: 'post',
      url: 'http://localhost:9090/api/v0.1/auth/login',
      data: {
        address: address,
        message: message,
        signature: signature,
      }
    })

    console.log(res)
  }

  const signEIP191 = async () => {
    const data = await loginWithEthereum()

    // const createSignature = async (nonce) => {
    //   const message = createMessage(address, nonce)
    //   const signedMessage = await signMessageAsync({message})
    //   authSignature(message, signedMessage)
    // }
  }

  return (
    <>
      <div>
        <button onClick={signMessage}>Sign Message</button>
        <p>Signed Message: {signature}</p>
      </div>
      <div>
        <button onClick={loginWithEthereum}>EIP-191 Message</button>
      </div>
    </>
  );
};

export default SignerApp;
