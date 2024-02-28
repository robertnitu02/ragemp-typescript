import { SHARED_CONSTANTS } from '@shared/constants';

let getNormalizedVector = function(vector: any) {
    let mag = Math.sqrt(
        vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
    );
    vector.x = vector.x / mag;
    vector.y = vector.y / mag;
    vector.z = vector.z / mag;
    return vector;
};
let getCrossProduct = function(v1: any, v2: any) {
    let vector = new mp.Vector3(0, 0, 0);
    vector.x = v1.y * v2.z - v1.z * v2.y;
    vector.y = v1.z * v2.x - v1.x * v2.z;
    vector.z = v1.x * v2.y - v1.y * v2.x;
    return vector;
};
let bindVirtualKeys = {
    F2: 0x71
};
let bindASCIIKeys = {
    Q: 69,
    E: 81,
    LCtrl: 17,
    Shift: 16
};

let isNoClip = false;
let noClipCamera : any;
let shiftModifier = false;
let controlModifier = false;
let localPlayer = mp.players.local;

mp.keys.bind(bindVirtualKeys.F2, true, function() {
    isNoClip = !isNoClip;
    if (isNoClip) {
        startNoClip();
    } else {
        stopNoClip();
    }
});

function startNoClip() {
    let camPos = new mp.Vector3(
        localPlayer.position.x,
        localPlayer.position.y,
        localPlayer.position.z
    );
    let camRot = mp.game.cam.getGameplayCamRot(2);
    noClipCamera = mp.cameras.new('default', camPos, camRot, 45);
    noClipCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
    localPlayer.freezePosition(true);
    localPlayer.setInvincible(true);
}

function stopNoClip() {
    if (noClipCamera) {
        localPlayer.position = noClipCamera.getCoord();
        localPlayer.setHeading(noClipCamera.getRot(2).z);
        noClipCamera.destroy(true);
        noClipCamera = null;
    }
    mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);
    localPlayer.freezePosition(false);
    localPlayer.setInvincible(false);
}

mp.events.add('render', function() {
    if (!noClipCamera || mp.gui.cursor.visible) {
        return;
    }
    controlModifier = mp.keys.isDown(bindASCIIKeys.LCtrl);
    shiftModifier = mp.keys.isDown(bindASCIIKeys.Shift);
    let rot = noClipCamera.getRot(2);
    let fastMult = 1;
    let slowMult = 1;
    if (shiftModifier) {
        fastMult = 3;
    } else if (controlModifier) {
        slowMult = 0.5;
    }
    let rightAxisX = mp.game.controls.getDisabledControlNormal(0, 220);
    let rightAxisY = mp.game.controls.getDisabledControlNormal(0, 221);
    let leftAxisX = mp.game.controls.getDisabledControlNormal(0, 218);
    let leftAxisY = mp.game.controls.getDisabledControlNormal(0, 219);
    let pos = noClipCamera.getCoord();
    let rr = noClipCamera.getDirection();
    let vector = new mp.Vector3(0, 0, 0);
    vector.x = rr.x * leftAxisY * fastMult * slowMult;
    vector.y = rr.y * leftAxisY * fastMult * slowMult;
    vector.z = rr.z * leftAxisY * fastMult * slowMult;
    let upVector = new mp.Vector3(0, 0, 1);
    let rightVector = getCrossProduct(
        getNormalizedVector(rr),
        getNormalizedVector(upVector)
    );
    rightVector.x *= leftAxisX * 0.5;
    rightVector.y *= leftAxisX * 0.5;
    rightVector.z *= leftAxisX * 0.5;
    let upMovement = 0.0;
    if (mp.keys.isDown(bindASCIIKeys.Q)) {
        upMovement = 0.5;
    }
    let downMovement = 0.0;
    if (mp.keys.isDown(bindASCIIKeys.E)) {
        downMovement = 0.5;
    }
    mp.players.local.position = new mp.Vector3(
        pos.x + vector.x + 1,
        pos.y + vector.y + 1,
        pos.z + vector.z + 1
    );
    mp.players.local.heading = rr.z;
    noClipCamera.setCoord(
        pos.x - vector.x + rightVector.x,
        pos.y - vector.y + rightVector.y,
        pos.z - vector.z + rightVector.z + upMovement - downMovement
    );
    noClipCamera.setRot(
        rot.x + rightAxisY * -5.0,
        0.0,
        rot.z + rightAxisX * -5.0,
        2
    );
});

mp.events.add('playerReady', () => {
	mp.console.logInfo(`${mp.players.local.name} is ready!`);
	mp.console.logInfo(SHARED_CONSTANTS.HELLO_WORLD);

	mp.players.local.customProperty = 1;
	mp.console.logInfo(`customProperty: ${mp.players.local.customProperty}`);

	mp.players.local.customMethod = () => {
		mp.console.logInfo(`customMethod called.`);
	};

	mp.players.local.customMethod();
});
