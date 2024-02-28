import './setup';

import { SHARED_CONSTANTS } from '@shared/constants';

//@ts-ignore
function xyInFrontOfPos(pos, heading, dist) {
    heading *= Math.PI / 180;
    pos.x += (dist * Math.sin(-heading));
    pos.y += (dist * Math.cos(-heading));
    return pos;
}

mp.events.add("playerJoin", (player) => {
	//@ts-ignore
    player.vspawner_Vehicle = null;
});

mp.events.add("playerQuit", (player) => {
	//@ts-ignore
    if (player.vspawner_Vehicle) player.vspawner_Vehicle.destroy();
});

mp.events.addCommand("veh", (player, vehicle) => {
    let position = xyInFrontOfPos(player.position, player.heading, 3.0);

    mp.vehicles.new(mp.joaat(vehicle), position, {heading: player.heading, numberPlate: player.name, dimension: player.dimension});
});

// Tuning
mp.events.add("mod", (player, mod, modvalue) => {
    console.log(mod, modvalue);
    player.vehicle.setMod(parseInt(mod), parseInt(modvalue));
});

mp.events.addCommand('mod', (player, _fullText, a , b) => {
    console.log('mod');
    player.vehicle.setMod(parseInt(a), parseInt(b));
});

mp.events.add('playerReady', (player) => {
	console.log(`${player.name} is ready!`);

	player.customProperty = 1;

	player.customMethod = () => {
		console.log('customMethod called.');
	};

	player.customMethod();
});

console.log(SHARED_CONSTANTS.HELLO_WORLD);
