import fs from 'fs';
import path from 'path';
import { getRaffle } from '../db/raffle.js';
import { getPrize } from '../db/prize.js';

export async function createDrawingFiles(users, prize_id) {
  const prize = await getPrize(prize_id);
  if (!prize) {
    console.log("Prize does not exist");
    return;
  }
  if (!prize.raffle_id) {
    console.log("Prize does not have a raffle_id");
    return;
  }
  const raffle = await getRaffle(prize.raffle_id);
  if (!raffle) {
    console.log("Raffle does not exist");
    return;
  }

  const raffleDescription = raffle.description;
  const raffleName = raffle.name;
  const prizeToken = prize.token;
  const prizeAmount = prize.amount;

  const timestamp = Date.now();


  const folderName = `drawing_${prizeToken}_${prizeAmount}_prize_${prize_id}_raffle_${raffle._id}_timestamp_${timestamp}`;
  const outputDir = path.join('out', folderName);
  fs.mkdirSync(outputDir, { recursive: true });

  // totalTickets - get this by summing up tickets of each user
  // totalUserCount - get this by counting the number of users
  const totalTickets = users.reduce((sum, user) => sum + user.tickets, 0);
  const totalUserCount = users.length;

  const metadata = {
    timestamp,
    raffleName,
    raffleDescription,
    prizeToken,
    prizeAmount,
    prizeId: prize_id,
    raffleId: raffle._id,
    totalTickets,
    totalUserCount,
  };
  fs.writeFileSync(path.join(outputDir, 'metadata.json'), JSON.stringify(metadata, null, 2));

  const rawSnapshot = {};
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const id = user._id;
    const wallet = user.ethereum_address;
    const tickets = user.tickets;
    rawSnapshot[id] = { wallet, tickets };
  }
  fs.writeFileSync(path.join(outputDir, 'rawSnapshot.json'), JSON.stringify(rawSnapshot, null, 2));

  const formattedWallets = formatWallets(users, totalTickets);
  fs.writeFileSync(path.join(outputDir, 'formattedWallets.json'), JSON.stringify(formattedWallets, null, 2));
  return outputDir;
}

function formatWallets(users, totalTickets) {
  const formattedWallets = {};

  let lower = 0;
  for (let i = 0; i < users.length; i++) {
    
    const tickets = users[i].tickets;
    const address = users[i].ethereum_address;
    const odds = tickets / totalTickets;
    const upper = lower + tickets - 1;
    formattedWallets[users[i]._id] = { lower, upper, odds, address };
    lower += tickets;
  }

  return formattedWallets;
}
