const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let player = {
    x: 3,
    y: 3,
    z: 0,
    health: 100,
    direction: 3 * Math.PI / 2 + 0.01,
    velocity: {
        x: 0,
        y: 0,
        z: 0
    }
}
const ImageLoader = {
    load(src) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 60;
        canvas.height = 60;
        ctx.fillStyle = "cyan";
        ctx.beginPath();
        ctx.arc(30, 30, 30, 0, Math.PI * 2);
        ctx.fill();
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return imgData;
    }
}
let bullets = [];
let particles = [];
let enemies = [];
let bulletImage = ImageLoader.load("bullet.png");
let targetGunTransform = 0;
let gunTransform = 0;
const order = (a, b) => b.minDist - a.minDist;
const orderHeight = (a, b) => a.line.height - b.line.height;
let obstacleLines = [];
obstacleLines.push(...createPolygon(0, 0, 2.5, 16).map(line => ({...line, height: 2, color: [0, 255, 0] })));
obstacleLines.push(...createPolygon(5, 0, 1, 8).map(line => ({...line, height: 1.5, color: [0, 255, 255] })));
obstacleLines.push(...createPolygon(-5, 0, 1, 8).map(line => ({...line, height: 1.5, color: [0, 255, 255] })));
obstacleLines.push(...createPolygon(0, 5, 1, 8).map(line => ({...line, height: 1.5, color: [0, 255, 255] })));
obstacleLines.push(...createPolygon(0, -5, 1, 8).map(line => ({...line, height: 1.5, color: [0, 255, 255] })));
obstacleLines.push(...createRectangle(0, -0.5, 5, 1));
obstacleLines.push(...createRectangle(0, -0.5, -5, 1));
obstacleLines.push(...createRectangle(-0.5, 0, 1, 5));
obstacleLines.push(...createRectangle(-0.5, 0, 1, -5));
obstacleLines.push(...createRectangle(-20.5, -20.5, 1, 10));
obstacleLines.push(...createRectangle(-20.5, -20.5, 10, 1));
obstacleLines.push(...createRectangle(-20.5, 20.5, 1, -10));
obstacleLines.push(...createRectangle(-20.5, 20.5, 10, 1));
obstacleLines.push(...createRectangle(20.5, 20.5, 1, -10));
obstacleLines.push(...createRectangle(20.5, 20.5, -10, 1));
obstacleLines.push(...createRectangle(20.5, -20.5, 1, 10));
obstacleLines.push(...createRectangle(20.5, -20.5, -10, 1));
//obstacleLines.push(...createRectangle(20.5, -5, 0.5, 10).map(line => ({...line, height: 0.5 })));
/*obstacleLines.push({ x1: 20.5, y1: -5, x2: 20.5, y2: 5, height: 0.7501, color: [250, 125, 60] });
obstacleLines.push({ x1: -20.5, y1: -5, x2: -20.5, y2: 5, height: 0.7502, color: [250, 125, 60] });
obstacleLines.push({ x1: -5, y1: 20.5, x2: 5, y2: 20.5, height: 0.7503, color: [250, 125, 60] });
obstacleLines.push({ x1: -5, y1: -20.5, x2: 5, y2: -20.5, height: 0.7504, color: [250, 125, 60] });*/
obstacleLines.push(...createRectangle(20.375, -5, 0.25, 10).map(line => ({...line, height: 0.75, color: [250, 125, 60] })));
obstacleLines.push(...createRectangle(-20.625, -5, 0.25, 10).map(line => ({...line, height: 0.75, color: [250, 125, 60] })));
obstacleLines.push(...createRectangle(-5, 20.375, 10, 0.25).map(line => ({...line, height: 0.75, color: [250, 125, 60] })));
obstacleLines.push(...createRectangle(-5, -20.625, 10, 0.25).map(line => ({...line, height: 0.75, color: [250, 125, 60] })));
for (let i = 0; i < 6; i++) {
    let height = 0.9;
    if (i === 0 || i === 5) {
        height = 1.15;
    }
    obstacleLines.push(...createRectangle(20.25, -5 + 2 * i, 0.5, 0.5).map(line => ({...line, height, color: [255, 170, 100] })))
}
for (let i = 0; i < 6; i++) {
    let height = 0.9;
    if (i === 0 || i === 5) {
        height = 1.15;
    }
    obstacleLines.push(...createRectangle(-20.75, -5 + 2 * i, 0.5, 0.5).map(line => ({...line, height, color: [255, 170, 100] })))
}
for (let i = 0; i < 6; i++) {
    let height = 0.9;
    if (i === 0 || i === 5) {
        height = 1.15;
    }
    obstacleLines.push(...createRectangle(-5 + 2 * i, 20.25, 0.5, 0.5).map(line => ({...line, height, color: [255, 170, 100] })))
}
for (let i = 0; i < 6; i++) {
    let height = 0.9;
    if (i === 0 || i === 5) {
        height = 1.15;
    }
    obstacleLines.push(...createRectangle(-5 + 2 * i, -20.75, 0.5, 0.5).map(line => ({...line, height, color: [255, 170, 100] })))
}
obstacleLines.push(...createPolygon(20.5, 20.5, 2.5, 8).map(line => ({...line, height: 1.5 })));
obstacleLines.push(...createPolygon(-20.5, 20.5, 2.5, 8).map(line => ({...line, height: 1.5 })));
obstacleLines.push(...createPolygon(-20.5, -20.5, 2.5, 8).map(line => ({...line, height: 1.5 })));
obstacleLines.push(...createPolygon(20.5, -20.5, 2.5, 8).map(line => ({...line, height: 1.5 })));

obstacleLines.forEach(line => {
    if (!line.height) {
        line.height = 1;
    }
    if (!line.color) {
        line.color = [255, 255, 255];
    }
})
let keys = {};

function angleDistance(alpha, beta) {
    let phi = Math.abs(beta - alpha) % Math.PI * 2;
    let distance = phi > Math.PI ? Math.PI * 2 - phi : phi;
    return distance;
}

function normalizeAngle(angle) {
    return (angle + Math.PI * 2) % (Math.PI * 2);
}

function angle_between(n, a, b) {
    n = (Math.PI * 2 + (n % Math.PI * 2)) % Math.PI;
    a = (Math.PI * 20 + a) % Math.PI * 2;
    b = (Math.PI * 20 + b) % Math.PI * 2;

    if (a < b)
        return a <= n && n <= b;
    return a <= n || n <= b;
}
var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

// Takes any integer
function seed(i) {
    m_w = (123456789 + i) & mask;
    m_z = (987654321 - i) & mask;
}
let starSeed = Math.floor(Math.random() * 1000);
// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
function random() {
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
}
const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height / 2)
skyGrad.addColorStop(0, "black");
skyGrad.addColorStop(1, "rgb(100, 0, 0)");
let time = Date.now();

function main() {
    stats.end();
    document.getElementById("playerHealth").style.width = ((player.health) / 100 * 117) + "px";
    if (Math.random() < 0.001) {
        let angle = Math.random() * Math.PI * 2;
        enemies.push({
            x: 50 * Math.cos(angle),
            y: 50 * Math.sin(angle),
            z: 0,
            size: 60,
            type: "beholder",
            xVel: 0,
            yVel: 0,
            health: 3
        })
    }
    const timeScale = (Date.now() - time) / 16;
    time = Date.now();
    canvas.style.height = Math.round(window.innerHeight * 0.975) + "px";
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.direction %= Math.PI * 2;
    futureCam = {...player };
    if (keys["w"]) {
        player.velocity.x += 0.025 * Math.cos(player.direction);
        player.velocity.y += 0.025 * Math.sin(player.direction);
    }
    if (keys["s"]) {
        player.velocity.x -= 0.025 * Math.cos(player.direction);
        player.velocity.y -= 0.025 * Math.sin(player.direction);
    }
    if (keys["a"]) {
        player.velocity.x += 0.025 * Math.cos(player.direction - Math.PI / 2);
        player.velocity.y += 0.025 * Math.sin(player.direction - Math.PI / 2);
    }
    if (keys["d"]) {
        player.velocity.x += 0.025 * Math.cos(player.direction + Math.PI / 2);
        player.velocity.y += 0.025 * Math.sin(player.direction + Math.PI / 2);
    }
    if (keys[" "] && player.z === 0) {
        player.velocity.z += 0.025;
    }
    if (player.z > 0) {
        player.velocity.z -= 0.001;
        player.velocity.x *= 0.92;
        player.velocity.y *= 0.92;
    } else {
        player.velocity.x *= 0.9;
        player.velocity.y *= 0.9;
    }
    futureCam.x += player.velocity.x * timeScale;
    futureCam.y += player.velocity.y * timeScale;
    futureCam.z += player.velocity.z;
    if (futureCam.z <= 0) {
        player.z = 0;
        futureCam.z = 0;
        player.velocity.z = 0;
    }
    if (obstacleLines.every(oLine => perpendicularDistance(oLine, futureCam) > 0.175)) {
        player = futureCam;
    } else {
        player.velocity.x *= -1;
        player.velocity.y *= -1;
        player.x += 2 * player.velocity.x;
        player.y += 2 * player.velocity.y;
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    seed(starSeed);
    for (let i = 0; i < 120; i++) {
        ctx.beginPath();
        let xPos = -3 * canvas.width * 2.67 + random() * 6 * canvas.width * 2.67 - player.direction * canvas.width;
        if (xPos >= 0 && xPos <= canvas.width) {
            ctx.arc(xPos, random() * (canvas.height / 2), 1, 0, Math.PI * 2);
        }
        ctx.fill();
    }
    ctx.fillStyle = "rgb(150, 100, 0)";
    ctx.fillRect(0, canvas.height / 2 + player.z * canvas.height / 100, canvas.width, canvas.height / 2);
    const playerMagnitude = Math.hypot(player.velocity.x, player.velocity.y);
    const zbuffer = (new Array(480)).fill(Infinity);
    for (let j = 0; j < canvas.width; j += 1) {
        const x = j / canvas.width - 0.5;
        const angle = Math.atan2(x, 0.75);
        const range = 1000;
        const rayAngle = player.direction + angle;
        const ray = { x1: player.x, y1: player.y, x2: player.x + Math.cos(rayAngle) * range, y2: player.y + Math.sin(rayAngle) * range }
        const intersections = [];
        //let closestPoint = undefined;
        //let minDist = Infinity;
        //let line = undefined;
        //const i = { point: { x: 0, y: 0 }, intersect: true };
        obstacleLines.forEach(oline => {
            const i = intersect(ray, oline);
            const dist = (i.point.x - player.x) ** 2 + (i.point.y - player.y) ** 2;
            if (i.intersect) {
                minDist = dist;
                closestPoint = i.point;
                line = oline;
                intersections.push({ minDist, closestPoint, line })
            }
            /*if (i.intersect && oline.height > line.height) {
                minDist = dist;
                closestPoint = i.point;
                line = oline;
            }*/
        });
        intersections.sort(order);
        let newIntersections = {};
        let seenHeights = [];
        for (const inter of intersections) {
            if (!(inter.line.height in newIntersections)) {
                newIntersections[inter.line.height] = []
            }
            newIntersections[inter.line.height].push(inter);
        }
        newIntersections = Object.entries(newIntersections);
        newIntersections.sort((a, b) => a[0] - b[0]);
        for (let i = 0; i < newIntersections.length; i++) {
            newIntersections[i][1].sort((a, b) => a.minDist - b.minDist);
        }
        newIntersections = newIntersections.map(x => x[1][0]);
        newIntersections.sort(order);
        // newIntersections.sort(order);
        newIntersections.forEach(({ closestPoint, minDist, line }, i) => {
            if (newIntersections.slice(i).some(elem => elem.line.height > line.height)) {
                return;
            }
            if (zbuffer[j] === undefined) {
                zbuffer[j] = minDist;
            } else if (minDist < zbuffer[j]) {
                zbuffer[j] = minDist;
            }
            const playerDist = Math.sqrt((closestPoint.x - player.x) ** 2 + (closestPoint.y - player.y) ** 2);
            const z = playerDist * Math.cos(angle);
            const wallHeight = (canvas.height / z);
            const heightMultiplier = (line && line.height ? line.height : 1);
            let shading = 50;
            if (line) {
                let lineAngle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
                shading *= (1.5 - 0.15 * angleDistance(Math.PI, lineAngle));
            }
            shading = Math.max(Math.min(shading, 200), 50);

            //shading = Math.max(Math.min(shading, 200), 50);
            if (wallHeight > 1) {
                ctx.fillStyle = `rgb(${shading * (line.color[0] / 255)}, ${shading * (line.color[1] / 255)}, ${shading * (line.color[2] / 255)})`;
                ctx.fillRect(j, (canvas.height - wallHeight) / 2 + player.z * (canvas.height / z) + wallHeight * (1 - heightMultiplier), 1, wallHeight * heightMultiplier);
                const reflectGrad = ctx.createLinearGradient(j, (canvas.height - wallHeight) / 2 + player.z * (canvas.height / z), j, ((canvas.height - wallHeight) / 2) + wallHeight + 200 / z + player.z * (canvas.height / z));
                reflectGrad.addColorStop(0, `rgb(${(shading * (line.color[0] / 255) + 150) / 2}, ${(shading* (line.color[1] / 255) + 75) / 2}, ${ (shading* (line.color[2] / 255)) / 2})`);
                reflectGrad.addColorStop(1, "rgb(150, 100, 0)");
                ctx.fillStyle = reflectGrad;
                ctx.fillRect(j, (canvas.height - wallHeight) / 2 + wallHeight + player.z * (canvas.height / z), 1, 200 / z);
            }
        });
        /*ctx.strokeStyle = "yellow";
        ctx.beginPath();
        ctx.moveTo(player.x * 30 + 15, player.y * 30 + 15);
        ctx.lineTo(closestPoint.x * 30, closestPoint.y * 30);
        ctx.stroke();*/
    }
    /*ctx.strokeStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo(player.x * 30 + 15, player.y * 30 + 15);
    ctx.lineTo(rayEnd.x * 30 + 15, rayEnd.y * 30 + 15);
    ctx.stroke();*/
    const sprites = [...bullets, ...particles, ...enemies];
    sprites.sort((a, b) => Math.hypot(player.x - b.x, player.y - b.y) - Math.hypot(player.x - a.x, player.y - a.y));
    sprites.forEach(sprite => {
        if (bullets.includes(sprite)) {
            const bullet = sprite;
            const angleToPlayer = Math.atan2(bullet.y - player.y, bullet.x - player.x);
            const playerDist = Math.sqrt((bullet.x - player.x) ** 2 + (bullet.y - player.y) ** 2);
            const z = Math.max(playerDist * Math.cos(normalizeAngle(angleToPlayer - normalizeAngle(player.direction))), 0);
            const x = (Math.tan(normalizeAngle(angleToPlayer - player.direction)) * 0.75 + 0.5) * canvas.width;
            ctx.beginPath();
            if (z > 0) {
                let zbuff = zbuffer[Math.round(x)];
                if (x < 0) {
                    zbuff = zbuffer[0];
                }
                if (x > canvas.width) {
                    zbuff = zbuffer[canvas.width - 1];
                }
                const normalizedPlayerDist = playerDist * Math.cos(normalizeAngle(angleToPlayer - normalizeAngle(player.direction)));
                if (normalizedPlayerDist < Math.sqrt(zbuff)) {
                    ctx.arc(x, canvas.height / 2 + player.z * (canvas.height / z) + bullet.z * (canvas.height / z), 15 / z, 0, Math.PI * 2);
                    const grad = ctx.createLinearGradient(0, canvas.height / 2 + player.z * (canvas.height / z) - 15 / z + bullet.z * (canvas.height / z), 0, canvas.height / 2 + player.z * (canvas.height / z) + 15 / z + bullet.z * (canvas.height / z));
                    grad.addColorStop(0, `rgb(${bullet.color.join(", ")})`);
                    grad.addColorStop(1, `rgb(${bullet.color.map(x => x * 0.75).join(", ")})`);
                    ctx.fillStyle = grad;
                    ctx.fill();
                    //ctx.fillStyle = "rgb(112.5, 75, 0)";
                    ctx.fillStyle = "black";
                    ctx.globalAlpha = 0.33;
                    ctx.beginPath();
                    ctx.ellipse(x, canvas.height / 2 + player.z * (canvas.height / z) + 0.5 * (canvas.height / z), 15 / z, 5 / z, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            }
            bullet.x += bullet.xVel;
            bullet.y += bullet.yVel;
            bullet.bounced -= 1;
            // bullet.xVel *= 1.1;
            // bullet.yVel *= 1.1;
            obstacleLines.some(oLine => {
                if (perpendicularDistance(oLine, bullet) < 0.1 && bullet.bounced < 0) {
                    bullets.splice(bullets.indexOf(bullet), 1);
                    let shading = 50;
                    let lineAngle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
                    shading *= (1.5 - 0.2 * angleDistance(Math.PI, lineAngle));
                    shading = Math.max(Math.min(shading, 200), 50);
                    shading += 50;
                    const color = `rgb(${shading * (oLine.color[0] / 255)},${shading * (oLine.color[1] / 255)},${shading * (oLine.color[2] / 255)})`;
                    for (let i = 0; i < 30 + Math.floor(Math.random() * 30); i++) {
                        particles.push({
                            x: bullet.x + 0.5 * (Math.random() - 0.5),
                            y: bullet.y + 0.5 * (Math.random() - 0.5),
                            size: 5 + Math.random() * 5,
                            color,
                            z: bullet.z + Math.random() * 0.4 - 0.2,
                            xVel: 0.05 * (Math.random() - 0.5),
                            yVel: 0.05 * (Math.random() - 0.5),
                            zVel: 0.05 * (Math.random() - 0.5),
                        })
                    }
                    return true;
                }
                return false;
            });
            if (playerDist > 100) {
                bullets.splice(bullets.indexOf(bullet), 1);
            }
            if (playerDist < 0.25 && Math.abs(player.z - bullet.z) < 0.25 && bullet.side === "enemy") {
                bullets.splice(bullets.indexOf(bullet), 1);
                player.velocity.x += bullet.xVel;
                player.velocity.y += bullet.yVel;
                for (let i = 0; i < 30 + Math.floor(Math.random() * 30); i++) {
                    particles.push({
                        x: bullet.x + 0.5 * (Math.random() - 0.5),
                        y: bullet.y + 0.5 * (Math.random() - 0.5),
                        invariant: true,
                        size: 5 + Math.random() * 5,
                        color: `rgb(${150 + Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 50})`,
                        z: bullet.z + Math.random() * 0.4 - 0.2,
                        xVel: 0.05 * (Math.random() - 0.5),
                        yVel: 0.05 * (Math.random() - 0.5),
                        zVel: 0.05 * (Math.random() - 0.5),
                    })
                }
                player.health -= 1 + 4 * Math.random();
                return;
            }
        } else if (particles.includes(sprite)) {
            const particle = sprite;
            const angleToPlayer = Math.atan2(particle.y - player.y, particle.x - player.x);
            const playerDist = Math.sqrt((particle.x - player.x) ** 2 + (particle.y - player.y) ** 2);
            let z = Math.max(playerDist * Math.cos(normalizeAngle(angleToPlayer - normalizeAngle(player.direction))), 0);
            const x = (Math.tan(normalizeAngle(angleToPlayer - player.direction)) * 0.75 + 0.5) * canvas.width;
            ctx.beginPath();
            if (z > 0) {
                if (particle.invariant) {
                    z = 1;
                }
                let zbuff = zbuffer[Math.round(x)];
                if (x < 0) {
                    zbuff = zbuffer[0];
                }
                if (x > canvas.width) {
                    zbuff = zbuffer[canvas.width - 1];
                }
                const normalizedPlayerDist = playerDist * Math.cos(normalizeAngle(angleToPlayer - normalizeAngle(player.direction)));
                if (normalizedPlayerDist < Math.sqrt(zbuff)) {
                    ctx.arc(x, canvas.height / 2 + player.z * (canvas.height / z) + particle.z * (canvas.height / z), particle.size / z, 0, Math.PI * 2);
                    ctx.fillStyle = particle.color;
                    ctx.fill();
                }
            }
            particle.size *= particle.decayRate ? particle.decayRate : 0.9;
            if (!particle.noGrav) {
                particle.zVel += 0.01;
            }
            particle.x += particle.xVel;
            particle.y += particle.yVel;
            if (particle.z < 0.5) {
                particle.z += particle.zVel;
            }
            if (particle.size < 1) {
                particles.splice(particles.indexOf(particle), 1);
            }
        } else if (enemies.includes(sprite)) {
            const enemy = sprite;
            const angleToPlayer = Math.atan2(enemy.y - player.y, enemy.x - player.x);
            const playerDist = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);
            if (!enemy.shootTick) {
                enemy.shootTick = 0;
                enemy.targetTick = 45 + Math.random() * (120 - 45);
            }
            if (!enemy.hit) {
                enemy.hit = 0;
            }
            if (!enemy.dodge) {
                enemy.dodge = Math.PI / 2;
            }
            enemy.hit--;
            if (playerDist < 5) {
                enemy.shootTick += 1;
            } else if (enemy.shootTick < enemy.targetTick) {
                enemy.shootTick += 1;
            }
            let lineOfSight = { x1: enemy.x, y1: enemy.y, x2: player.x, y2: player.y };
            let blocked = obstacleLines.some(line => {
                const intersections = intersect(lineOfSight, line);
                return intersections.intersect && Math.hypot(intersections.point.x - enemy.x, intersections.point.y - enemy.y) < playerDist;
            });
            if (playerDist > 5 && !blocked) {
                enemy.xVel += 0.01 * Math.cos(angleToPlayer + Math.PI);
                enemy.yVel += 0.01 * Math.sin(angleToPlayer + Math.PI);
            }
            if (playerDist < 2 && !blocked) {
                enemy.xVel -= 0.01 * Math.cos(angleToPlayer + Math.PI);
                enemy.yVel -= 0.01 * Math.sin(angleToPlayer + Math.PI);
            }
            enemy.yVel *= 0.9;
            if (obstacleLines.some(oLine => perpendicularDistance(oLine, enemy) < 0.25)) {
                enemy.xVel *= -0.5;
                enemy.yVel *= -0.5;
                enemy.x += 3 * enemy.xVel;
                enemy.y += 3 * enemy.yVel;
            }
            enemy.x += enemy.xVel;
            enemy.y += enemy.yVel;
            enemy.xVel *= 0.9;
            enemies.forEach(e => {
                if (e !== enemy) {
                    const enemyDist = Math.hypot(e.x - enemy.x, e.y - enemy.y);
                    if (enemyDist < 1) {
                        const angle = Math.atan2(e.y - enemy.y, e.x - enemy.x);
                        let heading = Math.atan2(enemy.yVel, enemy.xVel);
                        heading -= angleDistance(angle, heading) / 10;
                        enemy.xVel += 0.005 * Math.cos(heading);
                        enemy.yVel += 0.005 * Math.sin(heading);
                    }
                }
            })
            bullets.forEach(bullet => {
                if (bullet.side === "player") {
                    const bulletDist = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
                    if (bulletDist < 1.5) {
                        const toBullet = Math.atan2(bullet.y - enemy.y, bullet.x - enemy.x);
                        enemy.xVel += 0.025 * Math.cos(toBullet + enemy.dodge);
                        enemy.yVel += 0.025 * Math.sin(toBullet + enemy.dodge);
                    }
                    if (bulletDist < 0.25 && Math.abs(bullet.z - enemy.z) < 0.25) {
                        enemy.dodge *= -1;
                        for (let i = 0; i < 30 + Math.floor(Math.random() * 30); i++) {
                            particles.push({
                                x: bullet.x + 0.5 * (Math.random() - 0.5),
                                y: bullet.y + 0.5 * (Math.random() - 0.5),
                                size: 5 + Math.random() * 5,
                                color: `rgb(${150 + Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 50})`,
                                z: bullet.z + Math.random() * 0.4 - 0.2,
                                xVel: 0.05 * (Math.random() - 0.5),
                                yVel: 0.05 * (Math.random() - 0.5),
                                zVel: 0.05 * (Math.random() - 0.5),
                            })
                        }
                        enemy.xVel += bullet.xVel;
                        enemy.yVel += bullet.yVel;
                        bullets.splice(bullets.indexOf(bullet), 1);
                        enemy.health -= 1;
                        enemy.hit = 30;
                    }
                }
            })
            if (playerDist < 5 && enemy.shootTick > enemy.targetTick) {
                enemy.dodge *= -1;
                bullets.push({
                    x: enemy.x + 1 * Math.cos(angleToPlayer + Math.PI),
                    y: enemy.y + 1 * Math.sin(angleToPlayer + Math.PI),
                    z: enemy.z + 0.05,
                    xVel: 0.25 * Math.cos(angleToPlayer + Math.PI),
                    yVel: 0.25 * Math.sin(angleToPlayer + Math.PI),
                    color: [200, 100, 0],
                    bounced: 0,
                    side: "enemy"
                });
                for (let i = 0; i < 20 + Math.floor(Math.random() * 20); i++) {
                    particles.push({
                        x: enemy.x + 0.1 * (Math.random() - 0.5) + 0.5 * Math.cos(angleToPlayer + Math.PI),
                        y: enemy.y + 0.1 * (Math.random() - 0.5) + 0.5 * Math.sin(angleToPlayer + Math.PI),
                        size: 2 + Math.random() * 3,
                        noGrav: true,
                        decayRate: 0.8,
                        color: `rgb(${150 + 100 * Math.random()}, ${100 + 100 * Math.random()}, ${50 * Math.random()})`,
                        z: -enemy.z + Math.random() * 0.1 - 0.05,
                        xVel: 0.025 * (Math.random() - 0.5),
                        yVel: 0.025 * (Math.random() - 0.5),
                        zVel: 0.025 * (Math.random() - 0.5),
                    })
                }
                enemy.shootTick = 0;
                enemy.targetTick = Math.random() * 120;
            }
            let z = Math.max(playerDist * Math.cos(normalizeAngle(angleToPlayer - normalizeAngle(player.direction))), 0);
            const x = (Math.tan(normalizeAngle(angleToPlayer - player.direction)) * 0.75 + 0.5) * canvas.width;
            ctx.beginPath();
            if (z > 0) {
                let zbuff = zbuffer[Math.round(x)];
                if (x < 0) {
                    zbuff = zbuffer[0];
                }
                if (x > canvas.width) {
                    zbuff = zbuffer[canvas.width - 1];
                }
                const normalizedPlayerDist = playerDist * Math.cos(normalizeAngle(angleToPlayer - normalizeAngle(player.direction)));
                if (normalizedPlayerDist < Math.sqrt(zbuff)) {
                    ctx.lineWidth = 4 / z;
                    ctx.strokeStyle = "black";
                    let y = canvas.height / 2 + player.z * (canvas.height / z) + enemy.z * (canvas.height / z);
                    ctx.arc(x, y, enemy.size / z, 0, Math.PI * 2);
                    const grad = ctx.createLinearGradient(0, canvas.height / 2 + player.z * (canvas.height / z) - enemy.z / z + enemy.z * (canvas.height / z), 0, canvas.height / 2 + player.z * (canvas.height / z) + enemy.size / z + enemy.z * (canvas.height / z));
                    grad.addColorStop(0, "rgb(150, 0, 0)");
                    grad.addColorStop(1, "rgb(100, 0, 0)");
                    ctx.fillStyle = grad;
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(x, y - (enemy.size) / 3.5 / z, (enemy.size * 0.4) / z, 0, Math.PI * 2);
                    ctx.fillStyle = "white";
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(x, y - (enemy.size) / 3.5 / z + Math.sin(Date.now() / 1000) * (enemy.size) / 15 / z, (enemy.size * 0.25) / z, 0, Math.PI * 2);
                    ctx.fillStyle = "black";
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x + (enemy.size) / 13 / z, y - (enemy.size) / 3 / z + Math.sin(Date.now() / 1000) * (enemy.size) / 15 / z, (enemy.size * 0.075) / z, 0, Math.PI * 2);
                    ctx.fillStyle = "white";
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(x, y + (enemy.size) / 2.25 / z, (enemy.size * 0.5) / z, (enemy.size * (0.15 + 0.15 * enemy.shootTick / enemy.targetTick)) / z, 0, 0, Math.PI * 2);
                    ctx.fillStyle = "pink";
                    ctx.fill();
                    ctx.stroke();
                    ctx.lineWidth = 2 / z;
                    ctx.beginPath();
                    ctx.ellipse(x, y + (enemy.size) / 1.9 / z, (enemy.size * (0.2 - 0.05 * enemy.shootTick / enemy.targetTick)) / z, (enemy.size * (0.05 + 0.1 * enemy.shootTick / enemy.targetTick)) / z, 0, 0, Math.PI * 2);
                    ctx.fillStyle = `rgb(200, ${75 + 25 * enemy.shootTick / enemy.targetTick}, ${75 - 75 * enemy.shootTick / enemy.targetTick})`;
                    ctx.fill();
                    ctx.stroke();
                    for (let i = -2; i < 2; i++) {
                        let offset = i * ((enemy.size) / 8 / z);
                        ctx.beginPath();
                        ctx.moveTo(x + offset, y + (enemy.size) / 3.25 / z - enemy.size * 0.125 * enemy.shootTick / enemy.targetTick / z, (enemy.size * 0.2) / z, (enemy.size * 0.05) / z, 0, 0, Math.PI * 2);
                        ctx.lineTo(x + offset + (enemy.size) / 8 / z, y + (enemy.size) / 3.25 / z - enemy.size * 0.125 * enemy.shootTick / enemy.targetTick / z, (enemy.size * 0.2) / z, (enemy.size * 0.05) / z, 0, 0, Math.PI * 2);
                        ctx.lineTo(x + offset + (enemy.size) / 16 / z, y + (enemy.size) / 3.25 / z + (enemy.size) / 6 / z - enemy.size * 0.125 * enemy.shootTick / enemy.targetTick / z, (enemy.size * 0.2) / z, (enemy.size * 0.05) / z, 0, 0, Math.PI * 2);
                        ctx.lineTo(x + offset, y + (enemy.size) / 3.25 / z - enemy.size * 0.125 * enemy.shootTick / enemy.targetTick / z, (enemy.size * 0.2) / z, (enemy.size * 0.05) / z, 0, 0, Math.PI * 2);
                        ctx.fillStyle = "white";
                        ctx.fill();
                        ctx.stroke();
                    }
                    if (enemy.health > 1) {
                        ctx.beginPath();
                        ctx.lineWidth = 4 / z;
                        ctx.moveTo(x - (enemy.size) / 2 / z, y - (enemy.size) / 1.15 / z);
                        ctx.lineTo(x - (enemy.size) / 0.9 / z, y - (enemy.size) / 0.8 / z);
                        ctx.lineTo(x - (enemy.size) / 1.1 / z, y - (enemy.size) / 2.45 / z);
                        ctx.lineTo(x - (enemy.size) / 2 / z, y - (enemy.size) / 1.15 / z);
                        ctx.fillStyle = "rgb(150, 150, 50)";
                        ctx.stroke();
                        ctx.fill();
                    }
                    if (enemy.health > 2) {
                        ctx.beginPath();
                        ctx.lineWidth = 4 / z;
                        ctx.moveTo(x + (enemy.size) / 2 / z, y - (enemy.size) / 1.15 / z);
                        ctx.lineTo(x + (enemy.size) / 0.9 / z, y - (enemy.size) / 0.8 / z);
                        ctx.lineTo(x + (enemy.size) / 1.1 / z, y - (enemy.size) / 2.45 / z);
                        ctx.lineTo(x + (enemy.size) / 2 / z, y - (enemy.size) / 1.15 / z);
                        ctx.fillStyle = "rgb(150, 150, 50)";
                        ctx.stroke();
                        ctx.fill();
                    }
                    ctx.globalAlpha = 0.33;
                    ctx.fillStyle = "black";
                    ctx.beginPath();
                    ctx.ellipse(x, canvas.height / 2 + player.z * (canvas.height / z) + 0.5 * (canvas.height / z), enemy.size / z, (enemy.size * 0.2) / z, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            }
            if (enemy.health < 1) {
                enemies.splice(enemies.indexOf(enemy), 1);
            }
        }
    })
    let bob = 500;
    let mag = 1;
    if (playerMagnitude > 0.2) {
        bob = 100;
        mag = 2;
    }
    let weaponPosition = { x: canvas.width * 0.8 - gunTransform * 500, y: canvas.height * 0.8 + 5 * mag * Math.sin(Date.now() / bob) - gunTransform * (400) };
    gunTransform += (targetGunTransform - gunTransform) / 5;
    if (Math.abs(gunTransform - targetGunTransform) < 0.1 && targetGunTransform !== 0) {
        bullets.push({
            x: player.x + 1 * Math.cos(player.direction),
            y: player.y + 1 * Math.sin(player.direction),
            z: -player.z,
            xVel: 0.25 * Math.cos(player.direction),
            yVel: 0.25 * Math.sin(player.direction),
            color: [0, 255, 255],
            bounced: 0,
            side: "player"
        });
        for (let i = 0; i < 10 + Math.floor(Math.random() * 10); i++) {
            particles.push({
                x: player.x + 0.1 * (Math.random() - 0.5) + 0.5 * Math.cos(player.direction),
                y: player.y + 0.1 * (Math.random() - 0.5) + 0.5 * Math.sin(player.direction),
                size: 2 + Math.random() * 3,
                invariant: true,
                noGrav: true,
                decayRate: 0.8,
                color: `rgb(${150 + 100 * Math.random()}, ${100 + 100 * Math.random()}, ${50 * Math.random()})`,
                z: -player.z + Math.random() * 0.1 - 0.05,
                xVel: 0.025 * (Math.random() - 0.5),
                yVel: 0.025 * (Math.random() - 0.5),
                zVel: 0.025 * (Math.random() - 0.5),
            })
        }
        targetGunTransform = 0;
    }
    ctx.save();
    ctx.translate(weaponPosition.x - gunTransform, weaponPosition.y - gunTransform);
    ctx.rotate(0.025 * mag * Math.sin(Date.now() / bob));
    ctx.scale(0.75 - gunTransform, 0.8 - gunTransform);
    ctx.fillStyle = "grey";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(10, -5);
    ctx.lineTo(10, 45);
    ctx.lineTo(0, 50);
    ctx.fill();
    ctx.fillStyle = "darkgrey";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-12, -8);
    ctx.lineTo(-12, 45);
    ctx.lineTo(0, 50);
    ctx.fill();
    ctx.fillStyle = "rgb(100, 100, 100)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-60, -37);
    ctx.lineTo(-60, -52);
    ctx.lineTo(0, -15);
    ctx.fill();
    ctx.fillStyle = "rgb(75, 75, 75)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(10, -5);
    ctx.lineTo(10, -20);
    ctx.lineTo(0, -15);
    ctx.fill();
    ctx.fillStyle = "rgb(125, 125, 125)";
    ctx.beginPath();
    ctx.moveTo(10, -20);
    ctx.lineTo(0, -15);
    ctx.lineTo(-60, -52);
    ctx.lineTo(-50, -57);
    ctx.fill();
    ctx.fillStyle = "rgb(150, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(-12, -7);
    ctx.lineTo(-24, -14);
    ctx.lineTo(-24, -3);
    ctx.lineTo(-12, 4);
    ctx.fill();
    ctx.restore();
    stats.begin();
    requestAnimationFrame(main);
}
requestAnimationFrame(main);
document.onkeydown = (e) => {
    keys[e.key] = true;
}
document.onkeyup = (e) => {
    keys[e.key] = false;
}
document.onclick = () => {
    if (targetGunTransform === 0 && gunTransform < 0.05) {
        targetGunTransform = 0.25;
    }
    canvas.requestPointerLock();
}
document.onmousemove = (e) => {
    if (document.pointerLockElement) {
        player.direction += e.movementX * 0.003;
    }
}
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);