import { InjectedConnector } from "@web3-react/injected-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const POLLING_INTERVAL = 8000;

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42]
});

export const portis = new PortisConnector({
    dAppId: "211b48db-e8cc-4b68-82ad-bf781727ea9e",
    networks: [1, 100]
});

export const fortmatic = new FortmaticConnector({
    apiKey: "pk_live_F95FEECB1BE324B5",
    chainId: 1
});

export const torus = new TorusConnector({
    chainId: 1
});

export const network = new NetworkConnector({
    urls: { 1: "https://mainnet.infura.io/v3/1c3acca035dd41dfbf400abac71e59a7" },
    defaultChainId: 1,
    pollingInterval: POLLING_INTERVAL
});

export const walletconnect = new WalletConnectConnector({
    rpc: { 1: "https://mainnet.infura.io/v3/1c3acca035dd41dfbf400abac71e59a7" },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: POLLING_INTERVAL
});
