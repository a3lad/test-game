import p5 from 'p5';
import { WordFragment, Level, LEVELS } from './types';

let fragments: WordFragment[] = [];
let currentLevelIndex = 0;
let assembledSentence: string[] = [];
let timer = 0;
let lastTime = 0;
let nextInterruptionTime = 0;
let stressLevel = 0; // 0 to 100
let shakeAmount = 0;

export const setBackgrounds = (_images: { [key: string]: p5.Image }) => {
    // No-op, images removed
};

const INTRUSIVE_THOUGHTS = [
    "Did I lock the door?",
    "I'm standing weird.",
    "Is my hair okay?",
    "What if they judge my order?",
    "I forgot that email.",
    "Why is it so loud in here?",
    "They're looking at me.",
    "I should have stayed home."
];

export const initGame = (p: p5, levelIndex: number) => {
    currentLevelIndex = levelIndex;
    const level = LEVELS[currentLevelIndex];
    timer = level.timeLimit;
    lastTime = p.millis();
    assembledSentence = [];
    fragments = [];
    stressLevel = 0;
    shakeAmount = 0;
    nextInterruptionTime = p.millis() + p.random(2000, 4000);

    // Create target fragments
    level.targetSentence.forEach((word) => {
        fragments.push(createFragment(p, word, true));
    });

    // Create some noise fragments
    const noiseWords = ["coffee", "bean", "cup", "sugar", "milk", "water", "tea", "hot", "cold"];
    for (let i = 0; i < 5; i++) {
        fragments.push(createFragment(p, p.random(noiseWords), false));
    }
};

const createFragment = (p: p5, text: string, isTarget: boolean, isInterruption: boolean = false): WordFragment => {
    return {
        id: Math.random().toString(36).substr(2, 9),
        text,
        x: p.random(100, p.width - 100),
        y: p.random(100, p.height - 200),
        vx: p.random(-1, 1),
        vy: p.random(-1, 1),
        opacity: 255,
        isTarget,
        isInterruption
    };
};

export const drawGameScreen = (p: p5, onWin: () => void, onLose: (reason: string) => void, mouseJustPressed: boolean) => {
    if (currentLevelIndex < 0 || currentLevelIndex >= LEVELS.length) return;
    const level = LEVELS[currentLevelIndex];
    if (!level) return;
    
    // Update Timer
    const now = p.millis();
    if (now - lastTime >= 1000) {
        timer--;
        lastTime = now;
    }

    if (timer <= 0) {
        onLose("Time ran out. You froze up.");
        return;
    }

    // Calculate Stress based on active interruptions
    const activeInterruptions = fragments.filter(f => f.isInterruption).length;
    const targetStress = p.map(activeInterruptions, 0, 5, 0, 100);
    stressLevel = p.lerp(stressLevel, targetStress, 0.05);
    
    if (stressLevel > 95) {
        onLose("Your thoughts became too loud to handle.");
        return;
    }

    // Screen Shake logic
    shakeAmount = p.map(stressLevel, 30, 100, 0, 8);
    shakeAmount = p.max(0, shakeAmount);
    
    const sx = p.random(-shakeAmount, shakeAmount);
    const sy = p.random(-shakeAmount, shakeAmount);

    // Random Interruptions - Faster when stressed
    const spawnRate = p.map(stressLevel, 0, 100, 4000, 1500);
    if (now > nextInterruptionTime) {
        fragments.push(createFragment(p, p.random(INTRUSIVE_THOUGHTS), false, true));
        nextInterruptionTime = now + p.random(spawnRate, spawnRate * 2);
    }

    // Draw Background (Warm, paper-like texture feel)
    p.push();
    p.translate(sx, sy);
    
    const currentLocation = level.location;
    p.background(252, 248, 232); // Warm cream
    
    // Draw "Counter" (Hand-drawn style with more detail)
    p.stroke(80, 60, 40);
    p.strokeWeight(3);
    p.fill(230, 210, 180);
    p.beginShape();
    p.vertex(0, p.height - 180);
    p.vertex(p.width, p.height - 200);
    p.vertex(p.width, p.height);
    p.vertex(0, p.height);
    p.endShape(p.CLOSE);
    
    // Counter wood grain lines
    p.stroke(180, 160, 130);
    p.strokeWeight(1);
    p.line(100, p.height - 150, 300, p.height - 160);
    p.line(500, p.height - 120, 750, p.height - 130);
    p.line(200, p.height - 50, 450, p.height - 60);

    // Draw UI
    p.fill(80, 60, 40);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(22);
    p.text(`Time: ${timer}s`, 30, 30);
    
    let locationName = "";
    switch(currentLocation) {
        case 'coffee': locationName = "The Daily Grind"; break;
        case 'grocery': locationName = "Fresh Market"; break;
        case 'bookstore': locationName = "The Paper Trail"; break;
        case 'flower': locationName = "Petal & Stem"; break;
    }
    p.text(`Location: ${locationName}`, 30, 60);

    // Draw NPC (Right side) - More "Good Pizza" style
    p.push();
    p.translate(p.width - 200, p.height - 350);
    
    // Body
    p.stroke(40);
    p.strokeWeight(2);
    
    let npcBodyColor: number[] = [120, 90, 70];
    switch(currentLocation) {
        case 'coffee': npcBodyColor = [120, 90, 70]; break;
        case 'grocery': npcBodyColor = [90, 120, 70]; break;
        case 'bookstore': npcBodyColor = [70, 90, 120]; break;
        case 'flower': npcBodyColor = [120, 70, 90]; break;
    }
    p.fill(npcBodyColor);
    p.ellipse(50, 150, 120, 180);
    
    // Head
    p.fill(245, 210, 180);
    p.ellipse(50, 50, 80, 90);
    
    // Hair (simple shape)
    p.fill(60, 40, 20);
    p.noStroke();
    p.arc(50, 45, 85, 95, p.PI, 0);
    
    // Blush
    p.fill(255, 150, 150, 100);
    p.ellipse(30, 60, 15, 10);
    p.ellipse(70, 60, 15, 10);
    
    // Eyes (simple dots)
    p.fill(40);
    p.ellipse(35, 50, 6, 6);
    p.ellipse(65, 50, 6, 6);
    
    // Smile
    p.noFill();
    p.stroke(40);
    p.strokeWeight(2);
    p.arc(50, 70, 30, 15, 0, p.PI);
    p.pop();
    
    // NPC Speech Bubble (More organic hand-drawn look)
    p.fill(255);
    p.stroke(80, 60, 40);
    p.strokeWeight(3);
    
    // Organic bubble shape
    p.beginShape();
    const bx = p.width - 380;
    const by = p.height - 470;
    const bw = 320;
    const bh = 100;
    p.vertex(bx + 20, by);
    (p as any).bezierVertex(bx + bw/2, by - 10, bx + bw - 20, by, bx + bw, by + 20);
    (p as any).bezierVertex(bx + bw + 10, by + bh/2, bx + bw, by + bh - 20, bx + bw - 20, by + bh);
    (p as any).bezierVertex(bx + bw/2, by + bh + 10, bx + 20, by + bh, bx, by + bh - 20);
    (p as any).bezierVertex(bx - 10, by + bh/2, bx, by + 20, bx + 20, by);
    p.endShape(p.CLOSE);
    
    // Bubble tail
    p.fill(255);
    p.triangle(p.width - 150, p.height - 380, p.width - 180, p.height - 380, p.width - 160, p.height - 340);
    
    p.fill(80, 60, 40);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);
    p.text(level.prompt, bx + bw/2, by + bh/2);

    // Draw Player (Left side)
    p.push();
    p.translate(50, p.height - 350);
    p.stroke(40);
    p.strokeWeight(2);
    p.fill(70, 90, 120);
    p.ellipse(50, 150, 120, 180);
    p.fill(245, 210, 180);
    p.ellipse(50, 50, 80, 90);
    
    // Hair
    p.fill(40, 30, 20);
    p.noStroke();
    p.arc(50, 45, 85, 95, p.PI, 0);
    
    // Blush
    p.fill(255, 150, 150, 100);
    p.ellipse(30, 60, 15, 10);
    p.ellipse(70, 60, 15, 10);
    p.pop();

    // Draw Player Speech Bubble (Assembling)
    p.fill(255);
    p.stroke(80, 60, 40);
    p.strokeWeight(3);
    
    // Organic bubble shape for player
    p.beginShape();
    const pbx = 60;
    const pby = p.height - 140;
    const pbw = p.width - 120;
    const pbh = 110;
    p.vertex(pbx + 30, pby);
    (p as any).bezierVertex(pbx + pbw/2, pby - 15, pbx + pbw - 30, pby, pbx + pbw, pby + 30);
    (p as any).bezierVertex(pbx + pbw + 15, pby + pbh/2, pbx + pbw, pby + pbh - 30, pbx + pbw - 30, pby + pbh);
    (p as any).bezierVertex(pbx + pbw/2, pby + pbh + 15, pbx + 30, pby + pbh, pbx, pby + pbh - 30);
    (p as any).bezierVertex(pbx - 15, pby + pbh/2, pbx, pby + 30, pbx + 30, pby);
    p.endShape(p.CLOSE);
    
    p.fill(80, 60, 40);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(32);
    p.text(assembledSentence.join(" "), 100, p.height - 85);
    p.pop(); // End of shake/translate

    // Draw Stress Meter
    p.noStroke();
    p.fill(80, 60, 40, 50);
    p.rect(30, 100, 200, 15, 10);
    const meterColor = p.lerpColor(p.color(100, 200, 100), p.color(255, 50, 50), stressLevel / 100);
    p.fill(meterColor);
    p.rect(30, 100, p.map(stressLevel, 0, 100, 0, 200), 15, 10);
    p.fill(80, 60, 40);
    p.textSize(16);
    p.text("STRESS", 30, 95);

    // Update and Draw Fragments
    for (let i = fragments.length - 1; i >= 0; i--) {
        const f = fragments[i];
        
        // Movement
        f.x += f.vx;
        f.y += f.vy;

        // Bounce
        if (f.x < 50 || f.x > p.width - 50) f.vx *= -1;
        if (f.y < 50 || f.y > p.height - 200) f.vy *= -1;

        // Disappearing logic for target words (simulating disorganized thinking)
        if (f.isTarget && !f.isInterruption) {
            f.opacity -= 0.1; // Slowly fade
        }
        
        if (f.opacity <= 0) {
            fragments.splice(i, 1);
            continue;
        }

        // Draw Fragment
        if (!f || typeof f.text !== 'string') continue;
        
        const fontSize = f.isInterruption ? 20 : 24;
        p.textSize(fontSize);
        const tw = p.textWidth(f.text);

        p.push();
        if (f.isInterruption) {
            // Torn paper look for interruptions
            p.fill(240, 100, 100, f.opacity);
            p.stroke(80, 40, 40, f.opacity);
            p.strokeWeight(2);
            
            p.beginShape();
            const fx = f.x - 12;
            const fy = f.y - 18;
            const fw = tw + 24;
            const fh = 36;
            p.vertex(fx, fy);
            p.vertex(fx + fw/2, fy + p.random(-2, 2));
            p.vertex(fx + fw, fy);
            p.vertex(fx + fw + p.random(-2, 2), fy + fh/2);
            p.vertex(fx + fw, fy + fh);
            p.vertex(fx + fw/2, fy + fh + p.random(-2, 2));
            p.vertex(fx, fy + fh);
            p.vertex(fx + p.random(-2, 2), fy + fh/2);
            p.endShape(p.CLOSE);
            
            p.fill(255, f.opacity);
            p.noStroke();
            p.text(f.text, f.x, f.y);
        } else {
            // Torn paper look for target words
            p.fill(255, f.opacity);
            p.stroke(80, 60, 40, f.opacity);
            p.strokeWeight(2);
            
            p.beginShape();
            const fx = f.x - 8;
            const fy = f.y - 18;
            const fw = tw + 16;
            const fh = 36;
            p.vertex(fx, fy);
            p.vertex(fx + fw/2, fy + p.random(-1, 1));
            p.vertex(fx + fw, fy);
            p.vertex(fx + fw + p.random(-1, 1), fy + fh/2);
            p.vertex(fx + fw, fy + fh);
            p.vertex(fx + fw/2, fy + fh + p.random(-1, 1));
            p.vertex(fx, fy + fh);
            p.vertex(fx + p.random(-1, 1), fy + fh/2);
            p.endShape(p.CLOSE);
            
            p.fill(80, 60, 40, f.opacity);
            p.noStroke();
            p.text(f.text, f.x, f.y);
        }
        p.pop();

        // Interaction
        if (mouseJustPressed) {
            if (p.mouseX > f.x - 10 && p.mouseX < f.x + tw + 10 && p.mouseY > f.y - 15 && p.mouseY < f.y + 15) {
                if (f.isInterruption) {
                    fragments.splice(i, 1);
                } else {
                    // Check if it's the next word in the target sentence
                    const nextWordIndex = assembledSentence.length;
                    if (f.text === level.targetSentence[nextWordIndex]) {
                        assembledSentence.push(f.text);
                        fragments.splice(i, 1);
                        
                        // Check Win Condition
                        if (assembledSentence.length === level.targetSentence.length) {
                            if (currentLevelIndex < LEVELS.length - 1) {
                                initGame(p, currentLevelIndex + 1);
                                return; // Exit frame immediately
                            } else {
                                onWin();
                                return; // Exit frame immediately
                            }
                        }
                    } else {
                        // Wrong word or out of order
                        timer -= 2;
                    }
                }
            }
        }
    }
};
