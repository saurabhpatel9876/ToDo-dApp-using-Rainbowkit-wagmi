"use client"
import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {bscTestnet,arbitrum,polygon} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";


const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId:"84b9fa4f0e17a2692b1ddcdaeb64ef36",
  chains: [bscTestnet, polygon,arbitrum],
  ssr: true, // If your dApp uses server side rendering (SSR)
});


const queryClient = new QueryClient();
const Web3Provider = ({children}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
export default Web3Provider;