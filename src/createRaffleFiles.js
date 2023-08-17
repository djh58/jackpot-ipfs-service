import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

export function createRaffleFiles(users, description) {
  const timestamp = Date.now();
  const folderName = `alpha_raffle_${timestamp}`;
  const outputDir = path.join('out', folderName);
  fs.mkdirSync(outputDir, { recursive: true });

  // totalTickets - get this by summing up tickets of each user
  // totalUserCount - get this by counting the number of users
  const totalTickets = users.reduce((sum, user) => sum + user.tickets, 0);
  const totalUserCount = users.length;

  const metadata = {
    timestamp,
    description,
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
