/**
 *  对 canvas api的一部分扩展 
 */

var C = {
    drawGrid: function (context, color, stepX, stepY) {
        var ctx = context,
            w = ctx.canvas.width,
            h = ctx.canvas.height;
        color = color || 'rgba(0, 0, 0, .7)',
            stepX = stepX || 10,
            stepY = stepY || 10;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        for (var r = stepY + 0.5; r < h; r += stepY) {
            ctx.beginPath();
            ctx.moveTo(0, r);
            ctx.lineTo(w, r);
            ctx.closePath();
            ctx.stroke();
        }
        for (var c = stepX + 0.5; c < w; c += stepX) {
            ctx.beginPath();
            ctx.moveTo(c, 0);
            ctx.lineTo(c, h);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();
    },

    /**
     * 矩形
     * @param {*} context                   canvas 上下文对象
     * @param {*} x                         起始x坐标
     * @param {*} y                         起始y坐标
     * @param {*} width                     矩形的宽度
     * @param {*} height                    矩形的高度
     * @param {boolean} [counterclockwise]  画图的方向，默认逆时针
     */
    drawRect: function (context, x, y, width, height, counterclockwise = true) {
        var ctx = context;
        ctx.moveTo(x, y);
        if (counterclockwise) {
            ctx.lineTo(x, y + height);
            ctx.lineTo(x + width, y + height);
            ctx.lineTo(x + width, y);
        } else {
            ctx.lineTo(x + width, y);
            ctx.lineTo(x + width, y + height);
            ctx.lineTo(x, y + height);
        }
        ctx.closePath();
    },

    /**
     * 圆角矩形
     * @param {*} context                   canvas 上下文对象
     * @param {*} x                         起始x坐标
     * @param {*} y                         起始y坐标
     * @param {*} r                         圆角半径
     * @param {*} width                     矩形的宽度
     * @param {*} height                    矩形的高度
     * @param {boolean} [counterclockwise]  画图的方向，默认逆时针
     */
    drawRoundRect: function (context, x, y, r, width, height, counterclockwise = true) {
        var ctx = context;
        if (counterclockwise) {
            ctx.moveTo(x, y + r);
            ctx.arcTo(x, y + height, x + width, y + height, r);
            ctx.arcTo(x + width, y + height, x + width, y, r);
            ctx.arcTo(x + width, y, x, y, r);
            ctx.arcTo(x, y, x, y + height, r);
        } else {
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + width, y, x + width, y + height, r);
            ctx.arcTo(x + width, y + height, x, y + height, r);
            ctx.arcTo(x, y + height, x, y, r);
            ctx.arcTo(x, y, x + width, y, r);
        }
    },

    /**
     * 多边形
     * @param {*} context                   canvas 上下文对象 
     * @param {*} x                         中心点x坐标
     * @param {*} y                         中心点y坐标
     * @param {*} r                         外接圆半径
     * @param {*} sides                     边的数量
     * @param {*} angle                     起始角度
     * @param {boolean} [counterclockwise]  画图的方向，默认逆时针
     */
    drawPolygon: function (context, x, y, r, sides, angle = 0, counterclockwise = true) {
        var ctx = context;
        var radian = angle * Math.PI / 180;
        ctx.moveTo(
            x + r * Math.cos(radian),
            y + r * Math.sin(radian)
        );
        if(!counterclockwise) {
            angle = 2 * Math.PI;
        }
        for (var i = 0; i <= sides; i++) {
            if(counterclockwise) {
                radian += (2 * Math.PI / sides);
            } else {
                radian -= (2 * Math.PI / sides);
            }
            ctx.lineTo(
                x + r * Math.cos(radian),
                y + r * Math.sin(radian)
            );
        }
    }

}