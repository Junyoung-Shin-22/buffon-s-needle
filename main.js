const D = 200;
L = 0;

GLOBAL_NUM_DROP = 0;
GLOBAL_NEEDLES_DROPPED = 0;
GLOBAL_NEEDLES_HIT = 0;

function draw_line(ctx, p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
}

function draw_base_line(ctx) {
    ctx.lineWidth = 3;
    draw_line(ctx, [0, canvas.height/2], [canvas.width, canvas.height/2]);
}

function draw_needle(ctx, p1, p2) {
    ctx.lineWidth = 1;
    draw_line(ctx, p1, p2);
}

function reset_canvas(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw_base_line(ctx);
}

function reset_all() {
    GLOBAL_NEEDLES_DROPPED = 0;
    GLOBAL_NEEDLES_HIT = 0;

    num_drop.value = 10;
    slider.value = 100;

    update();
    reset_canvas(ctx);
    slider.disabled = false;
}

function update() {
    p = 2 * GLOBAL_NEEDLES_DROPPED/GLOBAL_NEEDLES_HIT * L/D;
    e = Math.abs(Math.PI-p)/Math.PI * 100;

    L = slider.value / 100 * D
    
    pi_approx.textContent = 'approx. value of π ≈ 2n/r * l/d = ' + p.toFixed(8) + ' (relative error of ' + e.toFixed(3) + '%)';
    needles_dropped.textContent = '# of needles dropped: n = ' + GLOBAL_NEEDLES_DROPPED;
    needles_hit.textContent = '# of needles lied across the line: r = ' + GLOBAL_NEEDLES_HIT;

    length.textContent = 'needle length / strip width: l/d =' + (slider.value / 100).toFixed(2);
}

function drop_needle(ctx) {
    x = ctx.canvas.width * Math.random();
    y = ctx.canvas.height * Math.random();
    theta = 2 * Math.PI * Math.random();

    dx = L * Math.cos(theta);
    dy = L * Math.sin(theta);

    x1 = x + dx; x2 = x - dx;
    y1 = y + dy; y2 = y - dy;

    GLOBAL_NEEDLES_DROPPED++;
    if ((D - y1) * (D - y2) < 0) {
        GLOBAL_NEEDLES_HIT++;
    }
    update();
    draw_needle(ctx, [x+dx, y+dy], [x-dx, y-dy]);
}

canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = D * 2;

ctx = canvas.getContext('2d');

pi_real = document.getElementById('pi_real');
pi_real.textContent = 'real value of π = ' + Math.PI + '...';

pi_approx = document.getElementById('pi_approx');
needles_dropped = document.getElementById('needles_dropped');
needles_hit = document.getElementById('needles_hit');

num_drop = document.getElementById('num_drop');

start = document.getElementById('start');
start.onclick = () => {
    slider.disabled = true;
    GLOBAL_NUM_DROP = parseInt(num_drop.value);

    if (isNaN(GLOBAL_NUM_DROP) || GLOBAL_NUM_DROP < 0 || GLOBAL_NUM_DROP > 1e5) {
        alert('Please enter a valid natural number. (1 <= n <= 100,000)');
        return;
    }

    for (i=0; i<GLOBAL_NUM_DROP; i++) {
        drop_needle(ctx);
    }
};

reset = document.getElementById('reset');
reset.onclick = () => {reset_all();};

length = document.getElementById('length');

slider = document.getElementById('slider');
slider.oninput = update;
reset_all();