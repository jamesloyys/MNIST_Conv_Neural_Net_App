/* global $ */
class Main {
    constructor() {
        var CANVAS_SIZE = 200;
        this.canvas = document.getElementById('main');
        this.canvas.width  = CANVAS_SIZE;
        this.canvas.height = CANVAS_SIZE;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup',   this.onMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.initialize();
    }
    initialize() {
        var CANVAS_SIZE = 200;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        this.ctx.lineWidth = 0.05;
        $('#output td').text('').removeClass('success');
    }
    onMouseDown(e) {
        this.canvas.style.cursor = 'default';
        this.drawing = true;
        this.prev = this.getPosition(e.clientX, e.clientY);
    }
    onMouseUp() {
        this.drawing = false;
        this.drawInput();
    }
    onMouseMove(e) {
        if (this.drawing) {
            var curr = this.getPosition(e.clientX, e.clientY);
            this.ctx.lineWidth = 15;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(this.prev.x, this.prev.y);
            this.ctx.lineTo(curr.x, curr.y);
            this.ctx.stroke();
            this.ctx.closePath();
            this.prev = curr;
        }
    }
    getPosition(clientX, clientY) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    drawInput() {
            var inputs = this.canvas.toDataURL();
            $.ajax({
                url: '/mnist',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(inputs),
                success: (data) => {
                    console.log(data.results[1]);
                    $('#prediction').html("I'm guessing you drew a " + data.results[0]);

                    for (let i = 0; i < 10; i++) {
                        $('#' + i + '_bar_main').show();
                        $('#' + i + '_bar').show();
                        $('#' + i + '_bar').css("width", data.results[1][i]*100 + "%");
                        $('#' + i + '_bar_span').html(Math.round(data.results[1][i]*100) + "%");
                        $('#' + i + '_bar_label').html(i);

                        if (i.toString()==data.results[0]){
                            $('#' + i + '_bar').css("background-color", "#ef4d56");
                        } else {
                            $('#' + i + '_bar').css("background-color", "#c1c1c1");
                            $('#' + i + '_bar_span').css("color", "#000000");
                        }
                    }
                }
            });
        };
    }

$(() => {
    var main = new Main();
});
