// This is a Node.js script that can generate a proper favicon.ico file
// using canvas and the favicon image data
// To use this script, you would need to install the following packages:
// npm install canvas jimp to-ico

// Usage: 
// 1. Save this file as createFavicon.js
// 2. Run 'node createFavicon.js' from the terminal
// 3. The script will generate a favicon.ico file in the public directory

const fs = require('fs');
const { createCanvas } = require('canvas');
const toIco = require('to-ico');

const sizes = [16, 32, 48, 64];

async function createFavicon() {
  const iconBuffers = [];

  for (const size of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, size, size);
    
    // Calculate scaled dimensions
    const scale = size / 300;
    const controllerWidth = 180 * scale;
    const controllerHeight = 100 * scale;
    const controllerX = (size - controllerWidth) / 2;
    const controllerY = (size - controllerHeight) / 2;
    
    // Draw controller body
    ctx.fillStyle = '#9966FF';
    ctx.beginPath();
    // Left side with rounded corner
    ctx.moveTo(controllerX, controllerY + controllerHeight / 2);
    ctx.quadraticCurveTo(
      controllerX, controllerY, 
      controllerX + controllerWidth / 2, controllerY
    );
    // Right side with rounded corner
    ctx.lineTo(controllerX + controllerWidth / 2, controllerY);
    ctx.quadraticCurveTo(
      controllerX + controllerWidth, controllerY,
      controllerX + controllerWidth, controllerY + controllerHeight / 2
    );
    // Bottom right with rounded corner
    ctx.lineTo(controllerX + controllerWidth, controllerY + controllerHeight / 2);
    ctx.quadraticCurveTo(
      controllerX + controllerWidth, controllerY + controllerHeight,
      controllerX + controllerWidth / 2, controllerY + controllerHeight
    );
    // Bottom left with rounded corner
    ctx.lineTo(controllerX + controllerWidth / 2, controllerY + controllerHeight);
    ctx.quadraticCurveTo(
      controllerX, controllerY + controllerHeight,
      controllerX, controllerY + controllerHeight / 2
    );
    ctx.closePath();
    ctx.fill();
    
    // D-pad
    const dpadSize = 30 * scale;
    const dpadX = controllerX + controllerWidth * 0.25;
    const dpadY = controllerY + controllerHeight * 0.5;
    
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(dpadX - dpadSize/2, dpadY, dpadSize, dpadSize/3);
    ctx.fillRect(dpadX, dpadY - dpadSize/2, dpadSize/3, dpadSize);
    
    // Buttons
    const buttonSize = 10 * scale;
    const button1X = controllerX + controllerWidth * 0.7;
    const button1Y = controllerY + controllerHeight * 0.4;
    const button2X = controllerX + controllerWidth * 0.8; 
    const button2Y = controllerY + controllerHeight * 0.6;
    
    ctx.beginPath();
    ctx.arc(button1X, button1Y, buttonSize, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(button2X, button2Y, buttonSize, 0, Math.PI * 2);
    ctx.fill();
    
    iconBuffers.push(canvas.toBuffer());
  }
  
  const icoBuffer = await toIco(iconBuffers);
  fs.writeFileSync('./public/favicon.ico', icoBuffer);
  console.log('favicon.ico created successfully!');
}

createFavicon().catch(console.error); 