import fs from 'fs';
import path from 'path';

function createRaffleFiles(IDs, wallets, XP, raffleID, prizes, description, winnersIDs, drawingID) {
  const timestamp = Date.now();
  const folderName = `raffle_${raffleID}_drawing_${drawingID}_${timestamp}`;
  const outputDir = path.join('out', folderName);
  fs.mkdirSync(outputDir, { recursive: true });

  const metadata = {
    timestamp,
    raffleID,
    drawingID,
    prizes,
    description,
    totalXP: XP.reduce((sum, xp) => sum + xp, 0),
    totalXpEligible: calculateTotalXpEligible(XP, winnersIDs),
  };
  fs.writeFileSync(path.join(outputDir, 'metadata.json'), JSON.stringify(metadata, null, 2));

  const rawSnapshot = {};
  for (let i = 0; i < IDs.length; i++) {
    const ID = IDs[i];
    const wallet = wallets[i];
    const xp = XP[i];
    const hasWon = winnersIDs.includes(ID);
    rawSnapshot[ID] = { wallet, xp, hasWon };
  }
  fs.writeFileSync(path.join(outputDir, 'rawSnapshot.json'), JSON.stringify(rawSnapshot, null, 2));

  const eligibleWallets = generateEligibleWallets(wallets, XP, winnersIDs, metadata.totalXpEligible);
  fs.writeFileSync(path.join(outputDir, 'eligibleWallets.json'), JSON.stringify(eligibleWallets, null, 2));
}

function calculateTotalXpEligible(XP, winnersIDs) {
  const totalXpWinners = winnersIDs.reduce((sum, ID) => sum + XP[ID], 0);
  return XP.reduce((sum, xp) => sum + xp) - totalXpWinners;
}

function generateEligibleWallets(wallets, XP, winnersIDs, totalXpEligible) {
  const eligibleWallets = {};

  let lower = 0;
  for (let i = 0; i < wallets.length; i++) {
    const ID = IDs[i];
    if (!winnersIDs.includes(ID)) {
      const xp = XP[i];
      const odds = xp / totalXpEligible;
      const upper = lower + xp - 1;
      eligibleWallets[wallets[i]] = { lower, upper, odds };
      lower += xp;
    }
  }

  return eligibleWallets;
}

// Example usage
const IDs = ['1', '2', '3', '4', '5'];
const wallets = ['0x123', '0x456', '0x789', '0xabc', '0xdef'];
const XP = [5, 3, 2, 4, 6];
const raffleID = '123456';
const prizes = [
  { token: 'Token1', amount: 10 },
  { token: 'Token2', amount: 5 },
  { token: 'Token3', amount: 8 },
];
const description = 'Example raffle';
const winnersIDs = ['1', '3'];
const drawingID = 'drawing-1';

createRaffleFiles(IDs, wallets, XP, raffleID, prizes, description, winnersIDs, drawingID);
