import { initializeRaffle } from './raffle.js';
import { initializePrize } from './prize.js';


// create a raffle called Alpha Raffle v0 with Description "Testing"
// prizes: 20 x $25 USDC and then 4 x $250 USDC and 1 x $1000 USDC

async function main() {
    const RAFFLE_NAME = "Alpha Raffle v0";
    const RAFFLE_DESCRIPTION = "Testing";
    const SMALL_PRIZE = {
        token: "USDC",
        amount: "25"
    }
    const MEDIUM_PRIZE = {
        token: "USDC",
        amount: "250"
    }
    const LARGE_PRIZE = {
        token: "USDC",
        amount: "1000"
    }
    const SMALL_PRIZE_COUNT = 20;
    const MEDIUM_PRIZE_COUNT = 4;
    const LARGE_PRIZE_COUNT = 1;

    const all_prizes = [];
    for (let i = 0; i < SMALL_PRIZE_COUNT; i++) {
        all_prizes.push(SMALL_PRIZE);
    }
    for (let i = 0; i < MEDIUM_PRIZE_COUNT; i++) {
        all_prizes.push(MEDIUM_PRIZE);
    }
    for (let i = 0; i < LARGE_PRIZE_COUNT; i++) {
        all_prizes.push(LARGE_PRIZE);
    }

    const raffle = await initializeRaffle(RAFFLE_NAME, RAFFLE_DESCRIPTION);
    const raffle_id = raffle.insertedId.toString();
    console.log("raffle_id: ", raffle_id);

    for (const prize of all_prizes) {
        const { token, amount } = prize;
        await initializePrize(raffle_id, null, token, amount);
    }


}

main().catch(console.error).finally(() => process.exit());
