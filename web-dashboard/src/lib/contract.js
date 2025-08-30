import { ethers } from 'ethers';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

// Contract ABI (simplified - copy from artifacts)
export const CONTRACT_ABI = [
  "function registerValidator(string nodeId, string referrerNodeId) external payable",
  "function submitBandwidthTest(string nodeId, uint256 upload, uint256 download, uint256 latency, uint256 uptime, bytes32 proof) external",
  "function claimEarnings() external",
  "function getNodeStats(string nodeId) external view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)",
  "function MIN_STAKE() external view returns (uint256)",
  "function BASE_REWARD() external view returns (uint256)"
];

export function getContract(provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}
