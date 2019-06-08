var data = new Array();

const targetLon = 37.3; //송도
// km
const rOfEarth = 6371.009;
const length_round = 2 * Math.PI * rOfEarth;
const distancePerLat = length_round / 360;
const distancePerLon = Math.cos(targetLon * Math.PI / 180) * length_round / 360;

let theta;
let lonQuation;
let latQuation;

function convertToXYOfLon(x) {
    return a * x + v;
}

function position() {
    var cX = event.clientX;
    var cY = event.clientY;
    var gps = prompt("GPS");
    var lat = Number(gps.split(",")[0]);
    var lon = Number(gps.split(",")[1]);

    data.push({ x: cX, y: cY, lat: lat, lon: lon })

    console.info(data);

    tryBuildEquation();

}

function unitQualToLat(lonValue) {
    return lonValue * distancePerLon / distancePerLat;
}
function unitQualToLon(LatValue) {
    return LatValue * distancePerLat / distancePerLon;
}

function tryBuildEquation() {
    if (data.length < 3) return;

    theta = calcTheta(unitQualToLat(data[0].lon), data[0].lat, unitQualToLat(data[1].lon), data[1].lat, true) * -1;

    let tempCoordi = calcCoordinatesAfterRotation(unitQualToLat(data[0].lon), data[0].lat, unitQualToLat(data[1].lon), data[1].lat, theta, true);
    tempCoordi.x = unitQualToLon(tempCoordi.x);
    data[1]['lon_rotated'] = tempCoordi.x;
    data[1]['lat_rotated'] = tempCoordi.y;

    let tempCoordi2 = calcCoordinatesAfterRotation(unitQualToLat(data[0].lon), data[0].lat, unitQualToLat(data[2].lon), data[2].lat, theta, true);
    tempCoordi2.x = unitQualToLon(tempCoordi2.x);
    data[2]['lon_rotated'] = tempCoordi2.x;
    data[2]['lat_rotated'] = tempCoordi2.y;


    debugger;
    lonQuation = makeLinearEquation(data[0].lon, data[0].x, data[1].lon_rotated, data[1].x);
    latQuation = makeLinearEquation(data[0].lat, data[0].y, data[2].lat_rotated, data[2].y);



}
function calc(lat, lon) {
    let tempCoordi = calcCoordinatesAfterRotation(unitQualToLat(data[0].lon), data[0].lat, unitQualToLat(lon), lat, theta, true);
    tempCoordi.x = unitQualToLon(tempCoordi.x);

    let x = lonQuation.slope * tempCoordi.x + lonQuation.intercept;
    let y = latQuation.slope * tempCoordi.y + latQuation.intercept;
    return { x: x, y: y };

}


function find() {
    var gps = prompt("찾을 좌표?");
    var lat = Number(gps.split(",")[0]);
    var lon = Number(gps.split(",")[1]);

    var xy = calc(lat, lon);

    console.info(xy);
    $("#result").html(xy['x'] + ', ' + xy['y']);
    drawCircle(xy['x'], xy['y']);

}
function drawTest() {
    drawCircle(5, 5);
}
function drawCircle(x, y) {

    var context = setupCanvas(document.getElementById('myCanvas'));
    var centerX = x;
    var centerY = y;
    var radius = 5;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
}
function setupCanvas(canvas) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
}
function refreshPosition() {
    var cX = event.clientX;
    var cY = event.clientY;
    $("#currentXY").html(cX + ',' + cY);
}

function inputTestData() {
    data.push({ x: 123, y: 133, lat: 35.114833, lon: 129.071113 });
    data.push({ x: 554, y: 131, lat: 35.112753, lon: 129.07548 });
    data.push({ x: 258, y: 474, lat: 35.11134, lon: 129.070341 });

}