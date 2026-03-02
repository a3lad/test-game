import p5 from 'p5';

export const drawWinScreen = (p: p5, score: number, onRestart: () => void, mouseJustPressed: boolean) => {
  p.background(232, 252, 232); // Soft green
  
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(40, 80, 40);
  p.textSize(64);
  p.text("SUCCESS!", p.width / 2, p.height / 3);
  
  p.textSize(28);
  p.fill(60, 100, 60);
  p.text(`You managed to communicate clearly.`, p.width / 2, p.height / 2);
  
  // Restart Button
  const btnW = 260;
  const btnH = 70;
  const btnX = p.width / 2 - btnW / 2;
  const btnY = p.height * 0.75;
  
  const isHover = p.mouseX > btnX && p.mouseX < btnX + btnW && p.mouseY > btnY && p.mouseY < btnY + btnH;
  
  p.stroke(40, 80, 40);
  p.strokeWeight(3);
  p.fill(isHover ? [210, 240, 210] : [230, 255, 230]);
  
  p.beginShape();
  p.vertex(btnX + 20, btnY);
  (p as any).bezierVertex(btnX + btnW/2, btnY - 5, btnX + btnW - 20, btnY, btnX + btnW, btnY + 20);
  (p as any).bezierVertex(btnX + btnW + 5, btnY + btnH/2, btnX + btnW, btnY + btnH - 20, btnX + btnW - 20, btnY + btnH);
  (p as any).bezierVertex(btnX + btnW/2, btnY + btnH + 5, btnX + 20, btnY + btnH, btnX, btnY + btnH - 20);
  (p as any).bezierVertex(btnX - 5, btnY + btnH/2, btnX, btnY + 20, btnX + 20, btnY);
  p.endShape(p.CLOSE);
  
  p.fill(40, 80, 40);
  p.noStroke();
  p.textSize(32);
  p.text("PLAY AGAIN", p.width / 2, btnY + btnH / 2);
  
  if (isHover && mouseJustPressed) {
    onRestart();
  }
};
