import p5 from 'p5';
import { GameState } from './types';

export const drawStartScreen = (p: p5, onStart: () => void, mouseJustPressed: boolean) => {
  p.background(252, 248, 232); // Warm cream
  
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(80, 60, 40);
  p.textSize(72);
  p.text("FRAGMENTED MIND", p.width / 2, p.height / 3);
  
  p.textSize(24);
  p.fill(100, 80, 60);
  p.text("Social interactions are hard when your thoughts won't stay still.", p.width / 2, p.height / 2 - 20);
  p.text("Assemble the correct response before the words vanish.", p.width / 2, p.height / 2 + 15);
  p.text("Click intrusive thoughts to clear them.", p.width / 2, p.height / 2 + 50);

  // Start Button
  const btnW = 260;
  const btnH = 70;
  const btnX = p.width / 2 - btnW / 2;
  const btnY = p.height * 0.75;
  
  const isHover = p.mouseX > btnX && p.mouseX < btnX + btnW && p.mouseY > btnY && p.mouseY < btnY + btnH;
  
  // Organic button shape
  p.stroke(80, 60, 40);
  p.strokeWeight(3);
  p.fill(isHover ? [240, 220, 180] : [255, 240, 210]);
  
  p.beginShape();
  p.vertex(btnX + 20, btnY);
  (p as any).bezierVertex(btnX + btnW/2, btnY - 5, btnX + btnW - 20, btnY, btnX + btnW, btnY + 20);
  (p as any).bezierVertex(btnX + btnW + 5, btnY + btnH/2, btnX + btnW, btnY + btnH - 20, btnX + btnW - 20, btnY + btnH);
  (p as any).bezierVertex(btnX + btnW/2, btnY + btnH + 5, btnX + 20, btnY + btnH, btnX, btnY + btnH - 20);
  (p as any).bezierVertex(btnX - 5, btnY + btnH/2, btnX, btnY + 20, btnX + 20, btnY);
  p.endShape(p.CLOSE);
  
  p.fill(80, 60, 40);
  p.noStroke();
  p.textSize(32);
  p.text("BEGIN", p.width / 2, btnY + btnH / 2);
  
  if (isHover && mouseJustPressed) {
    onStart();
  }
};
