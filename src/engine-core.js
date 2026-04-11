export function createInitialState() {
  return {
    mode: 'training',
    topic: 'numerical',
    difficulty: 'medium',
    count: 8,
    questionIndex: 0,
    questions: [],
    answers: [],
    secondsLeft: 0,
    startedAt: null,
    showExplanation: false,
    sessionDone: false,
    lastView: 'home',
    reviewIndex: null,
    lastQuestionTemplateSignature: null,
    stats: {
      totalSessions: 0,
      totalQuestions: 0,
      correct: 0,
      byTopic: {
        numerical: { total: 0, correct: 0 },
        quantitative: { total: 0, correct: 0 },
        logical: { total: 0, correct: 0 },
        mechanical: { total: 0, correct: 0 },
        verbal: { total: 0, correct: 0 },
        planning: { total: 0, correct: 0 },
        concentration: { total: 0, correct: 0 },
        german: { total: 0, correct: 0 },
        mixed: { total: 0, correct: 0 }
      }
    }
  }
}

    export const TOPICS = [
      { value: 'numerical', label: 'Numerical reasoning' },
      { value: 'quantitative', label: 'AP Quantitative' },
      { value: 'logical', label: 'Abstract / diagrammatic reasoning' },
      { value: 'mechanical', label: 'Mechanical reasoning' },
      { value: 'verbal', label: 'Verbal reasoning' },
      { value: 'planning', label: 'Planning' },
      { value: 'concentration', label: 'Concentration' },
      { value: 'german', label: 'German language' },
      { value: 'mixed', label: 'Assessment Mix' }
    ];

    export const DIFFICULTIES = ['easy', 'medium', 'hard'];
    export const MODES = [
      { value: 'training', label: 'Training' },
      { value: 'timed', label: 'Timed Test' },
      { value: 'drill', label: 'Drill' }
    ];
    export function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    export function pick(arr) {
      return arr[randInt(0, arr.length - 1)];
    }
    export function shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    export function formatTime(sec) {
      const safe = Math.max(0, Number.isFinite(sec) ? sec : 0);
      const m = Math.floor(safe / 60);
      const s = safe % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    export function getTimerSeconds(topic, difficulty) {
      const base = {
        numerical: { easy: 70, medium: 55, hard: 45 },
        verbal: { easy: 50, medium: 40, hard: 32 },
        logical: { easy: 40, medium: 32, hard: 26 },
        concentration: { easy: 28, medium: 22, hard: 18 },
        planning: { easy: 55, medium: 45, hard: 36 },
        german: { easy: 40, medium: 32, hard: 24 },
        quantitative: { easy: 75, medium: 60, hard: 48 },
        mechanical: { easy: 45, medium: 35, hard: 28 },
        mixed: { easy: 45, medium: 38, hard: 30 }
      };
      return (base[topic] && base[topic][difficulty]) || 30;
    }

export { buildDetailedExplanationHtml } from './explanations/details'

export function topicLabel(k) {
      return ({
        numerical: 'Numerical reasoning',
        quantitative: 'AP Quantitative',
        logical: 'Abstract / diagrammatic reasoning',
        mechanical: 'Mechanical reasoning',
        verbal: 'Verbal reasoning',
        planning: 'Planning',
        concentration: 'Concentration',
        german: 'German language',
        mixed: 'Assessment Mix'
      })[k] || k;
    }

    export function questionTemplateSignature(q) {
      return `${q.topic}|${q.variantKey || q.prompt}`;
    }

    export function questionFamilySignature(q) {
      return `${q.topic}|${q.familyKey || q.variantKey || q.prompt}`;
    }

    export function questionSignature(q) {
      const optionsSig = (q.options || []).map(opt => opt.plain || opt.text || opt.html || '').join('||');
      return `${questionTemplateSignature(q)}|${q.prompt}|${q.visualHtml || ''}|${optionsSig}`;
    }

    export function getUniqueQuestionLimit(topic) {
      const limits = {
        verbal: 6,
        concentration: 5,
        logical: 5,
        german: 6,
        quantitative: 5,
        mechanical: 5
      };
      return limits[topic] || 20;
    }


