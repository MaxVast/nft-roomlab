"use client"
//REACT
import {useEffect, useState} from 'react'
import { useAccount} from 'wagmi';
import { useConnectModal } from "@rainbow-me/rainbowkit"
//Constants information SmartContract
import { contractAddressRoomlab, contractAbiRoomlab } from '@/constants/index'
// Wagmi
import { readContract } from '@wagmi/core'
// Viem
import { ContractFunctionExecutionError } from 'viem'
//COMPONENTS
import Header from "@/components/Header/Header";

export default function pageNft() {
    /* State */
    const { address, isConnected } = useAccount()
    const [loadingNFT, setLoadingNFT] = useState(false)
    const [errorTransaction, setErrorTransaction] =  useState(false)
    const [errorLoading, setErrorLoading] =  useState('')
    const [listTokenUri, setListTokenUri] = useState([])

     const getTokenUri = async (_tokenId) => {
        return await readContract({
            address: contractAddressRoomlab,
            abi: contractAbiRoomlab,
            functionName: 'tokenURI',
            args: [BigInt(_tokenId)]
        })
    }

     const fetchData = async (arrayTokenUri) => {
        try{
            let dataNFTs = []
            for(let i = 0; i < arrayTokenUri.length; i++) {
                let response = await fetch(arrayTokenUri[i])
                const result = await response.json()
                let linkImage = result.image.slice(7)
                let newURI = 'https://ipfs.io/ipfs/'+linkImage
                let data = {
                    name: result.name,
                    image: newURI
                }
                dataNFTs.push(data)
            }
            setListTokenUri(dataNFTs)
        } catch (e) {
            console.log(e)
        }
    }

    const getNft = async () => {
        if(isConnected) {
            //Get
            setLoadingNFT(true)
            try {
                let data = await readContract({
                    address: contractAddressRoomlab,
                    abi: contractAbiRoomlab,
                    functionName: 'listTokenIdbyAddress',
                    args: [address]
                })
                let arrayTokenUri = []

                if (data) {
                    for(let i = 0; i < data.length; i++){
                        let call = await getTokenUri(data[i])
                        console.log(call)
                        let tokenURI = call.slice(7)
                        let newURI = 'https://ipfs.io/ipfs/'+tokenURI
                        arrayTokenUri.push(newURI)
                    }
                    await fetchData(arrayTokenUri)
                }
            } catch (err) {
                setLoadingNFT(false)
                console.log(err)
                if (err instanceof ContractFunctionExecutionError) {
                    if("CallExecutionError" === err.cause.name) {
                        setErrorTransaction(true)
                        setErrorLoading('Une erreur est survenue')
                    } else {
                        if (err.cause.metaMessages[0]) {
                            switch (err.cause.metaMessages[0]) {
                                case "Error: UserHasNoToken()" :
                                    setErrorTransaction(true);
                                    break
                            }
                        } else {
                            setErrorTransaction(true);
                        }
                    }
                }
                setErrorTransaction(true);
            }
            setLoadingNFT(false)
        }
    }

    useEffect(() => {
        getNft()
    }, [])

    useEffect(() => {
        getNft()
    }, [isConnected, address])

    return (
        <>
            <Header/>
            <main className="clay-bg container mx-auto py-6 px-4 text-center">
                <div className="container mx-auto items-center justify-between text-center">
                    <h2 className="text-2xl clay-primary font-serif font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>Mes NFTs</h2>
                </div>
                {isConnected ? (
                    listTokenUri && (
                        <>
                            <section id="nft-collection" className="justify-center py-6 px-4">
                                <article className="nft mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                                    {listTokenUri.map((item, key) => (
                                        <div className="flex max-w-xl flex-col items-between justify-between py-6 px-4" id={`nft-${key}`}>
                                            <img className="group relative" loading="lazy" src={item.image} alt={`NFT : ${item.name}`} />
                                            <p className="text-center clay-secondary group relative">{item.name}</p>
                                        </div>
                                    ))}
                                </article>
                            </section>
                            <section className="mt-2">
                                <div className="nft mr-4">
                                    {loadingNFT && (
                                        <p className="text-2xl text-bold text-center clay-primary">Chargement de vos NFT RoomLab...</p>
                                    )}
                                    {errorTransaction && (
                                        errorLoading ? (
                                            <>
                                                <p className="text-2xl text-bold text-center clay-primary">{errorLoading}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-2xl text-bold text-center clay-primary">Vous n'avez pas de NFT RoomLab</p>
                                            </>
                                        )
                                    )}
                                </div>
                            </section>
                        </>
                    )
                ) : (
                    <>
                        <section className="mt-2">
                            <div className="nft mr-4">
                                <p className="text-2xl text-bold text-center clay-primary">Connectez-vous pour visualiser vos NFTs</p>
                            </div>
                        </section>
                    </>
                )}
            </main>

            <footer className="bg-white py-4 px-4 text-center">
                <p className="clay-secondary pb-4">© MaxVast 2024</p>
                <button type="button" className="px-2">
                    <a href="#" target="_blank">
                        <svg className="" fill="#04111D" height="45" viewBox="0 0 293.775 293.671" width="45" xmlns="http://www.w3.org/2000/svg">
                            <g id="etherscan-logo-circle" transform="translate(-219.378 -213.33)">
                                <path d="M280.433,353.152A12.45,12.45,0,0,1,292.941,340.7l20.737.068a12.467,12.467,0,0,1,12.467,12.467v78.414c2.336-.692,5.332-1.43,8.614-2.2a10.389,10.389,0,0,0,8.009-10.11V322.073a12.469,12.469,0,0,1,12.468-12.47h20.778a12.469,12.469,0,0,1,12.467,12.467v90.279s5.2-2.106,10.269-4.245a10.408,10.408,0,0,0,6.353-9.577V290.9a12.466,12.466,0,0,1,12.466-12.467h20.778A12.468,12.468,0,0,1,450.815,290.9v88.625c18.014-13.055,36.271-28.758,50.759-47.639a20.926,20.926,0,0,0,3.185-19.537,146.6,146.6,0,0,0-136.644-99.006c-81.439-1.094-148.744,65.385-148.736,146.834a146.371,146.371,0,0,0,19.5,73.45,18.56,18.56,0,0,0,17.707,9.173c3.931-.346,8.825-.835,14.643-1.518a10.383,10.383,0,0,0,9.209-10.306V353.152" data-name="Path 1" id="Path_1"></path>
                                <path d="M244.417,398.641A146.808,146.808,0,0,0,477.589,279.9c0-3.381-.157-6.724-.383-10.049-53.642,80-152.686,117.4-232.79,128.793" data-name="Path 2" id="Path_2" transform="translate(35.564 80.269)"></path>
                            </g>
                        </svg>
                    </a>
                </button>
                <button type="button" className="px-2">
                    <a href="#" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 90 90" fill="none">
                            <path d="M90 45C90 69.8514 69.8514 90 45 90C20.1486 90 0 69.8514 0 45C0 20.1486 20.1486 0 45 0C69.8566 0 90 20.1486 90 45Z" fill="white" stroke="black"/>
                            <path d="M22.2011 46.512L22.3952 46.2069L34.1015 27.8939C34.2726 27.6257 34.6748 27.6535 34.8043 27.9447C36.7599 32.3277 38.4475 37.7786 37.6569 41.1721C37.3194 42.5683 36.3947 44.4593 35.3544 46.2069C35.2204 46.4612 35.0724 46.7109 34.9152 46.9513C34.8413 47.0622 34.7164 47.127 34.5823 47.127H22.5432C22.2195 47.127 22.03 46.7756 22.2011 46.512Z" fill="#2081E2"/>
                            <path d="M74.38 49.9149V52.8137C74.38 52.9801 74.2783 53.1281 74.1303 53.1928C73.2242 53.5812 70.1219 55.0052 68.832 56.799C65.5402 61.3807 63.0251 67.932 57.4031 67.932H33.9489C25.6362 67.932 18.9 61.1727 18.9 52.8322V52.564C18.9 52.3421 19.0803 52.1618 19.3022 52.1618H32.377C32.6359 52.1618 32.8255 52.4022 32.8024 52.6565C32.7099 53.5072 32.8671 54.3764 33.2693 55.167C34.046 56.7435 35.655 57.7283 37.3933 57.7283H43.866V52.675H37.4673C37.139 52.675 36.9449 52.2959 37.1344 52.0277C37.2038 51.9214 37.2824 51.8104 37.3656 51.6856C37.9712 50.8257 38.8358 49.4895 39.6957 47.9684C40.2829 46.9421 40.8516 45.8463 41.3093 44.746C41.4018 44.5472 41.4757 44.3438 41.5497 44.1449C41.6745 43.7936 41.804 43.4653 41.8964 43.1371C41.9889 42.8597 42.0629 42.5684 42.1369 42.2956C42.3542 41.3617 42.4466 40.3723 42.4466 39.3459C42.4466 38.9437 42.4281 38.523 42.3911 38.1207C42.3727 37.6815 42.3172 37.2423 42.2617 36.8031C42.2247 36.4147 42.1554 36.031 42.0814 35.6288C41.9889 35.0416 41.8595 34.4591 41.7115 33.8719L41.6607 33.65C41.5497 33.2478 41.4572 32.864 41.3278 32.4618C40.9625 31.1996 40.5418 29.9698 40.098 28.8186C39.9362 28.3609 39.7512 27.9217 39.5663 27.4825C39.2935 26.8213 39.0161 26.2203 38.7618 25.6516C38.6324 25.3927 38.5214 25.1569 38.4105 24.9165C38.2856 24.6437 38.1562 24.371 38.0267 24.112C37.9343 23.9132 37.8279 23.7283 37.7539 23.5434L36.9634 22.0824C36.8524 21.8836 37.0373 21.6478 37.2546 21.7079L42.2016 23.0487H42.2155C42.2247 23.0487 42.2293 23.0533 42.234 23.0533L42.8858 23.2336L43.6025 23.437L43.866 23.511V20.5706C43.866 19.1512 45.0033 18 46.4088 18C47.1116 18 47.7496 18.2866 48.2073 18.7536C48.665 19.2206 48.9517 19.8586 48.9517 20.5706V24.935L49.4787 25.0829C49.5203 25.0968 49.5619 25.1153 49.5989 25.143C49.7284 25.2401 49.9133 25.3835 50.1491 25.5591C50.334 25.7071 50.5328 25.8874 50.7733 26.0723C51.2495 26.4561 51.8181 26.9508 52.4423 27.5194C52.6087 27.6628 52.7705 27.8107 52.9185 27.9587C53.7229 28.7076 54.6245 29.5861 55.4844 30.557C55.7248 30.8297 55.9606 31.1071 56.201 31.3984C56.4415 31.6943 56.6957 31.9856 56.9177 32.2769C57.2089 32.6652 57.5233 33.0674 57.7961 33.4882C57.9255 33.687 58.0735 33.8904 58.1983 34.0892C58.5497 34.6209 58.8595 35.1711 59.1554 35.7212C59.2802 35.9755 59.4096 36.2529 59.5206 36.5257C59.8488 37.2608 60.1078 38.0098 60.2742 38.7588C60.3251 38.9206 60.362 39.0963 60.3805 39.2535V39.2904C60.436 39.5124 60.4545 39.7482 60.473 39.9886C60.547 40.756 60.51 41.5235 60.3435 42.2956C60.2742 42.6239 60.1817 42.9336 60.0708 43.2619C59.9598 43.5763 59.8488 43.9045 59.7055 44.2143C59.4281 44.8569 59.0999 45.4996 58.7115 46.1006C58.5867 46.3225 58.4387 46.5583 58.2908 46.7802C58.129 47.016 57.9625 47.238 57.8146 47.4553C57.6112 47.7327 57.3939 48.0239 57.1719 48.2828C56.9731 48.5556 56.7697 48.8284 56.5478 49.0688C56.238 49.434 55.9421 49.7808 55.6324 50.1137C55.4474 50.331 55.2486 50.5529 55.0452 50.7517C54.8464 50.9736 54.643 51.1724 54.458 51.3573C54.1483 51.6671 53.8894 51.9075 53.6721 52.1063L53.1635 52.5733C53.0895 52.638 52.9924 52.675 52.8907 52.675H48.9517V57.7283H53.9079C55.0175 57.7283 56.0716 57.3353 56.9223 56.6141C57.2135 56.3598 58.485 55.2594 59.9876 53.5997C60.0384 53.5442 60.1031 53.5026 60.1771 53.4841L73.8668 49.5265C74.1211 49.4525 74.38 49.6467 74.38 49.9149Z" fill="#2081E2"/>
                        </svg>
                    </a>
                </button>
            </footer>
        </>
    )
}
