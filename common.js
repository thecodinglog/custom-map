
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
 * 원점과 y값이 같은 임의의 점을 잇는 선분과, 원점과 지정한 점을 잇는 선분이 이루는 각도
 * The angle between the line connecting the origin and any point with the same y value and the line connecting the origin and the specified point.
 * @param {object} origin x, y
 * @param {object} any_coordinate x, y
 * @param {boolean} is_rad 리턴받을 각도가 Rad 여부
 */
function calcThetaProxy(origin, any_coordinate, is_rad) {
    return calcTheta(origin.x, origin.y, any_coordinate.x, any_coordinate.y, is_rad);
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

    const rebased_xx = (rebased_x * Math.cos(rad_theta)) - (rebased_y * Math.sin(rad_theta));
    const rebased_yy = (rebased_x * Math.sin(rad_theta)) + (rebased_y * Math.cos(rad_theta));

    const xx = rebased_xx + origin_x;
    const yy = rebased_yy + origin_y;

    return { x: xx, y: yy };
}
/**
 * 원점에서 떨어진 임의의 점을 지정한 각도만큼 회전했을 때 좌표
 * Coordinates when rotated by the specified angle
 * @param {object} origin 
 * @param {object} any_coordinate 
 * @param {number} theta 
 * @param {boolean} is_rad 입력한 각도가 Rad 여부
 */
function calcCoordinatesAfterRotationProxy(origin, any_coordinate, theta, is_rad) {
    return calcCoordinatesAfterRotation(origin.x, origin.y, any_coordinate.x, any_coordinate.y, theta, is_rad);
}

/**
 * 평면위에 점 (origin_x,origin_y) 와 (to_x, to_y) 를 지나는 직선의 기울기와 절편
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


function calcCoordinatesAfterRotationTest() {
    for (let i = 0; i < 360; i++) {
        console.info(calcCoordinatesAfterRotation(5, 5, 10, 0, i));
    }

}

debugger;
