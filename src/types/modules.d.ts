declare module 'opnet' {
  export interface OPNetProvider {
    pushTx: (params: { to: string; data: string; }) => Promise<string>;
  }
  
  export const ABIDataTypes: any;
  export const BitcoinAbiTypes: any;
  export const OP_NET_ABI: any;
}

declare module '@btc-vision/bitcoin' {
  export interface OPWallet {
    pushTx: (options: { rawtx: string; }) => Promise<string>;
  }
}

declare module 'https://esm.sh/opnet@1.8.1-rc.17' {
  export * from 'opnet';
}

declare module 'https://esm.sh/@btc-vision/bitcoin@7.0.0-rc.6' {
  export * from '@btc-vision/bitcoin';
}

declare global {
  interface Window {
    opnet?: any;
    ethereum?: any;
    tronWeb?: any;
    tronLink?: any;
  }
}
