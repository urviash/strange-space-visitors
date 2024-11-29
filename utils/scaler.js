// 6371000 meters is the radius of the Earth.
// The Karman line is at 6471000 meters. ie 1.57% of Earth’s radius.
// 6371000/10 meters = 1 World unit
let worldFactor = 637100;
let altFactor = 1.2;

function toWorldUnits(d) {
    return d/worldFactor;
}

function scaleAltitude(a) {
    return a*altFactor;
}

export { toWorldUnits, scaleAltitude }