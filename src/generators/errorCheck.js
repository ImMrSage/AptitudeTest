import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'

export function generateErrorCheck(difficulty) {
      const sets = [
        {
          prompt: 'Which line contains an error?',
          visualHtml: `
            <div class="chart">
              <div class="review-list">
                <div class="review-item">A. ZX-4187 | ZX-4187</div>
                <div class="review-item">B. LM-2045 | LM-2405</div>
                <div class="review-item">C. QR-7712 | QR-7712</div>
                <div class="review-item">D. BN-6630 | BN-6630</div>
              </div>
            </div>
          `,
          answer: 'B'
        },
        {
          prompt: 'Which line contains an error?',
          visualHtml: `
            <div class="chart">
              <div class="review-list">
                <div class="review-item">A. 58,204 | 58,204</div>
                <div class="review-item">B. 71,990 | 71,909</div>
                <div class="review-item">C. 43,118 | 43,118</div>
                <div class="review-item">D. 66,520 | 66,520</div>
              </div>
            </div>
          `,
          answer: 'B'
        },
        {
          prompt: 'Which line contains an error?',
          visualHtml: `
            <div class="chart">
              <div class="review-list">
                <div class="review-item">A. TRN-55A | TRN-55A</div>
                <div class="review-item">B. KLP-82Q | KLP-82Q</div>
                <div class="review-item">C. HMX-31B | HMX-31D</div>
                <div class="review-item">D. PRT-09L | PRT-09L</div>
              </div>
            </div>
          `,
          answer: 'C'
        },
        {
          prompt: 'Which line contains an error?',
          visualHtml: `
            <div class="chart">
              <div class="review-list">
                <div class="review-item">A. 14/07/2026 | 14/07/2026</div>
                <div class="review-item">B. 09/11/2026 | 09/11/2026</div>
                <div class="review-item">C. 22/03/2026 | 22/03/2028</div>
                <div class="review-item">D. 30/08/2026 | 30/08/2026</div>
              </div>
            </div>
          `,
          answer: 'C'
        },
        {
          prompt: 'Which line contains an error?',
          visualHtml: `
            <div class="chart">
              <div class="review-list">
                <div class="review-item">A. PL-8841-X | PL-8841-X</div>
                <div class="review-item">B. AD-1207-M | AD-1207-M</div>
                <div class="review-item">C. QT-5519-R | QT-5519-R</div>
                <div class="review-item">D. NB-4470-K | NB-4470-X</div>
              </div>
            </div>
          `,
          answer: 'D'
        }
      ];
      const item = pick(sets);
      const baseOptions = ['A', 'B', 'C', 'D'];
      const options = difficulty === 'easy' ? baseOptions : shuffle(baseOptions);
      return {
        topic: 'errorcheck',
        topicLabel: 'Error checking',
        variantKey: `errorcheck-${item.answer}-${item.visualHtml.length}`,
        timer: getTimerSeconds('errorcheck', difficulty),
        prompt: item.prompt,
        visualHtml: item.visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex: options.indexOf(item.answer),
        explanation: `Compare each character left to right. The mismatch appears on line ${item.answer}.`,
        pattern: 'Scan in a fixed order: prefix, digits, suffix. Do not rely on overall shape.'
      };
    }
