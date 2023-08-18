import { getUser } from "../db/optins.js";
import { getPrizesFromRaffle } from "../db/prize.js";
import { getDrawing } from "../db/drawing.js";

async function main() {
    const RAFFLE_ID = "64decbc59bec1720ae832cfd";
    const prizes = await getPrizesFromRaffle(RAFFLE_ID);
    if (!prizes || prizes.length === 0) {
        console.log("No prizes found");
        return;
    }
    for (const prize of prizes) {
        const drawing_id = prize.drawing_id;
        if (!drawing_id) {
            console.log("Prize does not have a drawing_id");
            continue;
        }
        const drawing = await getDrawing(drawing_id.toString());
        if (!drawing) {
            console.log("Drawing not found");
            continue;
        }
        if (!drawing.winner_id) {
            console.log("Drawing does not have a winner_id");
            continue;
        }

        const user = await getUser(drawing.winner_id.toString());
        if (!user) {
            console.log("User not found");
            continue;
        }

        console.log(`Winner of prize ${prize._id} (${prize.amount} ${prize.token}) is ${user.discord_username}`)
        console.log(`User id: ${user._id} - twitter handle ${user.twitter_username} - ticket count: ${user.tickets} - eth address: ${user.ethereum_address}`)
        console.log();


    }
}

main();