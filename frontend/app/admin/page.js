"use client"
//REACT
import {useEffect, useState} from 'react'
import { useAccount, usePublicClient } from 'wagmi';
//RAINBOW KIT
import { ConnectButton } from "@rainbow-me/rainbowkit"
//NEXTJS
import Link from "next/link"
//Constants information SmartContract
import { contractAddressRoomlab, contractAbiRoomlab } from '@/constants/index'
// Wagmi
import { prepareWriteContract, writeContract,waitForTransaction, readContract } from '@wagmi/core'
// Viem
import { ContractFunctionExecutionError, formatEther } from 'viem'


const page = () => {
    /* State */
    const viemPublicClient = usePublicClient();
    const [balanceSmartContract, setBalanceSmartContract] =  useState('')
    const { address, isConnected } = useAccount()
    const [ isOwner, setIsOwner ] = useState(false);
    const [ ownerAddress, setOwnerAddress ] = useState('');
    const [pendingTransaction, setPendingTransaction] =  useState(false)
    const [successTransaction, setSuccessTransaction] =  useState(false)
    const [errorTransaction, setErrorTransaction] =  useState('')
    const [account, setAccount] =  useState('')
    const [newBaseURI, setNewBaseURI] =  useState('')
    const [baseURI, setBaseURI] =  useState('')
    const [quantity, setQuantity] =  useState(0)
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const giftTokens = async (_account, _quantity) => {
        if (isConnected) {
            try {
              const { request } = await prepareWriteContract({
                  address: contractAddressRoomlab,
                  abi: contractAbiRoomlab,
                  functionName: "gift",
                  args: [_account, _quantity]
              });
              const { hash } = await writeContract(request);
              setPendingTransaction(true)
              await waitForTransaction({hash: hash})
              setPendingTransaction(false)
              setSuccessTransaction(true)
              return hash;
            } catch (err) {
              console.log(err)
              if( err instanceof ContractFunctionExecutionError) {
                if("CallExecutionError" === err.cause.name) {
                  setErrorTransaction(err.cause.shortMessage)
                } else {
                  if (err.cause.metaMessages[0]) {
                    switch (err.cause.metaMessages[0]) {
                      case "Error: MaxSupplyExceeded()" :
                        setErrorTransaction("Il n'y a plus de NFT disponible à la vente");
                        break;
                    }
                  } else {
                    setErrorTransaction("An error occured");
                  }
                }
              } else {
                setErrorTransaction("An error occured")
              }
            }
        }
    }

    const setUri = async (_baseUri) => {
        if (isConnected && isOwner) {
            try {
              const { request } = await prepareWriteContract({
                  address: contractAddressRoomlab,
                  abi: contractAbiRoomlab,
                  functionName: "setBaseURI",
                  args: [ _baseUri ]
              });
              const { hash } = await writeContract(request);
              setPendingTransaction(true)
              await waitForTransaction({hash: hash})
              setPendingTransaction(false)
              setSuccessTransaction(true)
              return hash;
            } catch (err) {
              console.log(err)
              if( err instanceof ContractFunctionExecutionError) {
                if("CallExecutionError" === err.cause.name) {
                    setErrorTransaction(err.cause.shortMessage)
                } else {
                    setErrorTransaction("An error occured");
                }
              } else {
                setErrorTransaction("An error occured")
              }
            }
        }
    }

    const getBaseUri = async () => {
        const baseUri = await readContract({
            address: contractAddressRoomlab,
            abi: contractAbiRoomlab,
            functionName: 'getBaseURI',
        });
        setBaseURI(baseUri)
    }

    const isUserTheOwner = async () => {
        const owner = await readContract({
            address: contractAddressRoomlab,
            abi: contractAbiRoomlab,
            functionName: 'owner',
        });
        setOwnerAddress(owner);
        setIsOwner(address === owner);
    }

    const getBalanceSmartContract = async () => {
        const balance = await viemPublicClient.getBalance({ 
            address: contractAddressRoomlab,
        })
        const balanceToString = balance.toString()
        setBalanceSmartContract(formatEther(balanceToString))
    }
    

    const handleSubmitFormGift = (e) => {
        e.preventDefault();
        giftTokens(account, quantity);
    }

    const handleSubmitFormBaseURI = (e) => {
        e.preventDefault();
        setUri(newBaseURI)
    }

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        console.log(selectedDate)
        const newDate = { ...selectedDate, [name]: parseInt(value, 10) };
        console.log(newDate)
    
        //setSelectedDate(newDate);
      };

    const handleSubmitDate = (e) => {
        e.preventDefault();
        const timestamp = selectedDate.getTime();
        console.log('Selected Timestamp:', timestamp);
        // Ajoutez ici le code pour traiter le timestamp
    }

    useEffect(() => {
        isUserTheOwner()
        getBalanceSmartContract()
        getBaseUri()
    }, [isConnected, address])

    useEffect(() => {
        isUserTheOwner()
        getBalanceSmartContract()
        getBaseUri()
    }, [])

    return (
        <>
            {isOwner ? (
                <>
                    <header className="bg-white px-4 py-6">
                        <div className="container mx-auto flex items-center justify-between">
                            <h1 className="text-2xl clay-primary font-serif font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}><Link href="/">RoomLab</Link></h1>
                            <nav>
                                <ul className="flex items-center space-x-4">
                                    <li><ConnectButton /></li>
                                </ul>
                            </nav>
                        </div>
                    </header>
                    <main className="container mx-auto py-6 px-4 flex flex-wrap justify-center">
                        <form onSubmit={handleSubmitFormGift}  className="max-w-[600px] w-full mx-4 mt-8 p-4 bg-white shadow-md rounded-md">
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-gray-600 font-semibold mb-2">Adresse EVM :</label>
                                <input
                                type="text"
                                id="address"
                                placeholder='0x000000000000000000000000'
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="quantity" className="block text-gray-600 font-semibold mb-2">Quantité :</label>
                                <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.min(300, Math.max(1, parseInt(e.target.value, 10))))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                min="1"
                                max="300"
                                required
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300">Offrir des NFTs</button>
                        </form>

                        <form onSubmit={handleSubmitFormBaseURI}  className="max-w-[600px] w-full mx-4 mt-8 p-4 bg-white shadow-md rounded-md">
                            <div className="mb-4">
                                <label htmlFor="baseUri" className="block text-gray-600 font-semibold mb-2">Base URI :</label>
                                <input
                                type="text"
                                id="baseUri"
                                value={newBaseURI}
                                onChange={(e) => setNewBaseURI(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                required
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300">Définir une nouvelle base URI</button>
                            <div className="mt-6 mb-4 p-2">
                                <p className="">Base URI : <br/>{baseURI}</p>
                            </div>
                        </form>

                        <form onSubmit={handleSubmitDate} className="max-w-[600px] w-full mx-4 mt-8 p-4 bg-white shadow-md rounded-md">
                            <div className="mb-4 flex flex-wrap">
                                <label className="w-full md:w-1/5" htmlFor="day">
                                    Jour:
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        name="day"
                                        value={selectedDate.getDate()}
                                        onChange={handleDateChange}
                                        required
                                    >
                                        {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="w-full md:w-1/5" htmlFor="month">
                                    Mois:
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        name="month"
                                        value={selectedDate.getMonth() + 1}
                                        onChange={handleDateChange}
                                        required
                                    >
                                        {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="w-full md:w-1/5" htmlFor="year">
                                    Année:
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        name="year"
                                        value={selectedDate.getFullYear()}
                                        onChange={handleDateChange}
                                        required
                                    >
                                        {Array.from({ length: 100 }, (_, index) => selectedDate.getFullYear() + index).map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="w-full md:w-1/5" htmlFor="hours">
                                    Heure:
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        name="hours"
                                        value={selectedDate.getHours()}
                                        onChange={handleDateChange}
                                        required
                                    >
                                        {Array.from({ length: 24 }, (_, index) => index).map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                        </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="w-full md:w-1/5" htmlFor="minutes">
                                    Minutes:
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        name="minutes"
                                        value={selectedDate.getMinutes()}
                                        onChange={handleDateChange}
                                        required
                                    >
                                        {Array.from({ length: 60 }, (_, index) => index).map((minute) => (
                                        <option key={minute} value={minute}>
                                            {minute}
                                        </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300">Définir une date de vente ouverte</button>
                        </form>



                        <form className="max-w-[600px] w-full mx-4 mt-8 p-4 bg-white shadow-md rounded-md">
                            <div className="mb-4">
                                <label htmlFor="withdraw" className="block text-gray-600 font-semibold mb-2">Transfer :</label>
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300">Récupérer les fonds</button>
                            {balanceSmartContract && (
                                <>
                                    <div className="mt-6 mb-4 p-2">
                                        <p>Balance smart contract : {balanceSmartContract} ETH</p>
                                    </div>
                                </>
                            )}
                        </form>
                    </main>
                </>
            ) : (
                <>
                    <header className="bg-white px-4 py-6">
                        <div className="container mx-auto flex items-center justify-between">
                            <h1 className="text-2xl clay-primary font-serif font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}><Link href="/">RoomLab</Link></h1>
                            <nav>
                                <ul className="flex items-center space-x-4">
                                    <li><ConnectButton /></li>
                                </ul>
                            </nav>
                        </div>
                    </header>
                    <main className="container mx-auto py-6 px-4">
                        <p>Vous n'êtes pas administrateur</p>
                    </main>
                </>
            )}
            
        </>
    )
}

export default page
