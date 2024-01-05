"use client"

import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { hardhat, sepolia, polygonMumbai } from 'wagmi/chains';

const { chains, publicClient } = configureChains(
  process.env.NEXT_PUBLIC_ENV === 'dev' ? [hardhat] : [sepolia, polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'roomlab',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Roomlab NFT</title>
        <meta name="description" content="Roomlab NFT, a collection NFTs by SYNEIDOLAB" />
      </head>
      <body className="clay-bg">
       <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
