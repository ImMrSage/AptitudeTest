import { getTimerSeconds, pick, shuffle } from '../engine-core'

const GERMAN_TOPIC_LABEL = 'German language'

const SPELLING_ITEMS = [
  { key: 'trompeter', correct: 'Trompeter', wrongs: ['Trommpeter', 'Trompeteer', 'Trompetar'], level: 'easy' },
  { key: 'ressourcen', correct: 'Ressourcen', wrongs: ['Resourcen', 'Ressoursen', 'Rässourcen'], level: 'easy' },
  { key: 'rundung', correct: 'Rundung', wrongs: ['Rundunk', 'Rundungg', 'Runndung'], level: 'easy' },
  { key: 'beule', correct: 'Beule', wrongs: ['Bäule', 'Beuhle', 'Beuele'], level: 'easy' },
  { key: 'zwiespalt', correct: 'Zwiespalt', wrongs: ['Zwiehspalt', 'Zwispalt', 'Zwiesspalt'], level: 'medium' },
  { key: 'adresse', correct: 'Adresse', wrongs: ['Addresse', 'Adressse', 'Adrässe'], level: 'medium' },
  { key: 'kompromiss', correct: 'Kompromiss', wrongs: ['Kompromis', 'Kompromisss', 'Kompromiß'], level: 'medium' },
  { key: 'rhythmus', correct: 'Rhythmus', wrongs: ['Rytmus', 'Rhytmus', 'Rhythmuss'], level: 'hard' },
  { key: 'interessant', correct: 'interessant', wrongs: ['interresant', 'interesant', 'intressant'], level: 'hard' },
]

const SENTENCE_ITEMS = [
  {
    key: 'worden',
    sentence: 'Bei dem neuen Autotyp ist technisch viel verbessert _____.',
    answer: 'worden',
    distractors: ['werden', 'geworden', 'wurde'],
    reasonEn: 'The sentence needs the participle "worden" to complete the passive perfect form "ist verbessert worden".',
    reasonDe: 'Der Satz braucht das Partizip "worden", um die Form "ist verbessert worden" korrekt zu bilden.',
    level: 'easy',
  },
  {
    key: 'neuen-freund',
    sentence: 'Kennst du Evas _____?',
    answer: 'neuen Freund',
    distractors: ['neues Freund', 'neuer Freund', 'neu Freunden'],
    reasonEn: 'After "Kennst du" the object is in the accusative, so the correct phrase is "Evas neuen Freund".',
    reasonDe: 'Nach "Kennst du" steht das Objekt im Akkusativ, daher ist "Evas neuen Freund" richtig.',
    level: 'easy',
  },
  {
    key: 'stellen',
    sentence: 'Der Herausforderung der modernen Technik muss man sich in jedem Beruf _____.',
    answer: 'stellen',
    distractors: ['überwinden', 'entgegnen', 'begegnen'],
    reasonEn: 'The fixed expression is "sich einer Herausforderung stellen".',
    reasonDe: 'Die feste Verbindung lautet "sich einer Herausforderung stellen".',
    level: 'medium',
  },
  {
    key: 'sprecht',
    sentence: 'Ihr _____ aber laut.',
    answer: 'sprecht',
    distractors: ['sprechen', 'spricht', 'sprachen'],
    reasonEn: 'The subject "ihr" takes the present-tense form "sprecht".',
    reasonDe: 'Zum Subjekt "ihr" gehört im Präsens die Form "sprecht".',
    level: 'easy',
  },
  {
    key: 'hoeren',
    sentence: 'Wer nicht _____ will, muss fühlen.',
    answer: 'hören',
    distractors: ['stören', 'wählen', 'spülen'],
    reasonEn: 'This is the common saying "Wer nicht hören will, muss fühlen."',
    reasonDe: 'Das ist die feste Redewendung "Wer nicht hören will, muss fühlen."',
    level: 'easy',
  },
  {
    key: 'unterhalb',
    sentence: 'Zum Glück steht das Wasser immer noch _____ der Deichkrone.',
    answer: 'unterhalb',
    distractors: ['drunter', 'oben', 'unten'],
    reasonEn: '"Unterhalb" is the precise preposition used with the genitive here: "unterhalb der Deichkrone".',
    reasonDe: '"Unterhalb" ist hier die passende Präposition mit Genitiv: "unterhalb der Deichkrone".',
    level: 'medium',
  },
  {
    key: 'unterhalten',
    sentence: 'Wir haben uns gestern lange über das Problem _____.',
    answer: 'unterhalten',
    distractors: ['unterhaltet', 'unterhaltene', 'unterhält'],
    reasonEn: 'With "haben uns" and this construction, the only correct verb form here is "unterhalten".',
    reasonDe: 'Mit "haben uns" und dieser Konstruktion passt hier nur "unterhalten".',
    level: 'medium',
  },
  {
    key: 'sein',
    sentence: 'Das Protokoll muss bis morgen fertig _____ .',
    answer: 'sein',
    distractors: ['ist', 'wurde', 'gewesen'],
    reasonEn: 'After the modal verb "muss", the infinitive "sein" is required.',
    reasonDe: 'Nach dem Modalverb "muss" wird der Infinitiv "sein" gebraucht.',
    level: 'hard',
  },
]

const DEFINITION_ITEMS = [
  {
    key: 'waehlen',
    definition: 'aussuchen und nehmen oder kaufen, sich für etwas entscheiden; jemandem seine Stimme geben',
    answer: 'wählen',
    distractors: ['mitgehen', 'gehören', 'zählen'],
    reasonEn: 'The definition describes choosing or voting, which matches "wählen".',
    reasonDe: 'Die Definition beschreibt das Auswählen oder Abstimmen und passt daher zu "wählen".',
    level: 'easy',
  },
  {
    key: 'banal',
    definition: 'leer, schal, geistlos',
    answer: 'banal',
    distractors: ['unverständlich', 'gründlich', 'erleuchtet'],
    reasonEn: 'Only "banal" matches the meaning empty, flat, and lacking originality.',
    reasonDe: 'Nur "banal" entspricht der Bedeutung leer, flach und geistlos.',
    level: 'medium',
  },
  {
    key: 'laufen',
    definition: 'die Art, sich mit schnellen Schritten, leicht springend, vorwärts zu bewegen, dabei berühren nie beide Füße gleichzeitig den Boden',
    answer: 'laufen',
    distractors: ['gehen', 'schwimmen', 'schleichen'],
    reasonEn: 'The definition clearly describes running, so the correct word is "laufen".',
    reasonDe: 'Die Definition beschreibt eindeutig das Laufen, daher ist "laufen" richtig.',
    level: 'easy',
  },
  {
    key: 'verunstalten',
    definition: 'hässlich, unansehnlich machen, entstellen',
    answer: 'verunstalten',
    distractors: ['bestehen', 'lügen', 'anklagen'],
    reasonEn: '"Verunstalten" means to disfigure or make ugly, which matches the definition.',
    reasonDe: '"Verunstalten" bedeutet entstellen oder hässlich machen und passt genau zur Definition.',
    level: 'medium',
  },
  {
    key: 'eigenschaft',
    definition: 'wesentliches und dauerndes Merkmal, Charakteristik',
    answer: 'Eigenschaft',
    distractors: ['Haarfarbe', 'Krankheit', 'Auflage'],
    reasonEn: 'A lasting defining characteristic is an "Eigenschaft".',
    reasonDe: 'Ein dauerhaftes kennzeichnendes Merkmal ist eine "Eigenschaft".',
    level: 'easy',
  },
  {
    key: 'anstand',
    definition: 'der guten Sitte, der gesellschaftlichen Norm entsprechendes Benehmen',
    answer: 'Anstand',
    distractors: ['Anlass', 'Liebhaberei', 'Genugtuung'],
    reasonEn: 'This definition points to proper conduct and decency: "Anstand".',
    reasonDe: 'Diese Definition meint gutes Benehmen und Sittsamkeit: "Anstand".',
    level: 'medium',
  },
  {
    key: 'bildung',
    definition: 'sich aneignen oder Vermittlung von Kenntnissen, Erkenntnissen, Erfahrungen',
    answer: 'Bildung',
    distractors: ['Misere', 'Lehrer', 'Praxis'],
    reasonEn: 'The acquisition or transmission of knowledge is "Bildung".',
    reasonDe: 'Die Aneignung oder Vermittlung von Wissen ist "Bildung".',
    level: 'medium',
  },
  {
    key: 'unterrichten',
    definition: 'jemandem etwas lehren; jemandem etwas mitteilen',
    answer: 'unterrichten',
    distractors: ['gefrieren', 'blättern', 'unterlassen'],
    reasonEn: 'To teach or inform someone is "unterrichten".',
    reasonDe: 'Jemanden lehren oder informieren heißt "unterrichten".',
    level: 'medium',
  },
  {
    key: 'buergersteig',
    definition: 'befestigter Fußweg am Rand einer Straße',
    answer: 'Bürgersteig',
    distractors: ['Steg', 'Ampel', 'Kurve'],
    reasonEn: 'A paved footpath at the side of a street is a "Bürgersteig".',
    reasonDe: 'Ein befestigter Fußweg am Straßenrand ist ein "Bürgersteig".',
    level: 'hard',
  },
]

export function generateGerman(difficulty) {
  const families = difficulty === 'easy'
    ? ['spelling', 'spelling', 'sentence', 'definition']
    : difficulty === 'medium'
    ? ['spelling', 'sentence', 'sentence', 'definition', 'definition']
    : ['spelling', 'sentence', 'sentence', 'definition', 'definition', 'definition']

  const family = pick(families)
  if (family === 'spelling') return germanSpelling(difficulty)
  if (family === 'sentence') return germanSentenceCompletion(difficulty)
  return germanDefinition(difficulty)
}

function germanSpelling(difficulty) {
  const item = pick(filterByDifficulty(SPELLING_ITEMS, difficulty))
  const options = shuffle([item.correct, ...item.wrongs])
  const correctIndex = options.indexOf(item.correct)

  return {
    topic: 'german',
    topicLabel: GERMAN_TOPIC_LABEL,
    variantKey: `german-spelling-${item.key}`,
    familyKey: 'german-spelling',
    timer: getTimerSeconds('german', difficulty),
    prompt: 'Which German spelling is correct?',
    visualHtml: renderGermanCard({
      title: 'German language',
      instruction: 'Choose the correct spelling of the German word.',
    }),
    options: options.map(option => ({ text: option, plain: option })),
    correctIndex,
    explanation: `The correct German spelling is "${item.correct}".`,
    pattern: 'In spelling items, check doubled consonants, umlauts, silent h, and common endings before trusting the most familiar-looking form.',
    translations: {
      de: {
        prompt: 'Welche Schreibweise ist richtig?',
        visualHtml: renderGermanCard({
          title: 'Deutschkenntnisse',
          instruction: 'Wählen Sie die richtige Schreibweise des Wortes.',
        }),
        explanation: `Die richtige Schreibweise lautet "${item.correct}".`,
        pattern: 'Bei Rechtschreibaufgaben zuerst auf Doppelkonsonanten, Umlaute, Dehnungs-h und typische Wortendungen achten.',
      },
    },
  }
}

function germanSentenceCompletion(difficulty) {
  const item = pick(filterByDifficulty(SENTENCE_ITEMS, difficulty))
  const options = shuffle([item.answer, ...item.distractors])
  const correctIndex = options.indexOf(item.answer)

  return {
    topic: 'german',
    topicLabel: GERMAN_TOPIC_LABEL,
    variantKey: `german-sentence-${item.key}`,
    familyKey: 'german-sentence',
    timer: getTimerSeconds('german', difficulty),
    prompt: 'Which option correctly fills the German sentence?',
    visualHtml: renderGermanCard({
      title: 'German language',
      instruction: 'Choose the correct option to complete the German sentence.',
      displayContent: item.sentence,
    }),
    options: options.map(option => ({ text: option, plain: option })),
    correctIndex,
    explanation: item.reasonEn,
    pattern: 'For German sentence gaps, check case, verb form, fixed expressions, and idiomatic combinations.',
    translations: {
      de: {
        prompt: 'Welche Option füllt den deutschen Satz richtig aus?',
        visualHtml: renderGermanCard({
          title: 'Deutschkenntnisse',
          instruction: 'Wählen Sie die richtige Alternative, um die Lücke zu füllen.',
          displayContent: item.sentence,
        }),
        explanation: item.reasonDe,
        pattern: 'Bei deutschen Lückensätzen auf Kasus, Verbform, feste Wendungen und idiomatische Verbindungen achten.',
      },
    },
  }
}

function germanDefinition(difficulty) {
  const item = pick(filterByDifficulty(DEFINITION_ITEMS, difficulty))
  const options = shuffle([item.answer, ...item.distractors])
  const correctIndex = options.indexOf(item.answer)

  return {
    topic: 'german',
    topicLabel: GERMAN_TOPIC_LABEL,
    variantKey: `german-definition-${item.key}`,
    familyKey: 'german-definition',
    timer: getTimerSeconds('german', difficulty),
    prompt: 'Which German word matches the definition?',
    visualHtml: renderGermanCard({
      title: 'German language',
      instruction: 'Choose the German word that matches the definition.',
      displayContent: item.definition,
    }),
    options: options.map(option => ({ text: option, plain: option })),
    correctIndex,
    explanation: item.reasonEn,
    pattern: 'For vocabulary-definition items, reduce the definition to its core meaning and eliminate choices that are only loosely related.',
    translations: {
      de: {
        prompt: 'Welches deutsche Wort passt zur Definition?',
        visualHtml: renderGermanCard({
          title: 'Deutschkenntnisse',
          instruction: 'Wählen Sie das Wort, das der Definition entspricht.',
          displayContent: item.definition,
        }),
        explanation: item.reasonDe,
        pattern: 'Bei Wort-Definition-Aufgaben zuerst die Kernaussage der Definition bestimmen und ähnlich klingende, aber falsche Wörter streichen.',
      },
    },
  }
}

function filterByDifficulty(items, difficulty) {
  const allowed = difficulty === 'easy'
    ? ['easy']
    : difficulty === 'medium'
      ? ['easy', 'medium']
      : ['easy', 'medium', 'hard']
  return items.filter(item => allowed.includes(item.level))
}

function renderGermanCard({ title, instruction, displayContent = '' }) {
  return `
    <div class="chart">
      <div class="center"><strong>${title}</strong></div>
      <div class="small center mt8" style="max-width:820px;margin-left:auto;margin-right:auto;">${instruction}</div>
      ${displayContent ? `<div class="statement mt12" style="text-align:left;max-width:920px;margin-left:auto;margin-right:auto;">${displayContent}</div>` : ''}
    </div>
  `
}
