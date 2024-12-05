// 6371000 meters is the radius of the Earth.
// The Karman line is at 6471000 meters. ie 1.57% of Earth’s radius.
// 6371000/10 meters = 1 World unit
let worldFactor = 6371000;

function toWorldUnits(d) {
    return d/worldFactor;
}

function scaleAltitude(a) {
    const limit = 5;
    const scaledAltitude = 2 + toWorldUnits(a);
    return scaledAltitude < limit ? scaledAltitude : limit;
}

export { toWorldUnits, scaleAltitude }