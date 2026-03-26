import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'

export function generateMechanical(difficulty) {
      const items = [
        {
          prompt: 'If Gear A turns clockwise, which way will Gear C turn?',
          visualHtml: `
            <div class="chart">
              <div class="center"><strong>Gear direction</strong></div>
              <svg viewBox="0 0 360 130" width="100%" height="130" style="display:block;margin-top:10px;">
                <circle cx="70" cy="65" r="28" fill="#dbeafe" stroke="#1d4ed8" stroke-width="4"></circle>
                <circle cx="165" cy="65" r="28" fill="#e2e8f0" stroke="#475569" stroke-width="4"></circle>
                <circle cx="260" cy="65" r="28" fill="#dbeafe" stroke="#1d4ed8" stroke-width="4"></circle>
                <text x="70" y="71" text-anchor="middle" font-size="18" font-weight="700" fill="#0f172a">A</text>
                <text x="165" y="71" text-anchor="middle" font-size="18" font-weight="700" fill="#0f172a">B</text>
                <text x="260" y="71" text-anchor="middle" font-size="18" font-weight="700" fill="#0f172a">C</text>
                <path d="M 45 25 C 20 45 20 85 45 105" fill="none" stroke="#16a34a" stroke-width="4"></path>
                <polygon points="41,20 58,25 47,37" fill="#16a34a"></polygon>
                <text x="70" y="120" text-anchor="middle" font-size="14" fill="#0f172a">Clockwise</text>
              </svg>
              <div class="small center mt8">Touching gears rotate in opposite directions. Follow the rotation across the chain.</div>
            </div>
          `,
          options: ['Clockwise', 'Counterclockwise', 'It stops', 'Cannot say'],
          answer: 'Clockwise',
          explanation: 'A turns clockwise, so B turns counterclockwise. C touches B, so it turns opposite to B: clockwise.'
        },
        {
          prompt: 'Which ramp needs less force to move the same box to the same height?',
          visualHtml: `
            <div class="chart">
              <div class="center"><strong>Ramp comparison</strong></div>
              <svg viewBox="0 0 360 150" width="100%" height="150" style="display:block;margin-top:10px;">
                <line x1="40" y1="120" x2="140" y2="55" stroke="#1d4ed8" stroke-width="6"></line>
                <line x1="40" y1="120" x2="140" y2="120" stroke="#475569" stroke-width="4"></line>
                <rect x="115" y="42" width="22" height="22" fill="#f59e0b" stroke="#0f172a" stroke-width="2"></rect>
                <text x="90" y="140" text-anchor="middle" font-size="16" font-weight="700">Ramp A</text>
                <line x1="200" y1="120" x2="320" y2="75" stroke="#16a34a" stroke-width="6"></line>
                <line x1="200" y1="120" x2="320" y2="120" stroke="#475569" stroke-width="4"></line>
                <rect x="295" y="62" width="22" height="22" fill="#f59e0b" stroke="#0f172a" stroke-width="2"></rect>
                <text x="260" y="140" text-anchor="middle" font-size="16" font-weight="700">Ramp B</text>
              </svg>
              <div class="small center mt8">Same load, same target height. Compare steepness.</div>
            </div>
          `,
          options: ['Ramp A', 'Ramp B', 'Both need the same force', 'Cannot say'],
          answer: 'Ramp B',
          explanation: 'A longer, gentler ramp reduces the force needed, even if the distance is larger.'
        },
        {
          prompt: 'A lever has the load close to the pivot and the effort far from the pivot. What is the effect?',
          visualHtml: `
            <div class="chart">
              <div class="center"><strong>Lever setup</strong></div>
              <svg viewBox="0 0 360 140" width="100%" height="140" style="display:block;margin-top:10px;">
                <line x1="40" y1="90" x2="320" y2="90" stroke="#0f172a" stroke-width="6"></line>
                <polygon points="150,90 180,120 120,120" fill="#64748b"></polygon>
                <rect x="118" y="58" width="18" height="18" fill="#ef4444"></rect>
                <text x="127" y="50" text-anchor="middle" font-size="14">Load</text>
                <line x1="255" y1="45" x2="255" y2="85" stroke="#16a34a" stroke-width="5"></line>
                <polygon points="255,35 247,49 263,49" fill="#16a34a"></polygon>
                <text x="255" y="28" text-anchor="middle" font-size="14">Effort</text>
              </svg>
              <div class="small center mt8">Load arm is short. Effort is applied farther from the pivot.</div>
            </div>
          `,
          options: ['Less effort is needed', 'More effort is needed', 'No change', 'The lever cannot move'],
          answer: 'Less effort is needed',
          explanation: 'A longer effort arm gives more mechanical advantage, so the same load can be moved with less force.'
        },
        {
          prompt: 'Two pulleys lift the same load. System B uses more supporting rope segments than System A. Which needs less effort?',
          visualHtml: `
            <div class="chart">
              <div class="center"><strong>Pulley comparison</strong></div>
              <svg viewBox="0 0 360 150" width="100%" height="150" style="display:block;margin-top:10px;">
                <circle cx="95" cy="45" r="18" fill="#e2e8f0" stroke="#475569" stroke-width="3"></circle>
                <line x1="95" y1="0" x2="95" y2="27" stroke="#475569" stroke-width="3"></line>
                <line x1="95" y1="63" x2="95" y2="100" stroke="#1d4ed8" stroke-width="4"></line>
                <rect x="80" y="100" width="30" height="26" fill="#f59e0b" stroke="#0f172a" stroke-width="2"></rect>
                <text x="95" y="142" text-anchor="middle" font-size="16" font-weight="700">System A</text>
                <circle cx="255" cy="35" r="16" fill="#e2e8f0" stroke="#475569" stroke-width="3"></circle>
                <circle cx="255" cy="85" r="16" fill="#e2e8f0" stroke="#475569" stroke-width="3"></circle>
                <line x1="255" y1="0" x2="255" y2="19" stroke="#475569" stroke-width="3"></line>
                <path d="M255 51 L255 69 M239 85 L239 35 M271 35 L271 110" fill="none" stroke="#16a34a" stroke-width="4"></path>
                <rect x="240" y="110" width="30" height="26" fill="#f59e0b" stroke="#0f172a" stroke-width="2"></rect>
                <text x="255" y="142" text-anchor="middle" font-size="16" font-weight="700">System B</text>
              </svg>
              <div class="small center mt8">More supporting rope segments mean greater mechanical advantage.</div>
            </div>
          `,
          options: ['System A', 'System B', 'Both need the same effort', 'Cannot say'],
          answer: 'System B',
          explanation: 'More supporting rope segments create more mechanical advantage, so less force is needed.'
        },
        {
          prompt: 'A metal rod is heated. What usually happens to its length?',
          visualHtml: `
            <div class="chart">
              <div class="center"><strong>Thermal expansion</strong></div>
              <svg viewBox="0 0 360 120" width="100%" height="120" style="display:block;margin-top:10px;">
                <rect x="40" y="35" width="110" height="18" rx="8" fill="#94a3b8"></rect>
                <text x="95" y="28" text-anchor="middle" font-size="14">Before heating</text>
                <rect x="200" y="35" width="140" height="18" rx="8" fill="#f97316"></rect>
                <text x="270" y="28" text-anchor="middle" font-size="14">After heating</text>
                <path d="M165 44 L190 44" stroke="#ef4444" stroke-width="4"></path>
                <polygon points="190,44 180,38 180,50" fill="#ef4444"></polygon>
              </svg>
              <div class="statement">Assume normal thermal behavior of metals.</div>
            </div>
          `,
          options: ['It increases', 'It decreases', 'It stays exactly the same', 'It depends only on color'],
          answer: 'It increases',
          explanation: 'Most metals expand when heated, so the rod becomes slightly longer.'
        }
      ];
      const item = pick(items);
      const options = difficulty === 'hard'
        ? shuffle(item.options)
        : item.options;
      return {
        topic: 'mechanical',
        topicLabel: 'Mechanical reasoning',
        variantKey: `mechanical-${item.prompt}`,
        timer: getTimerSeconds('mechanical', difficulty),
        prompt: item.prompt,
        visualHtml: item.visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex: options.indexOf(item.answer),
        explanation: item.explanation,
        pattern: 'Check the basic rule first: opposite gear direction, longer ramp means less force, longer effort arm means more leverage.'
      };
    }
