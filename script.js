document.addEventListener('DOMContentLoaded', ()=>{

    const controller = document.getElementById("controller")
    const ctx = controller.getContext("2d")
    controller.width = window.innerWidth;
    controller.height = window.innerHeight;
    ctx.lineWidth = 1;

    const pen = {
        start: null,
        end: {x:0, y:0},
        active: false,
        moving: false
    }

    const drawLine = (line) => {
        ctx.beginPath();
        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);
        ctx.stroke();
    }

    controller.onmousemove = (e) => {
        console.log(e.clientX, e.clientY)
        pen.end.x = e.clientX
        pen.end.y = e.clientY
        pen.moving = true
    }

    controller.onmousedown = () => {pen.active = true};
    controller.onmouseup = ()=> {pen.active = false};

    const drawing = () => {
        if (pen.active && pen.moving && pen.start){
           drawLine({end: pen.end, start: pen.start})
           pen.moving = false
        }
        pen.start = {x: pen.end.x, y: pen.end.y}
        window.requestAnimationFrame(drawing);
    }

    drawing()
})
