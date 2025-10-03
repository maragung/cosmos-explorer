import axios from "axios";

// LCD/REST API endpoint
const BASE_URL = "https://warden-mainnet-api.itrocket.net";

// RPC endpoint (untuk kebutuhan advanced/future)
export const RPC_URL = "https://warden-mainnet-rpc.itrocket.net";

// JSON-RPC (EVM) endpoint (untuk kebutuhan EVM explorer/future)
export const JSON_RPC_URL = "https://warden-mainnet-evm.itrocket.net:443";

// Dashboard
export async function fetchLatestBlock() {
  const res = await axios.get(`${BASE_URL}/cosmos/base/tendermint/v1beta1/blocks/latest`);
  return res.data;
}
export async function fetchValidators() {
  const res = await axios.get(`${BASE_URL}/cosmos/staking/v1beta1/validators`);
  return res.data;
}
export async function fetchTxs() {
  const res = await axios.get(`${BASE_URL}/cosmos/tx/v1beta1/txs?limit=20`);
  return res.data;
}

// Blocks
export async function fetchBlocks() {
  const latest = await fetchLatestBlock();
  const latestHeight = parseInt(latest.block.header.height);
  const blocks = [];
  for (let h = latestHeight; h > latestHeight - 10; h--) {
    const b = await fetchBlockByHeight(h);
    blocks.push(b.block);
  }
  return blocks;
}
export async function fetchBlockByHeight(height) {
  const res = await axios.get(`${BASE_URL}/cosmos/base/tendermint/v1beta1/blocks/${height}`);
  return res.data;
}

// Transactions
export async function fetchTxByHash(hash) {
  const res = await axios.get(`${BASE_URL}/cosmos/tx/v1beta1/txs/${hash}`);
  return res.data;
}

// Account
export async function fetchAccount(address) {
  try {
    const res = await axios.get(`${BASE_URL}/cosmos/auth/v1beta1/accounts/${address}`);
    const balances = await axios.get(`${BASE_URL}/cosmos/bank/v1beta1/balances/${address}`);
    return {
      ...res.data.account,
      balance: balances.data.balances?.find(b => b.denom === "uward" || b.denom === "uatom")?.amount / 1e6
    };
  } catch {
    return null;
  }
}
export async function fetchTxsByAddress(address) {
  const res = await axios.get(`${BASE_URL}/cosmos/tx/v1beta1/txs?events=message.sender='${address}'&limit=10`);
  return res.data.txs || [];
}

// Validators
export async function fetchValidatorByAddress(address) {
  const res = await axios.get(`${BASE_URL}/cosmos/staking/v1beta1/validators/${address}`);
  return res.data.validator;
}