import { config } from 'dotenv';
import { ethers } from 'ethers';


config(); // Load environment variables from .env file
  

const smart_contract_addr = process.env.LATEST_SMART_CONTRACT;
const rpc = process.env.RPC_MAINNET_URL;

const provider = new ethers.JsonRpcProvider(rpc);

// use getDrawingCount to deduce drawingId
const abi = [
    "function getDrawingCount() public view returns (uint256)",
    "function getVrfRequestIdFromDrawingId(uint256 _drawingId) external view returns (uint256)",
    "function getRandomNumberDrawnFromDrawingId(uint256 _drawingId) external view returns (uint256)"
];

const contract = new ethers.Contract(smart_contract_addr, abi, provider);

export async function getDrawingCount() {
    return await contract.getDrawingCount();
}

export async function getVrfRequestIdFromDrawingId(drawingId) {
    return await contract.getVrfRequestIdFromDrawingId(drawingId);
}

export async function getRandomNumberDrawnFromDrawingId(drawingId) {
    return await contract.getRandomNumberDrawnFromDrawingId(drawingId);
}

