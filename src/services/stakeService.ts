import { CONTRACT_ADDRESSES, CONTRACT_ADDRESSES_HEX, TOKEN_ADDRESSES, TOKEN_ADDRESSES_HEX } from '../config/contracts';
import { getTokenContract, OP20_ABI } from './tokenService';
import { Address } from '@btc-vision/transaction';
import { FallbackBlockchainService } from './fallbackService';

// ABI для StakeTracker
export const STAKE_TRACKER_ABI = [
  {
    type: 'function',
    name: 'addStake',
    inputs: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: 'stakeId', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getCount',
    inputs: [],
    outputs: [{ name: 'count', type: 'uint256' }]
  }
];

// OP20 ABI (import from tokenService)
const RPC_URL = 'https://testnet.opnet.org';
const EXPLORER_BASE = 'https://opscan.org/transactions';
const NETWORK_PARAM = 'op_testnet';

function extractPublicKeyHex(payload: unknown, address?: string): string {
  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      try {
        return extractPublicKeyHex(item, address);
      } catch {
      }
    }
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;

    if (address && address in record) {
      const addressData = record[address];
      if (addressData && typeof addressData === 'object' && 'mldsaPublicKey' in addressData) {
        const mldsaKey = (addressData as any).mldsaPublicKey;
        if (typeof mldsaKey === 'string') {
          return mldsaKey;
        }
      }
      return extractPublicKeyHex(record[address], undefined);
    }

    const candidateKeys = ['mldsaPublicKey', 'publicKey', 'pubKey', 'key', 'hex', 'raw', 'publicKeys'];
    for (const key of candidateKeys) {
      if (key in record) {
        try {
          return extractPublicKeyHex(record[key], undefined);
        } catch {
        }
      }
    }

    for (const value of Object.values(record)) {
      try {
        return extractPublicKeyHex(value, undefined);
      } catch {
      }
    }
  }

  throw new Error('Unable to extract public key from provider response');
}

function normalizeAbiType(type, ABIDataTypes) {
  if (typeof type !== 'string') return type;

  const key = type.toUpperCase();
  if (Object.prototype.hasOwnProperty.call(ABIDataTypes, key)) {
    return ABIDataTypes[key];
  }

  throw new Error(`Unknown ABI type: ${type}`);
}

function normalizeAbi(abi, ABIDataTypes, BitcoinAbiTypes) {
  return abi.map((entry) => ({
    ...entry,
    type:
      typeof entry.type === 'string' && entry.type.toLowerCase() === 'function'
        ? BitcoinAbiTypes.Function
        : entry.type,
    inputs: (entry.inputs || []).map((input) => ({
      ...input,
      type: normalizeAbiType(input.type, ABIDataTypes),
    })),
    outputs: (entry.outputs || []).map((output) => ({
      ...output,
      type: normalizeAbiType(output.type, ABIDataTypes),
    })),
  }));
}

let sdkPromise = null;
let bitcoinPromise = null;

async function loadSDK() {
  if (!sdkPromise) {
    sdkPromise = import(/* @vite-ignore */ 'https://esm.sh/opnet@1.8.1-rc.17');
  }
  return sdkPromise;
}

async function loadBitcoin() {
  if (!bitcoinPromise) {
    bitcoinPromise = import(/* @vite-ignore */ 'https://esm.sh/@btc-vision/bitcoin@7.0.0-rc.6');
  }
  return bitcoinPromise;
}

async function resolveNetwork(networkOverride) {
  if (networkOverride && typeof networkOverride === 'object') {
    return networkOverride;
  }

  const { networks } = await loadBitcoin();

  if (networkOverride === 'mainnet' || networkOverride === 'bitcoin') {
    return networks.bitcoin;
  }

  return networks.opnetTestnet;
}

export async function getStakeContract(contractAddress, abi, network, senderAddress?) {
  if (!contractAddress) {
    throw new Error('Stake contract address is not configured');
  }

  const { getContract, JSONRpcProvider, ABIDataTypes, BitcoinAbiTypes } = await loadSDK();
  const btcNetwork = await resolveNetwork(network);
  const typedAbi = normalizeAbi(abi || STAKE_TRACKER_ABI, ABIDataTypes, BitcoinAbiTypes);
  
  const provider = new JSONRpcProvider({
    url: RPC_URL,
    network: btcNetwork,
  });

  return getContract(contractAddress, typedAbi, provider, btcNetwork, senderAddress);
}

export async function addStake(contractAddress, senderAddress, network, tokenSymbol, amount) {
  if (!senderAddress) {
    throw new Error('Wallet address required');
  }

  if (tokenSymbol === 'BTC') {
    throw new Error('BTC stake is not supported by the OP20 stake contract');
  }

  const tokenAddress = TOKEN_ADDRESSES_HEX[tokenSymbol];
  if (!tokenAddress || tokenAddress === 'native') {
    throw new Error(`Unsupported token: ${tokenSymbol}`);
  }

  console.log('🚀 Approving tokens for stake...');

  try {
    const btcNetwork = await resolveNetwork(network);

    // Get public key for contract address
    const { JSONRpcProvider } = await loadSDK();
    const provider = new JSONRpcProvider({
      url: RPC_URL,
      network: btcNetwork,
    });
    const senderPublicKeyInfo = await provider.getPublicKeysInfoRaw(senderAddress);
    console.log('🔍 Sender public key info:', senderPublicKeyInfo);
    console.log('🔍 Keys in response:', Object.keys(senderPublicKeyInfo));
    
    // Log the nested object for our address
    const addressData = senderPublicKeyInfo[senderAddress];
    console.log('🔍 Address data structure:', addressData);
    console.log('🔍 Address data keys:', addressData ? Object.keys(addressData) : 'undefined');
    
    // Try using Address.fromBigInt with mldsaPublicKey
    console.log('🔍 Address methods:', Object.getOwnPropertyNames(Address));
    console.log('🔍 Address prototype methods:', Object.getOwnPropertyNames(Address.prototype));
    
    // Extract the mldsaPublicKey and try to convert to BigInt for Address.fromBigInt
    const mldsaPublicKey = addressData.mldsaPublicKey;
    console.log('🔍 ML-DSA public key (first 100 chars):', mldsaPublicKey?.substring(0, 100) + '...');
    
    let senderAddressObj;
    try {
      // Use Address.fromString with TWO params: hashedMLDSAKey and tweakedPublicKey
      const mldsaHashedPublicKey = addressData.mldsaHashedPublicKey;
      const tweakedPubkey = addressData.tweakedPubkey;
      console.log('🔍 ML-DSA hashed public key:', mldsaHashedPublicKey);
      console.log('🔍 Tweaked pubkey:', tweakedPubkey);
      
      // Address.fromString requires BOTH params
      senderAddressObj = Address.fromString(mldsaHashedPublicKey, '02' + tweakedPubkey);
      console.log('🔍 Created Address object with TWO params:', senderAddressObj);
    } catch (e) {
      console.error('❌ Failed to create Address with tweaked pubkey:', e);
      
      // Fallback to fromString with ML-DSA key
      try {
        senderAddressObj = Address.fromString(mldsaPublicKey);
        console.log('🔍 Created Address object using fromString fallback:', senderAddressObj);
      } catch (e2) {
        console.error('❌ Failed to create Address with fromString():', e2);
        
        // Final fallback to fromBigInt approach with first 32 bytes of ML-DSA
        try {
          const hexForBigInt = mldsaPublicKey.substring(0, 64);
          const bigIntKey = BigInt('0x' + hexForBigInt);
          console.log('🔍 BigInt key from first 32 bytes:', bigIntKey);
          
          senderAddressObj = Address.fromBigInt(bigIntKey);
          console.log('🔍 Created Address object from BigInt fallback:', senderAddressObj);
        } catch (e3) {
          console.error('❌ Failed to create Address from BigInt:', e3);
          // Ultimate fallback to original approach
          const senderPublicKey = extractPublicKeyHex(senderPublicKeyInfo, senderAddress);
          senderAddressObj = Address.fromString('02' + senderPublicKey);
          console.log('🔍 Created Address object with 02 prefix ultimate fallback:', senderAddressObj);
        }
      }
    }
    const contract = await getStakeContract(contractAddress, STAKE_TRACKER_ABI, network, senderAddressObj);
    const tokenContract = await getTokenContract(tokenSymbol, OP20_ABI, network, senderAddressObj);

    if (typeof contract.addStake !== 'function') {
      throw new Error('Method addStake not found on contract');
    }

    if (typeof tokenContract.increaseAllowance !== 'function') {
      throw new Error('Method increaseAllowance not found on token contract');
    }

    const contractAddressObj = Address.fromString(CONTRACT_ADDRESSES_HEX.stake);
    const tokenAddressObj = Address.fromString(TOKEN_ADDRESSES_HEX[tokenSymbol]);
    const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 1e18));
    console.log('🔍 Amount as BigInt:', amountBigInt);

    const approveSimulation = await tokenContract.increaseAllowance(contractAddressObj, amountBigInt);
    if (approveSimulation?.revert) {
      throw new Error(`Approval revert: ${approveSimulation.revert}`);
    }

    const approveReceipt = await approveSimulation.sendTransaction({
      refundTo: senderAddress,
      feeRate: 1,
      maximumAllowedSatToSpend: 30000n,
      network: btcNetwork,
    });
    
    console.log('🔍 Approve transaction receipt:', approveReceipt);
    console.log('✅ Tokens approved successfully');
    
    // Check if allowance was actually set
    console.log('🔍 Checking allowance...');
    const allowanceResult = await tokenContract.allowance(senderAddressObj, contractAddressObj);
    console.log('🔍 Allowance CallResult:', allowanceResult);
    console.log('🔍 CallResult keys:', Object.keys(allowanceResult));
    console.log('🔍 CallResult result:', (allowanceResult as any).result);
    
    // Try different ways to get the result
    let base64Result = (allowanceResult as any)['#resultBase64'];
    if (!base64Result) {
      base64Result = (allowanceResult as any).result?.toString?.('base64');
    }
    if (!base64Result && (allowanceResult as any).result) {
      // Try to convert result to base64 directly
      try {
        const resultBuffer = (allowanceResult as any).result;
        if (resultBuffer && typeof resultBuffer === 'object') {
          base64Result = btoa(String.fromCharCode(...new Uint8Array(resultBuffer)));
        }
      } catch (e) {
        console.log('🔍 Failed to convert result to base64:', e);
      }
    }
    console.log('🔍 Base64 result:', base64Result);
    
    let allowanceValue: bigint;
    if (base64Result && base64Result !== '') {
      try {
        // If it's a BinaryReader object, try to get the actual value
        if (typeof base64Result === 'object' && base64Result.readUint256) {
          allowanceValue = base64Result.readUint256();
          console.log('🔍 Allowance from BinaryReader:', allowanceValue);
        } else if (typeof base64Result === 'string') {
          // Original base64 decoding
          const decodedBytes = Uint8Array.from(atob(base64Result), c => c.charCodeAt(0));
          console.log('🔍 Decoded bytes:', decodedBytes);
          
          const hexString = Array.from(decodedBytes)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
          console.log('🔍 Hex string:', hexString);
          
          allowanceValue = BigInt('0x' + hexString.match(/../g)?.reverse().join('') || '0');
          console.log('🔍 Current allowance value:', allowanceValue);
        } else {
          console.log('🔍 Allowance is 0 (invalid base64Result type)');
          allowanceValue = 0n;
        }
      } catch (e) {
        console.log('🔍 Failed to decode allowance, setting to 0:', e);
        allowanceValue = 0n;
      }
    } else {
      console.log('🔍 Allowance is 0 (empty base64)');
      allowanceValue = 0n;
    }
    
    console.log('🔍 Required amount:', amountBigInt);
    console.log('🔍 Allowance sufficient?', allowanceValue >= amountBigInt);

    console.log('🚀 Sending real token stake...');

    if (typeof contract.setTransactionDetails === 'function') {
      contract.setTransactionDetails({ inputs: [], outputs: [] });
    } 
    

    const simulation = await contract.addStake(tokenAddressObj, amountBigInt);
    if (simulation?.revert) {
      throw new Error(`Contract revert: ${simulation.revert}`);
    }

    const receipt = await simulation.sendTransaction({
      refundTo: senderAddress,
      feeRate: 1,
      maximumAllowedSatToSpend: 30000n,
      network: btcNetwork,
    });

    const txid = receipt?.transactionId || receipt?.txid || String(receipt);
    console.log('✅ Stake added:', txid);
    
    return {
      ok: true,
      txid,
      stakeId: Date.now().toString(),
      explorerUrl: `${EXPLORER_BASE}/${txid}?network=${NETWORK_PARAM}`,
    };
  } catch (error) {
    console.error('❌ Error in addStake:', error);
    
    if (error.message?.includes('signer is not allowed in interaction parameters')) {
      throw new Error('Wallet interaction error: Please check your OP_NET wallet extension and try again.');
    }
    
    if (error.message?.includes('insufficient allowance')) {
      throw new Error('Insufficient token allowance for stake contract.');
    }

    if (error.message?.includes('insufficient balance')) {
      throw new Error('Insufficient token balance for stake.');
    }
    
    throw error;
  }
}

export async function getStakeCount(contractAddress, network) {
  const contract = await getStakeContract(contractAddress, STAKE_TRACKER_ABI, network);
  
  if (typeof contract.getCount !== 'function') {
    throw new Error('Method getCount not found on contract');
  }

  try {
    const result = await contract.getCount();
    if (result?.revert) {
      throw new Error(`Contract revert: ${result.revert}`);
    }

    // Handle buffer reading errors gracefully
    let properties = {};
    try {
      properties = result?.properties || {};
    } catch (bufferError) {
      console.warn('Buffer reading error for getCount:', bufferError.message);
      if (result && typeof result === 'object') {
        properties = { raw: result };
      }
    }

    const count = (properties as any)?.count || 0;
    console.log('📊 Current stake count:', count);

    return {
      ok: true,
      count,
      properties,
    };
  } catch (error) {
    console.error('❌ Error in getCount:', error);
    return {
      ok: false,
      error: error.message || String(error),
      count: 0,
      properties: {},
    };
  }
}

export class StakeService {
  private contractAddress: string;
  private network: string;
  private senderAddress: string | null = null;

  constructor() {
    this.contractAddress = CONTRACT_ADDRESSES.stake;
    this.network = 'testnet';
  }

  setSenderAddress(address: string) {
    this.senderAddress = address;
  }

  async addStake(tokenSymbol: string, amount: number): Promise<string | null> {
    if (!this.senderAddress) {
      console.error('❌ Wallet address required');
      return null;
    }

    if (isNaN(amount) || amount <= 0) {
      console.error('❌ Invalid amount:', amount);
      return null;
    }

    try {
      const result = await addStake(this.contractAddress, this.senderAddress, this.network, tokenSymbol, amount.toString());
      return result.stakeId;
    } catch (error) {
      console.error('❌ Failed to add stake:', error);
      return null;
    }
  }

  async getStakeCount(): Promise<number> {
    try {
      const result = await getStakeCount(this.contractAddress, this.network);
      return result.count;
    } catch (error) {
      console.error('❌ Failed to get stake count:', error);
      return 0;
    }
  }
}

// Singleton instance
export const stakeService = new StakeService();
