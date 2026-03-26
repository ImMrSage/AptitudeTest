import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'

export function generateDiagrammatic(difficulty) {
      const patterns = difficulty === 'easy'
        ? ['alternation', 'rotation', 'position']
        : difficulty === 'medium'
        ? ['alternation', 'rotation', 'count', 'position', 'shading']
        : ['rotation', 'count', 'position', 'shading'];
      const type = pick(patterns);
      if (type === 'rotation') return diagRotation(difficulty);
      if (type === 'count') return diagCount(difficulty);
      if (type === 'position') return diagPosition(difficulty);
      if (type === 'shading') return diagShading(difficulty);
      return diagAlternation(difficulty);
    }

    export function diagAlternation(difficulty) {
      const set = pick([
        ['▲','●','▲','●','▲'],
        ['■','□','■','□','■'],
        ['◆','◇','◆','◇','◆']
      ]);
      const answer = set[1];
      const options = shuffle([answer, set[0], '○', '△'].filter((v, i, a) => a.indexOf(v) === i)).slice(0,4);
      const correctIndex = options.indexOf(answer);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Find the next figure</strong></div>
          <div class="diagram-grid">
            ${set.map(s => `<div class="diagram-cell">${s}</div>`).join('')}
            <div class="diagram-cell missing">?</div>
          </div>
        </div>
      `;
      return {
        topic: 'diagrammatic',
        topicLabel: 'Diagrammatic reasoning',
        variantKey: 'diagrammatic-alternation',
        timer: getTimerSeconds('diagrammatic', difficulty),
        prompt: 'Which figure comes next?',
        visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex,
        explanation: `Здесь обычное чередование A-B-A-B-A, значит дальше снова B.`,
        pattern: `Check simplest rule first: alternation before anything more complex.`
      };
    }

    export function diagRotation(difficulty) {
      const shapes = ['▲','▶','▼','◀'];
      const start = randInt(0, 3);
      const seq = [0,1,2,3,0].map(x => shapes[(start + x) % 4]);
      const answer = seq[4];
      const options = shuffle([...new Set(shapes)]).slice(0,4);
      const correctIndex = options.indexOf(answer);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Rotation pattern</strong></div>
          <div class="diagram-grid">
            ${seq.slice(0,4).map(s => `<div class="diagram-cell">${s}</div>`).join('')}
            <div class="diagram-cell missing">?</div>
          </div>
        </div>
      `;
      return {
        topic: 'diagrammatic',
        topicLabel: 'Diagrammatic reasoning',
        variantKey: 'diagrammatic-rotation',
        timer: getTimerSeconds('diagrammatic', difficulty),
        prompt: 'Which figure comes next?',
        visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex,
        explanation: `Фигура поворачивается на 90° каждый шаг. Отследи направление вращения и сделай ещё один поворот.`,
        pattern: `For figure sequences: test rotation, count, position, shading — in that order.`
      };
    }

    export function diagCount(difficulty) {
      const start = difficulty === 'medium' ? 1 : 2;
      const seq = [start, start + 1, start + 2, start + 3];
      const answer = start + 4;
      const options = shuffle([answer, answer - 1, answer + 1, answer + 2]);
      const correctIndex = options.indexOf(answer);
      const renderDots = n => `<div style="display:grid;grid-template-columns:repeat(3,14px);gap:6px;justify-content:center;">${Array.from({length:n}, () => '<span style="width:14px;height:14px;border-radius:999px;background:#111827;display:block"></span>').join('')}</div>`;
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Count pattern</strong></div>
          <div class="diagram-grid">
            ${seq.map(n => `<div class="diagram-cell">${renderDots(n)}</div>`).join('')}
            <div class="diagram-cell missing">?</div>
          </div>
        </div>
      `;
      return {
        topic: 'diagrammatic',
        topicLabel: 'Diagrammatic reasoning',
        variantKey: 'diagrammatic-count',
        timer: getTimerSeconds('diagrammatic', difficulty),
        prompt: 'How many dots should the next box contain?',
        visualHtml,
        options: options.map(v => ({ text: String(v), plain: String(v) })),
        correctIndex,
        explanation: `Количество элементов растёт на 1 на каждом шаге.`,
        pattern: `Count changes are common distractors. Ignore shape style and track only number of elements.`
      };
    }

    export function diagPosition(difficulty) {
      const positions = ['top', 'right', 'bottom', 'left'];
      const circles = ['●', '○'];
      const start = randInt(0, 3);
      const filled = difficulty === 'hard';
      const seq = [0, 1, 2, 3].map(step => positions[(start + step) % 4]);
      const answer = positions[(start + 4) % 4];
      const renderBox = pos => {
        const top = pos === 'top' ? '16%' : pos === 'bottom' ? '68%' : '42%';
        const left = pos === 'left' ? '16%' : pos === 'right' ? '68%' : '42%';
        return `<div class="diagram-cell"><span style="position:absolute;top:${top};left:${left};font-size:28px;">${filled ? circles[0] : circles[1]}</span></div>`;
      };
      const options = shuffle(positions).slice(0, 4);
      const correctIndex = options.indexOf(answer);
      const optionHtml = pos => {
        const top = pos === 'top' ? '16%' : pos === 'bottom' ? '68%' : '42%';
        const left = pos === 'left' ? '16%' : pos === 'right' ? '68%' : '42%';
        return `<div style="position:relative;height:42px;"><span style="position:absolute;top:${top};left:${left};font-size:24px;">${filled ? circles[0] : circles[1]}</span></div>`;
      };
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Position pattern</strong></div>
          <div class="diagram-grid">
            ${seq.map(renderBox).join('')}
            <div class="diagram-cell missing">?</div>
          </div>
        </div>
      `;
      return {
        topic: 'diagrammatic',
        topicLabel: 'Diagrammatic reasoning',
        variantKey: 'diagrammatic-position',
        timer: getTimerSeconds('diagrammatic', difficulty),
        prompt: 'Which box comes next?',
        visualHtml,
        options: options.map(v => ({ html: optionHtml(v), text: v, plain: v })),
        correctIndex,
        explanation: 'The symbol moves one side clockwise each step: top to right to bottom to left, then repeats.',
        pattern: 'Track movement rules separately from shape style: position, then rotation, then count.'
      };
    }

    export function diagShading(difficulty) {
      const shades = ['#111827', '#94a3b8', '#ffffff'];
      const borders = ['#111827', '#111827', '#334155'];
      const start = randInt(0, 2);
      const seq = [0, 1, 2, 0].map(step => (start + step) % 3);
      const answer = (start + 4) % 3;
      const renderCell = idx => `<div class="diagram-cell"><span style="width:40px;height:40px;border-radius:999px;display:block;background:${shades[idx]};border:2px solid ${borders[idx]};"></span></div>`;
      const options = shuffle([0, 1, 2]).map(idx => ({ idx, html: `<div style="display:grid;place-items:center;height:42px;">` +
        `<span style="width:28px;height:28px;border-radius:999px;display:block;background:${shades[idx]};border:2px solid ${borders[idx]};"></span></div>` }));
      const correctIndex = options.findIndex(opt => opt.idx === answer);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Shading sequence</strong></div>
          <div class="diagram-grid">
            ${seq.slice(0, 4).map(renderCell).join('')}
            <div class="diagram-cell missing">?</div>
          </div>
        </div>
      `;
      return {
        topic: 'diagrammatic',
        topicLabel: 'Diagrammatic reasoning',
        variantKey: 'diagrammatic-shading',
        timer: getTimerSeconds('diagrammatic', difficulty),
        prompt: 'Which figure comes next?',
        visualHtml,
        options: options.map(opt => ({ html: opt.html, text: String(opt.idx), plain: `Option ${opt.idx + 1}` })),
        correctIndex,
        explanation: 'The circle fill cycles through dark, grey, white, then repeats.',
        pattern: 'Check fill and shading cycles separately from movement or shape.'
      };
    }

    export function generateLogical(difficulty) {
      const types = difficulty === 'easy'
        ? ['symmetry']
        : difficulty === 'medium'
        ? ['symmetry', 'matrix']
        : ['symmetry', 'matrix'];
      const type = pick(types);
      const q = type === 'symmetry' ? logicalSymmetry(difficulty) : logicalMatrix(difficulty);
      return {
        ...q,
        topic: 'logical',
        topicLabel: 'Abstract logical reasoning',
        variantKey: `logical-${q.variantKey || q.prompt}`,
        timer: getTimerSeconds('logical', difficulty),
        explanation: q.explanation,
        pattern: 'Look for the transformation rule between figures: rotation, position, count, alternation, or shading.'
      };
    }

    export function logicalSymmetry(difficulty) {
      const axes = ['vertical', 'horizontal'];
      const axis = pick(axes);
      const leftShapes = ['◢', '◣', '◤', '◥', '◧', '◨'];
      const pairMap = axis === 'vertical'
        ? { '◢': '◣', '◣': '◢', '◤': '◥', '◥': '◤', '◧': '◨', '◨': '◧' }
        : { '◢': '◤', '◤': '◢', '◣': '◥', '◥': '◣', '◧': '◧', '◨': '◨' };
      const seed = pick(leftShapes);
      const answer = pairMap[seed];
      const options = shuffle([answer, ...Object.values(pairMap).filter(v => v !== answer)]).slice(0, 4);
      const correctIndex = options.indexOf(answer);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Symmetry</strong></div>
          <div class="diagram-grid" style="grid-template-columns:repeat(3, 1fr);max-width:340px;margin-left:auto;margin-right:auto;">
            <div class="diagram-cell">${seed}</div>
            <div class="diagram-cell" style="font-size:18px;color:#64748b;">${axis === 'vertical' ? '|' : '—'}</div>
            <div class="diagram-cell missing">?</div>
          </div>
          <div class="small center mt8">Choose the figure that is the mirror image across the ${axis} axis.</div>
        </div>
      `;
      return {
        topic: 'logical',
        topicLabel: 'Abstract logical reasoning',
        variantKey: `logical-symmetry-${axis}`,
        timer: getTimerSeconds('logical', difficulty),
        prompt: 'Which option completes the symmetry rule?',
        visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex,
        explanation: `Reflect the figure across the ${axis} axis, so the filled corner switches to the mirrored side.`,
        pattern: 'In symmetry questions, keep the shape the same and flip only its orientation across the stated axis.'
      };
    }

    export function logicalMatrix(difficulty) {
      const rows = [
        ['▲', '▲▲', '▲▲▲'],
        ['●', '●●', '●●●']
      ];
      const answerBase = pick(['■', '◆']);
      const thirdRow = [answerBase, answerBase + answerBase, answerBase + answerBase + answerBase];
      const options = shuffle([
        thirdRow[2],
        thirdRow[1],
        answerBase,
        answerBase + answerBase + answerBase + answerBase
      ]);
      const correctIndex = options.indexOf(thirdRow[2]);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Matrix completion</strong></div>
          <div class="diagram-grid" style="grid-template-columns:repeat(3, 1fr);">
            ${rows[0].map(cell => `<div class="diagram-cell">${cell}</div>`).join('')}
            ${rows[1].map(cell => `<div class="diagram-cell">${cell}</div>`).join('')}
            <div class="diagram-cell">${thirdRow[0]}</div>
            <div class="diagram-cell">${thirdRow[1]}</div>
            <div class="diagram-cell missing">?</div>
          </div>
        </div>
      `;
      return {
        topic: 'logical',
        topicLabel: 'Abstract logical reasoning',
        variantKey: `logical-matrix-${answerBase}`,
        timer: getTimerSeconds('logical', difficulty),
        prompt: 'Which option completes the 3×3 matrix?',
        visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex,
        explanation: 'Each row keeps the same shape, while each column increases the number of symbols from 1 to 3.',
        pattern: 'For matrix questions, check what changes by row and what changes by column separately.'
      };
    }

    export function generateConcentration(difficulty) {
      const q = generateErrorCheck(difficulty);
      return {
        ...q,
        topic: 'concentration',
        topicLabel: 'Concentration',
        timer: getTimerSeconds('concentration', difficulty),
        prompt: 'Identify the mismatching line as quickly and accurately as possible.'
      };
    }

    export function generatePlanning(difficulty) {
      const tasks = ['Assembly', 'Inspection', 'Packing', 'Dispatch'];
      const durations = tasks.map(() => randInt(20, 55));
      const slotStart = pick([480, 510, 540]);
      const breakStart = pick([600, 615, 630]);
      const idx = randInt(0, tasks.length - 1);
      const finish = slotStart + durations.slice(0, idx + 1).reduce((a, b) => a + b, 0);
      const finishDisplay = `${String(Math.floor(finish / 60)).padStart(2, '0')}:${String(finish % 60).padStart(2, '0')}`;
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Shift plan</strong></div>
          <div class="review-list">
            <div class="review-item">Start time: ${String(Math.floor(slotStart / 60)).padStart(2, '0')}:${String(slotStart % 60).padStart(2, '0')}</div>
            ${tasks.map((task, i) => `<div class="review-item">${task}: ${durations[i]} minutes</div>`).join('')}
            <div class="review-item">Break starts at ${String(Math.floor(breakStart / 60)).padStart(2, '0')}:${String(breakStart % 60).padStart(2, '0')}</div>
          </div>
        </div>
      `;
      const options = shuffle([
        finishDisplay,
        `${String(Math.floor((finish + 15) / 60)).padStart(2, '0')}:${String((finish + 15) % 60).padStart(2, '0')}`,
        `${String(Math.floor((finish - 10) / 60)).padStart(2, '0')}:${String((finish - 10) % 60).padStart(2, '0')}`,
        `${String(Math.floor(breakStart / 60)).padStart(2, '0')}:${String(breakStart % 60).padStart(2, '0')}`
      ].filter((v, i, a) => a.indexOf(v) === i));
      return {
        topic: 'planning',
        topicLabel: 'Planning',
        timer: getTimerSeconds('planning', difficulty),
        prompt: `At what time should ${tasks[idx]} finish if tasks are done in the listed order?`,
        visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex: options.indexOf(finishDisplay),
        explanation: `Add the durations from the shift start up to ${tasks[idx]}. That gives a finish time of ${finishDisplay}.`,
        pattern: 'For planning questions, build the timeline in sequence and ignore unrelated times unless the prompt asks for them.'
      };
    }
