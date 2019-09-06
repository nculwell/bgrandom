// The MIT License (MIT)
// 
// Copyright (c) 2019 Nathan Culwell-Kanarek
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

"use strict";

function randomize(items, count) {
  var itemCount = items.length;
  if (count == undefined) {
    count = itemCount;
  } else if (count < 0) {
    throw "count < 0";
  } else if (count > itemCount) {
    throw "count (" + count + ") > items (" + itemCount + ")";
  }
  // Copy items to source.
  var choices = [];
  for (var i=0; i < itemCount; ++i) {
    choices[i] = items[i];
  }
  // Pick items.
  var choices = [];
  for (var i=0; i < count; ++i) {
    var choice = i + randomInt(count - i);
    if (i != choice) {
      var tmp = choices[i];
      choices[i] = choices[choice];
      choices[choice] = tmp;
    }
  }
  if (count < itemCount) {
    choices.splice(count, itemCount - count);
  }
  return choices;
}

function randomInt(limit) {
  return Math.floor(Math.random() * limit);
}

function draw(ctx, items, slots) {
  var slotCount = slots.length;
  for (var i=0; i < slotCount; ++i) {
    var item = items[i];
    var slot = slots[i];
    ctx.putImageData(item.imageData, slot.x, slot.y);
  }
}

function doit(canvasId, template) {
  var canvas = document.getElementById(canvasId);
  var ctx = canvas.getContext("2d");
  var scale = {
    x: template.background.width / canvas.width,
    y: template.background.height, canvas.height };
  ctx.scale(scale.x, scale.y);
  if (template.bg.type == "color") {
    ctx.fillStyle = template.bg.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (template.bg.type == "image") {
    // TODO: Load image data on template init
    ctx.putImageData(template.bg.imageData);
  }
  var randomizedItems = randomize(template.items, template.slots.length);
  draw(ctx, randomizedItems, template.slots);
}

function createTemplateFromGrid(grid, items) {
  var slots = [];
  var itemW = items[0].imageData.width;
  var itemH = items[0].imageData.height;
  for (var y=0; y < grid.length; ++y) {
    var slotY = 0;
    for (var x=0; x < grid[y].length; ++x) {
      if (grid[y][x] == 1) {
        slots.push({ x: slotX, y: slotY });
      }
      slotX += itemW;
    }
    slotY += itemH;
  }
  var template = {
    slots: slots,
    items: items,
    bg: { type: "color", value: "blue" }
  };
  return template;
}

