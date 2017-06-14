/**
 * @fildesc As in a free fall horizontal velocity remains constant. Floor has the hight coefficient of restitution but less than one which means that maximum height will decrease over time. Collision with vertical walls is considered as fully elastic collision. Appropriate acceleration has been chosen for the model.
 */
"use strict";
/**
 * @classdesc Represents points and vectors and also provides functionality to add them toghether.
 */
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.add = function (vec1, vec2) {
        return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
    };
    Vector.subtract = function (vec1, vec2) {
        return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
    };
    Vector.dotProduct = function (vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    };
    Vector.distance = function (vec1, vec2) {
        return Math.hypot(vec1.x - vec2.x, vec1.y - vec2.y);
    };
    return Vector;
}());
/**
 * @classdesc Only this class should be modified to set any parameters.
 */
var Config = (function () {
    function Config() {
    }
    Object.defineProperty(Config, "numberOfEmojis", {
        get: function () {
            var emojiArea = Math.pow(this.size, 2);
            var canvasArea = innerWidth * innerHeight;
            return Math.floor(canvasArea / emojiArea) / 5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "emoji", {
        get: function () {
            return this.emojis[Math.floor(Math.random() * this.emojis.length)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "position", {
        get: function () {
            return new Vector((window.innerWidth - 2 * Config.size) * Math.random() + Config.size, (window.innerHeight - 2 * Config.size) * Math.random() + Config.size);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "velocity", {
        get: function () {
            return new Vector(Math.random() * 5 - 2.5, Math.random() * 5 - 2.5);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "emojis", {
        get: function () {
            return [
                '😀', '😂', '😇', '😍', '😘',
                '😛', '🤑', '🤗', '🤓', '😎',
                '😤', '😡', '😵', '😳', '😨',
                '😴', '🤔', '🤥', '😬', '🤐',
                '🤢', '🤧', '😷', '🤒', '🤕'
            ];
            // return ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '😘', '😗', '😙', '😚', '😋', '😜', '😝', '😛', '🤑', '🤗', '🤓', '😎', '🤡', '🤠', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '😤', '😠', '😡', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '😵', '😳', '😱', '😨', '😰', '😢', '😥', '🤤', '😭', '😓', '😪', '😴', '🙄', '🤔', '🤥', '😬', '🤐', '🤢', '🤧', '😷', '🤒', '🤕'];
        },
        enumerable: true,
        configurable: true
    });
    return Config;
}());
Config.size = 25;
/**
 * @classdesc Each emoji is an independend particle obeying physics law namely gravitational force and inelastic collitions with the ground.
 */
var Emoji = (function () {
    function Emoji(position, velocity, emoji, size) {
        if (position === void 0) { position = Config.position; }
        if (velocity === void 0) { velocity = Config.velocity; }
        if (emoji === void 0) { emoji = Config.emoji; }
        if (size === void 0) { size = Config.size; }
        // Choosing random initial position for emoji.
        this.position = position;
        // Initialising with random emoji.
        this.emoji = emoji;
        // Setting size.
        this.size = size;
        // Setting horizontal velocity between -1, 1 and vertical velocity to be 0.
        this.velocity = velocity;
    }
    Emoji.prototype.move = function () {
        // Updating position.
        this.position = Vector.add(this.position, this.velocity);
        // Collision with vertical walls.
        if (this.position.x - this.size / 2 < 0 && this.velocity.x < 0
            ||
                this.position.x + this.size / 2 > window.innerWidth && this.velocity.x > 0) {
            this.velocity.x = -this.velocity.x;
        }
        // Collision with horizontal walls.
        if (this.position.y - this.size / 2 < 0 && this.velocity.y < 0
            ||
                this.position.y + this.size / 2 > window.innerHeight && this.velocity.y > 0) {
            this.velocity.y = -this.velocity.y;
        }
    };
    Object.defineProperty(Emoji.prototype, "radius", {
        get: function () {
            var radiusToSizeRatio = 0.46;
            return this.size * radiusToSizeRatio;
        },
        enumerable: true,
        configurable: true
    });
    Emoji.prototype.draw = function (ctx) {
        var xToSizeRatio = 0.5;
        var yToSizeRatio = 0.425;
        ctx.font = this.size + 'px Verdana';
        // ctx.beginPath();
        // ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        // ctx.stroke();
        ctx.fillText(this.emoji, this.position.x - this.size * xToSizeRatio, this.position.y + this.size * yToSizeRatio);
    };
    return Emoji;
}());
/**
 * @classdesc Main class reponsible for running the experiment.
 */
var GravitatingEmojis = (function () {
    function GravitatingEmojis() {
        // Creating a canvas.
        this.canvas = document.createElement('canvas');
        // Setting the canvas size.
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Appending the canvas to body
        document.body.appendChild(this.canvas);
        // Getting context with alpha channel.
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        // Initialisation of emojis.
        this.emojis = Array.from({ length: Config.numberOfEmojis }, function () { return new Emoji(); });
        // Handling resize event.
        addEventListener('resize', this.resize.bind(this));
        // Handling click/reset event.
        addEventListener('click', this.click.bind(this));
        // Requesting animation frame.
        requestAnimationFrame(this.animationFrame.bind(this));
    }
    GravitatingEmojis.prototype.animationFrame = function () {
        // Clearing canvas.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Iterating through each emoji.
        for (var i = 0; i < this.emojis.length; i++) {
            var emoji1 = this.emojis[i];
            emoji1.move();
            emoji1.draw(this.ctx);
            for (var j = i + 1; j < this.emojis.length; j++) {
                var emoji2 = this.emojis[j];
                if (this.areColiding(emoji1, emoji2)) {
                    if (this.areSimilar(emoji1, emoji2)) {
                        this.resolveMerge(emoji1, emoji2);
                    }
                    else {
                        this.resolveCollision(emoji1, emoji2);
                    }
                }
            }
        }
        // Getting next frame.
        requestAnimationFrame(this.animationFrame.bind(this));
    };
    GravitatingEmojis.prototype.areColiding = function (emoji1, emoji2) {
        return Vector.distance(emoji1.position, emoji2.position) < emoji1.radius + emoji2.radius;
    };
    GravitatingEmojis.prototype.areSimilar = function (emoji1, emoji2) {
        return emoji1.emoji === emoji2.emoji;
    };
    GravitatingEmojis.prototype.resolveMerge = function (emoji1, emoji2) {
        // Remove both identical emojis.
        this.emojis.splice(this.emojis.indexOf(emoji1), 1);
        this.emojis.splice(this.emojis.indexOf(emoji2), 1);
        // Create new emoji.
        var position = new Vector((emoji1.position.x + emoji2.position.x) / 2, (emoji1.position.y + emoji2.position.y) / 2);
        // Weighted resultant velocity.
        var velocity = new Vector((emoji1.velocity.x * emoji1.radius + emoji2.velocity.x * emoji2.radius) / (emoji1.radius + emoji2.radius), (emoji1.velocity.y * emoji1.radius + emoji2.velocity.y * emoji2.radius) / (emoji1.radius + emoji2.radius));
        var emoji = emoji1.emoji;
        var size = Math.max(emoji1.size, emoji2.size) + Math.min(emoji1.size, emoji2.size) / 2;
        this.emojis.unshift(new Emoji(position, velocity, emoji, size));
    };
    GravitatingEmojis.prototype.resolveCollision = function (emoji1, emoji2) {
        var velocity = Vector.subtract(emoji2.velocity, emoji1.velocity);
        var displacement = Vector.subtract(emoji2.position, emoji1.position);
        var dotProduct = Vector.dotProduct(velocity, displacement);
        if (dotProduct > 0) {
            return;
        }
        // Direction change.
        var radiusSum = emoji1.radius + emoji2.radius;
        var directionX1 = (emoji1.velocity.x * (emoji1.radius - emoji2.radius) + (2 * emoji2.radius * emoji2.velocity.x)) / radiusSum;
        var directionY1 = (emoji1.velocity.y * (emoji1.radius - emoji2.radius) + (2 * emoji2.radius * emoji2.velocity.y)) / radiusSum;
        var directionX2 = (emoji2.velocity.x * (emoji2.radius - emoji1.radius) + (2 * emoji1.radius * emoji1.velocity.x)) / radiusSum;
        var directionY2 = (emoji2.velocity.y * (emoji2.radius - emoji1.radius) + (2 * emoji1.radius * emoji1.velocity.y)) / radiusSum;
        emoji1.velocity = new Vector(directionX1, directionY1);
        emoji2.velocity = new Vector(directionX2, directionY2);
    };
    GravitatingEmojis.prototype.resize = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    GravitatingEmojis.prototype.click = function () {
        this.emojis = Array.from({ length: Config.numberOfEmojis }, function () { return new Emoji(); });
    };
    return GravitatingEmojis;
}());

// Initialisation
new GravitatingEmojis();