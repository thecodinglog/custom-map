/**
 * 지도에서 클릭된 스크린 위치와 입력한 GPS값을 저장한다.
 */
function mapOnclickHandler() {
    let cX = event.clientX;
    let cY = event.clientY;
    let gps = prompt("GPS");
    let lat = Number(gps.split(",")[0]);
    let lon = Number(gps.split(",")[1]);

    data.push({ x: cX, y: cY, lat: lat, lon: lon })
}

/**
 * GPS 좌표를 입력받아 화면좌표를 구하고 그린다.
 */
function find() {
    var gps = prompt("찾을 좌표?");
    var lat = Number(gps.split(",")[0]);
    var lon = Number(gps.split(",")[1]);

    var xy = calcScreenCoordinates(lat, lon);

    console.info(xy);

    drawCircle(xy['x'], xy['y']);
}

/**
 * 입력된 경도를 위도로 단위를 변경한다.
 * @param {number} lonValue 경도
 */
function convertUnitToLat(lonValue) {
    return lonValue * distancePerLon / distancePerLat;
}

/**
 * 입력된 위도를 경도로 단위를 변경한다.
 * @param {number} LatValue 위도
 */
function convertUnitToLon(LatValue) {
    return LatValue * distancePerLat / distancePerLon;
}

/**
 * 원점과 y값이 같은 임의의 점을 잇는 선분과, 원점과 지정한 점을 잇는 선분이 이루는 각도
 * The angle between the line connecting the origin and any point with the same y value and the line connecting the origin and the specified point.
 * @param {number} origin_x 
 * @param {number} origin_y 
 * @param {number} x 
 * @param {number} y 
 * @param {boolean} is_rad 리턴받을 각도가 Rad 여부
 */
function calcTheta(origin_x, origin_y, x, y, is_rad) {
    const a = y - origin_y;
    const b = x - origin_x;

    const theta = Math.atan(a / b);

    if (is_rad) {
        return theta;
    } else {
        return theta * (180 / Math.PI);
    }
}

/**
 * 원점에서 떨어진 임의의 점을 지정한 각도만큼 회전했을 때 좌표
 * Coordinates when rotated by the specified angle
 * @param {number} origin_x 
 * @param {number} origin_y 
 * @param {number} x 
 * @param {number} y 
 * @param {number} theta 
 * @param {boolean} is_rad 입력한 각도가 Rad 여부
 */
function calcCoordinatesAfterRotation(origin_x, origin_y, x, y, theta, is_rad) {
    const rebased_x = x - origin_x;
    const rebased_y = y - origin_y;

    let rad_theta;

    if (is_rad) {
        rad_theta = theta;
    } else {
        rad_theta = theta * (Math.PI / 180);
    }

    const rotatedX = (rebased_x * Math.cos(rad_theta)) - (rebased_y * Math.sin(rad_theta));
    const rotatedY = (rebased_x * Math.sin(rad_theta)) + (rebased_y * Math.cos(rad_theta));

    const xx = rotatedX + origin_x;
    const yy = rotatedY + origin_y;

    return { x: xx, y: yy };
}


/**
 * 평면위에 점 (origin_x,origin_y) 와 (to_x, to_y) 를 지나는 직선의 기울기와 절편을 계산하여 방정식을 만든다.
 * The slope and intercept of the line passing through the point (origin_x, origin_y) and (to_x, to_y)
 * @param {number} origin_x 
 * @param {number} origin_y 
 * @param {number} to_x 
 * @param {number} to_y 
 */
function makeLinearEquation(origin_x, origin_y, to_x, to_y) {
    const x_variation = to_x - origin_x;
    const y_variation = to_y - origin_y;
    const slope = y_variation / x_variation;

    const intercept = origin_y - (slope * origin_x);

    return {slope: slope, intercept: intercept};
}

/**
 * 화면상 좌표를 계산한다.
 * @param {number} lat 위도
 * @param {number} lon 경도
 */
function calcScreenCoordinates(lat, lon) {
    let tempCoordi = calcCoordinatesAfterRotation(convertUnitToLat(data[0].lon), data[0].lat, convertUnitToLat(lon), lat, theta, true);
    tempCoordi.x = convertUnitToLon(tempCoordi.x);

    let x = lonQuation.slope * tempCoordi.x + lonQuation.intercept;
    let y = latQuation.slope * tempCoordi.y + latQuation.intercept;
    return { x: x, y: y };
}


function drawCircle(x, y) {
    let context = setupCanvas(document.getElementById('myCanvas'));
    let centerX = x;
    let centerY = y;
    let radius = 5;

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