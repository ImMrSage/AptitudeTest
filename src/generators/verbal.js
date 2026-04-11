import { getTimerSeconds, pick } from '../engine-core'

const NAMES = ['Nadia', 'Omar', 'Lena', 'Mateo', 'Sara', 'Ivan']
const TEAMS = ['Team Blue', 'Team North', 'Team Delta', 'Unit A']
const PRODUCTS = ['Product X', 'Order 417', 'Package M', 'Batch 72']
const ROOMS = ['Room A', 'Room B', 'Lab 2', 'Station C']

export function generateVerbal(difficulty) {
  const family = pick(['all-some', 'badge', 'only-room', 'every-team', 'some-orders', 'unless', 'policy', 'policy', 'instruction', 'instruction', 'instruction'])
  if (family === 'all-some') return verbalAllSome(difficulty)
  if (family === 'badge') return verbalBadge(difficulty)
  if (family === 'only-room') return verbalOnlyRoom(difficulty)
  if (family === 'every-team') return verbalEveryTeam(difficulty)
  if (family === 'some-orders') return verbalSomeOrders(difficulty)
  if (family === 'policy') return verbalPolicyNotice(difficulty)
  if (family === 'instruction') return verbalInstructionNote(difficulty)
  return verbalUnless(difficulty)
}

function verbalAllSome(difficulty) {
  const group = pick(['trainees', 'apprentices', 'operators'])
  const basic = pick(['safety training', 'induction training', 'equipment briefing'])
  const advanced = pick(['advanced technical training', 'quality-control training', 'machine calibration training'])
  return buildQuestion({
    variantKey: 'verbal-all-some',
    text: `All ${group} must complete ${basic}. Some ${group} also complete ${advanced}.`,
    statement: `Some ${group} who completed ${basic} also completed ${advanced}.`,
    answer: 'True',
    explanation: `All ${group} completed ${basic}, and some of them also completed ${advanced}. Therefore at least some completed both.`
  }, difficulty)
}

function verbalBadge(difficulty) {
  const place = pick(['the lab', 'the testing room', 'the secure archive'])
  const visitors = pick(['visitors', 'contractors', 'guests'])
  return buildQuestion({
    variantKey: 'verbal-badge',
    text: `No employee may enter ${place} without a badge. Some ${visitors} were given temporary badges.`,
    statement: `Some ${visitors} may enter ${place}.`,
    answer: 'Cannot say',
    explanation: `A badge is necessary for entry, but the text does not say that any ${visitors} with temporary badges were actually permitted to enter ${place}.`
  }, difficulty)
}

function verbalOnlyRoom(difficulty) {
  const room = pick(ROOMS)
  const item = pick(PRODUCTS)
  return buildQuestion({
    variantKey: 'verbal-only-room',
    text: `Only products tested in ${room} were shipped on Monday. ${item} was shipped on Monday.`,
    statement: `${item} was tested in ${room}.`,
    answer: 'True',
    explanation: `If only products tested in ${room} were shipped on Monday, then any item shipped on Monday must have been tested in ${room}.`
  }, difficulty)
}

function verbalEveryTeam(difficulty) {
  const name = pick(NAMES)
  const team = pick(TEAMS)
  const task = pick(['passed the safety briefing', 'completed the audit drill', 'signed the compliance form'])
  return buildQuestion({
    variantKey: 'verbal-every-team',
    text: `Every apprentice in ${team} ${task}. ${name} is in ${team}.`,
    statement: `${name} ${task}.`,
    answer: 'True',
    explanation: `${name} belongs to ${team}, and every apprentice in ${team} ${task}. So the statement must be true.`
  }, difficulty)
}

function verbalSomeOrders(difficulty) {
  const item = pick(PRODUCTS)
  return buildQuestion({
    variantKey: 'verbal-some-orders',
    text: `Some orders placed before noon were dispatched on Tuesday. ${item} was placed before noon.`,
    statement: `${item} was dispatched on Tuesday.`,
    answer: 'Cannot say',
    explanation: `The text says only some orders placed before noon were dispatched on Tuesday. It does not tell us whether ${item} was one of them.`
  }, difficulty)
}

function verbalUnless(difficulty) {
  const machine = pick(['Machine R', 'Machine K', 'Unit 5', 'Press 3'])
  const guard = pick(['the guard', 'the safety cover', 'the protective gate'])
  return buildQuestion({
    variantKey: 'verbal-unless',
    text: `No machine can be started unless ${guard} is closed. ${machine} started successfully.`,
    statement: `${guard.charAt(0).toUpperCase() + guard.slice(1)} on ${machine} was closed.`,
    answer: 'True',
    explanation: `A closed ${guard} is required for a successful start. Since ${machine} started successfully, its ${guard} must have been closed.`
  }, difficulty)
}

function verbalPolicyNotice(difficulty) {
  const scenarios = [
    {
      variantKey: 'verbal-policy-time-off',
      text: `<div><strong>Further education</strong></div>
        <p>The HR division is responsible for the continuing development of staff.</p>
        <p><strong>Training:</strong> The HR division organises training if new technologies are introduced or production processes change so that staff can increase their knowledge in relation to these.</p>
        <p><strong>Qualifications:</strong> If a member of staff wishes to gain an additional qualification within the company, they can contact the HR division.</p>
        <p>From time to time, staff are granted time off in order to attend training and gain additional qualifications.</p>`,
      statement: 'Employees who are taking part in training courses within the scope of further education are always excused from work.',
      answer: 'False',
      explanation: 'The notice says staff are granted time off from time to time, not always. The word always makes the statement false.'
    },
    {
      variantKey: 'verbal-policy-qualification',
      text: `<div><strong>Further education</strong></div>
        <p>The HR division is responsible for the continuing development of staff.</p>
        <p><strong>Training:</strong> The HR division organises training if new technologies are introduced or production processes change.</p>
        <p><strong>Qualifications:</strong> If a member of staff wishes to gain an additional qualification within the company, they can contact the HR division.</p>`,
      statement: 'Any employee who contacts the HR division about an additional qualification will receive that qualification.',
      answer: 'Cannot say',
      explanation: 'The notice says employees can contact HR about qualifications. It does not say every request is approved or that every employee receives the qualification.'
    },
    {
      variantKey: 'verbal-policy-training',
      text: `<div><strong>Further education</strong></div>
        <p>The HR division is responsible for the continuing development of staff.</p>
        <p><strong>Training:</strong> The HR division organises training if new technologies are introduced or production processes change so that staff can increase their knowledge in relation to these.</p>
        <p><strong>Qualifications:</strong> If a member of staff wishes to gain an additional qualification within the company, they can contact the HR division.</p>`,
      statement: 'The HR division organises training when new technologies are introduced.',
      answer: 'True',
      explanation: 'That rule is stated directly in the training section, so the statement is true.'
    }
  ]

  return buildQuestion(pick(scenarios), difficulty)
}

function verbalInstructionNote(difficulty) {
  const scenarios = [
    buildInstructionScenario({
      variantKey: 'verbal-instruction-machine-order',
      titleEn: 'To operate a machine',
      titleDe: 'Maschine bedienen',
      paragraphsEn: [
        'Before using the grinding machine, please put on your mouth and hearing protection. The machine can be turned on by pressing the green button. Only afterwards can the exhaust system also be switched on by pushing down the red lever.',
        'The speed of the abrasive belt can be changed depending on the work piece. Ensure that you have chosen the right speed for the material before you begin with the grinding. You then have to press the piece to be ground against the abrasive belt with both hands and with the same constant pressure. If grinding it once is not enough, repeat it as many times as necessary.',
        'Once the grinding process is over, the grinding machine can be turned off by pressing the green button. Mouth and hearing protection should only be taken off once the machine has been turned off.',
      ],
      paragraphsDe: [
        'Bevor Sie die Schleifmaschine benutzen, legen Sie bitte Mund- und Gehoerschutz an. Die Maschine wird durch Druecken des gruenen Knopfes eingeschaltet. Erst danach darf auch die Absaugung eingeschaltet werden, indem der rote Hebel nach unten gedrueckt wird.',
        'Die Geschwindigkeit des Schleifbandes kann je nach Werkstueck angepasst werden. Stellen Sie vor Beginn des Schleifens sicher, dass Sie die passende Geschwindigkeit fuer das Material gewaehlt haben. Danach muessen Sie das Werkstueck mit beiden Haenden und mit gleichmaessigem Druck gegen das Schleifband druecken. Falls einmaliges Schleifen nicht ausreicht, wiederholen Sie den Vorgang so oft wie noetig.',
        'Nach dem Schleifvorgang kann die Schleifmaschine durch Druecken des gruenen Knopfes ausgeschaltet werden. Mund- und Gehoerschutz duerfen erst abgelegt werden, wenn die Maschine ausgeschaltet wurde.',
      ],
      statementEn: 'For the grinding machine, the exhaust system can only be turned on after the machine itself has been switched on.',
      statementDe: 'Bei der Schleifmaschine darf die Absaugung erst eingeschaltet werden, nachdem die Maschine selbst eingeschaltet wurde.',
      answer: 'True',
      explanation: 'The instructions explicitly say the exhaust system may only be switched on afterwards, so the machine must already be on first.',
      explanationDe: 'In der Anweisung steht ausdruecklich, dass die Absaugung erst danach eingeschaltet werden darf. Daher muss die Maschine bereits laufen.',
    }),
    buildInstructionScenario({
      variantKey: 'verbal-instruction-machine-lever',
      titleEn: 'To operate a machine',
      titleDe: 'Maschine bedienen',
      paragraphsEn: [
        'Before using the grinding machine, please put on your mouth and hearing protection. The machine can be turned on by pressing the green button. Only afterwards can the exhaust system also be switched on by pushing down the red lever.',
        'The speed of the abrasive belt can be changed depending on the work piece. Ensure that you have chosen the right speed for the material before you begin with the grinding. You then have to press the piece to be ground against the abrasive belt with both hands and with the same constant pressure. If grinding it once is not enough, repeat it as many times as necessary.',
        'Once the grinding process is over, the grinding machine can be turned off by pressing the green button. Mouth and hearing protection should only be taken off once the machine has been turned off.',
      ],
      paragraphsDe: [
        'Bevor Sie die Schleifmaschine benutzen, legen Sie bitte Mund- und Gehoerschutz an. Die Maschine wird durch Druecken des gruenen Knopfes eingeschaltet. Erst danach darf auch die Absaugung eingeschaltet werden, indem der rote Hebel nach unten gedrueckt wird.',
        'Die Geschwindigkeit des Schleifbandes kann je nach Werkstueck angepasst werden. Stellen Sie vor Beginn des Schleifens sicher, dass Sie die passende Geschwindigkeit fuer das Material gewaehlt haben. Danach muessen Sie das Werkstueck mit beiden Haenden und mit gleichmaessigem Druck gegen das Schleifband druecken. Falls einmaliges Schleifen nicht ausreicht, wiederholen Sie den Vorgang so oft wie noetig.',
        'Nach dem Schleifvorgang kann die Schleifmaschine durch Druecken des gruenen Knopfes ausgeschaltet werden. Mund- und Gehoerschutz duerfen erst abgelegt werden, wenn die Maschine ausgeschaltet wurde.',
      ],
      statementEn: "The grinding machine's exhaust system can be turned on by pushing up the red lever.",
      statementDe: 'Die Absaugung der Schleifmaschine wird eingeschaltet, indem der rote Hebel nach oben gedrueckt wird.',
      answer: 'False',
      explanation: 'The red lever must be pushed down, not up.',
      explanationDe: 'Der rote Hebel muss nach unten gedrueckt werden, nicht nach oben.',
    }),
    buildInstructionScenario({
      variantKey: 'verbal-instruction-machine-protection',
      titleEn: 'To operate a machine',
      titleDe: 'Maschine bedienen',
      paragraphsEn: [
        'Before using the grinding machine, please put on your mouth and hearing protection. The machine can be turned on by pressing the green button. Only afterwards can the exhaust system also be switched on by pushing down the red lever.',
        'The speed of the abrasive belt can be changed depending on the work piece. Ensure that you have chosen the right speed for the material before you begin with the grinding. You then have to press the piece to be ground against the abrasive belt with both hands and with the same constant pressure. If grinding it once is not enough, repeat it as many times as necessary.',
        'Once the grinding process is over, the grinding machine can be turned off by pressing the green button. Mouth and hearing protection should only be taken off once the machine has been turned off.',
      ],
      paragraphsDe: [
        'Bevor Sie die Schleifmaschine benutzen, legen Sie bitte Mund- und Gehoerschutz an. Die Maschine wird durch Druecken des gruenen Knopfes eingeschaltet. Erst danach darf auch die Absaugung eingeschaltet werden, indem der rote Hebel nach unten gedrueckt wird.',
        'Die Geschwindigkeit des Schleifbandes kann je nach Werkstueck angepasst werden. Stellen Sie vor Beginn des Schleifens sicher, dass Sie die passende Geschwindigkeit fuer das Material gewaehlt haben. Danach muessen Sie das Werkstueck mit beiden Haenden und mit gleichmaessigem Druck gegen das Schleifband druecken. Falls einmaliges Schleifen nicht ausreicht, wiederholen Sie den Vorgang so oft wie noetig.',
        'Nach dem Schleifvorgang kann die Schleifmaschine durch Druecken des gruenen Knopfes ausgeschaltet werden. Mund- und Gehoerschutz duerfen erst abgelegt werden, wenn die Maschine ausgeschaltet wurde.',
      ],
      statementEn: 'Mouth and hearing protection may be taken off as soon as the grinding itself is finished, even if the machine is still running.',
      statementDe: 'Mund- und Gehoerschutz duerfen abgelegt werden, sobald das Schleifen beendet ist, auch wenn die Maschine noch laeuft.',
      answer: 'False',
      explanation: 'The protection may only be removed after the machine has been turned off.',
      explanationDe: 'Der Schutz darf erst abgelegt werden, nachdem die Maschine ausgeschaltet wurde.',
    }),
    buildInstructionScenario({
      variantKey: 'verbal-instruction-hygiene-wounds',
      titleEn: 'Hygiene',
      titleDe: 'Hygiene',
      paragraphsEn: [
        '<strong>Clothes:</strong> Make sure to keep work clothes clean and that hats cover your hair completely. When touching food, gloves have to be worn.',
        '<strong>Cleanliness:</strong> Pay high attention to personal body hygiene. Body odour is seen as unhygienic. Furthermore, ensure that your fingernails are short and clean. The cleaning of hands and forearms is of particular importance especially before starting work, after each break, after every cigarette, after going to the bathroom, and basically after every activity that is unhygienic.',
        '<strong>Sickness:</strong> Injuries and accidents have to be reported immediately. Small wounds can be covered with an impermeable plaster. All diseases, especially colds, skin diseases, diarrhea, and other infections of the digestive system have to be reported. When sneezing or coughing, your nose and/or mouth have to be covered with a tissue. Afterwards, washing your hands is mandatory.',
      ],
      paragraphsDe: [
        '<strong>Kleidung:</strong> Achten Sie darauf, Arbeitskleidung sauber zu halten und dass Kopfbedeckungen Ihr Haar vollstaendig bedecken. Beim Beruehren von Lebensmitteln muessen Handschuhe getragen werden.',
        '<strong>Sauberkeit:</strong> Achten Sie stark auf die persoenliche Koerperhygiene. Koerpergeruch gilt als unhygienisch. Stellen Sie ausserdem sicher, dass Ihre Fingernagel kurz und sauber sind. Das Reinigen von Haenden und Unterarmen ist besonders wichtig, vor allem vor Arbeitsbeginn, nach jeder Pause, nach jeder Zigarette, nach dem Toilettengang und grundsaetzlich nach jeder unhygienischen Taetigkeit.',
        '<strong>Krankheit:</strong> Verletzungen und Unfaelle muessen sofort gemeldet werden. Kleine Wunden duerfen mit einem wasserundurchlaessigen Pflaster abgedeckt werden. Alle Krankheiten, insbesondere Erkaeltungen, Hautkrankheiten, Durchfall und andere Infektionen des Verdauungssystems, muessen gemeldet werden. Beim Niesen oder Husten muessen Nase und/oder Mund mit einem Taschentuch bedeckt werden. Danach ist Haendewaschen verpflichtend.',
      ],
      statementEn: 'According to the personal hygiene regulations, it is acceptable to cover small wounds with an impermeable plaster.',
      statementDe: 'Nach den Regeln zur persoenlichen Hygiene ist es zulaessig, kleine Wunden mit einem wasserundurchlaessigen Pflaster abzudecken.',
      answer: 'True',
      explanation: 'The hygiene instructions state this directly in the sickness section.',
      explanationDe: 'Das steht direkt im Abschnitt zu Krankheit und Verletzungen.',
    }),
    buildInstructionScenario({
      variantKey: 'verbal-instruction-hygiene-hands',
      titleEn: 'Hygiene',
      titleDe: 'Hygiene',
      paragraphsEn: [
        '<strong>Clothes:</strong> Make sure to keep work clothes clean and that hats cover your hair completely. When touching food, gloves have to be worn.',
        '<strong>Cleanliness:</strong> Pay high attention to personal body hygiene. Body odour is seen as unhygienic. Furthermore, ensure that your fingernails are short and clean. The cleaning of hands and forearms is of particular importance especially before starting work, after each break, after every cigarette, after going to the bathroom, and basically after every activity that is unhygienic.',
        '<strong>Sickness:</strong> Injuries and accidents have to be reported immediately. Small wounds can be covered with an impermeable plaster. All diseases, especially colds, skin diseases, diarrhea, and other infections of the digestive system have to be reported. When sneezing or coughing, your nose and/or mouth have to be covered with a tissue. Afterwards, washing your hands is mandatory.',
      ],
      paragraphsDe: [
        '<strong>Kleidung:</strong> Achten Sie darauf, Arbeitskleidung sauber zu halten und dass Kopfbedeckungen Ihr Haar vollstaendig bedecken. Beim Beruehren von Lebensmitteln muessen Handschuhe getragen werden.',
        '<strong>Sauberkeit:</strong> Achten Sie stark auf die persoenliche Koerperhygiene. Koerpergeruch gilt als unhygienisch. Stellen Sie ausserdem sicher, dass Ihre Fingernagel kurz und sauber sind. Das Reinigen von Haenden und Unterarmen ist besonders wichtig, vor allem vor Arbeitsbeginn, nach jeder Pause, nach jeder Zigarette, nach dem Toilettengang und grundsaetzlich nach jeder unhygienischen Taetigkeit.',
        '<strong>Krankheit:</strong> Verletzungen und Unfaelle muessen sofort gemeldet werden. Kleine Wunden duerfen mit einem wasserundurchlaessigen Pflaster abgedeckt werden. Alle Krankheiten, insbesondere Erkaeltungen, Hautkrankheiten, Durchfall und andere Infektionen des Verdauungssystems, muessen gemeldet werden. Beim Niesen oder Husten muessen Nase und/oder Mund mit einem Taschentuch bedeckt werden. Danach ist Haendewaschen verpflichtend.',
      ],
      statementEn: 'After coughing into a tissue, washing your hands is optional if you return to work immediately.',
      statementDe: 'Nach dem Husten in ein Taschentuch ist Haendewaschen optional, wenn Sie sofort zur Arbeit zurueckkehren.',
      answer: 'False',
      explanation: 'The instructions say that washing your hands afterwards is mandatory.',
      explanationDe: 'In der Anweisung steht, dass anschliessendes Haendewaschen verpflichtend ist.',
    }),
    buildInstructionScenario({
      variantKey: 'verbal-instruction-directions-change',
      titleEn: 'Directions',
      titleDe: 'Wegbeschreibung',
      paragraphsEn: [
        '<strong>From train station B</strong><br />Take the subway U5 from train station B that leaves from the south exit of the train station and stay on it for 6 stops until you get to the "market square" stop. The estimated length of the journey is 10 minutes.',
        '<strong>From train station C</strong><br />Take the S-Tram S3 from train station C and stay on it for 4 stops until you get to the "Square C" stop. Change trams there and get onto the S2. Stay on it for 2 stations until you get to the "market square" stop. The estimated length of the journey is 15 minutes.',
      ],
      paragraphsDe: [
        '<strong>Vom Bahnhof B</strong><br />Nehmen Sie die U-Bahn U5 vom Bahnhof B, die am Suedausgang des Bahnhofs abfaehrt, und bleiben Sie 6 Haltestellen sitzen, bis Sie die Haltestelle "Marktplatz" erreichen. Die geschaetzte Fahrtdauer betraegt 10 Minuten.',
        '<strong>Vom Bahnhof C</strong><br />Nehmen Sie die S-Tram S3 vom Bahnhof C und bleiben Sie 4 Haltestellen sitzen, bis Sie die Haltestelle "Platz C" erreichen. Wechseln Sie dort die Bahn und steigen Sie in die S2 um. Fahren Sie mit ihr noch 2 Haltestellen bis zum "Marktplatz". Die geschaetzte Fahrtdauer betraegt 15 Minuten.',
      ],
      statementEn: 'On the journey from train station C, you are required to change trams at the stop "Square C" and to take the S-Tram S2 from there.',
      statementDe: 'Auf der Fahrt vom Bahnhof C muessen Sie an der Haltestelle "Platz C" umsteigen und dort die S-Tram S2 nehmen.',
      answer: 'True',
      explanation: 'Those steps are stated directly in the route from train station C.',
      explanationDe: 'Diese Schritte stehen direkt in der Wegbeschreibung ab Bahnhof C.',
    }),
    buildInstructionScenario({
      variantKey: 'verbal-instruction-directions-route-b',
      titleEn: 'Directions',
      titleDe: 'Wegbeschreibung',
      paragraphsEn: [
        '<strong>From train station B</strong><br />Take the subway U5 from train station B that leaves from the south exit of the train station and stay on it for 6 stops until you get to the "market square" stop. The estimated length of the journey is 10 minutes.',
        '<strong>From train station C</strong><br />Take the S-Tram S3 from train station C and stay on it for 4 stops until you get to the "Square C" stop. Change trams there and get onto the S2. Stay on it for 2 stations until you get to the "market square" stop. The estimated length of the journey is 15 minutes.',
      ],
      paragraphsDe: [
        '<strong>Vom Bahnhof B</strong><br />Nehmen Sie die U-Bahn U5 vom Bahnhof B, die am Suedausgang des Bahnhofs abfaehrt, und bleiben Sie 6 Haltestellen sitzen, bis Sie die Haltestelle "Marktplatz" erreichen. Die geschaetzte Fahrtdauer betraegt 10 Minuten.',
        '<strong>Vom Bahnhof C</strong><br />Nehmen Sie die S-Tram S3 vom Bahnhof C und bleiben Sie 4 Haltestellen sitzen, bis Sie die Haltestelle "Platz C" erreichen. Wechseln Sie dort die Bahn und steigen Sie in die S2 um. Fahren Sie mit ihr noch 2 Haltestellen bis zum "Marktplatz". Die geschaetzte Fahrtdauer betraegt 15 Minuten.',
      ],
      statementEn: 'From train station B, you should leave the subway after 4 stops and change to the S-Tram S2.',
      statementDe: 'Vom Bahnhof B aus sollen Sie die U-Bahn nach 4 Haltestellen verlassen und in die S-Tram S2 umsteigen.',
      answer: 'False',
      explanation: 'From train station B, you stay on the U5 for 6 stops and do not change to the S2.',
      explanationDe: 'Ab Bahnhof B bleiben Sie 6 Haltestellen in der U5 und steigen nicht in die S2 um.',
    }),
    buildInstructionScenario({
      variantKey: 'verbal-instruction-mixing-tool',
      titleEn: 'Mixing',
      titleDe: 'Mischen',
      paragraphsEn: [
        'In order to mix the glue, open the green tube of pitch as well as the blue tube of hardener and empty out the two tubes into an appropriate container. When doing so, please ensure that you squeeze out everything from the tubes because the mix ratio is of high importance for the quality of the glue. Therefore, it is best to use the blue wooden spatula that comes with the tubes.',
        'Then, mix the hardener and the pitch well using the blue wooden spatula. When doing so, scrape off the spatula against the plastic foil repeatedly. Leave the glue to rest for 10 minutes in order to get the optimal result.',
        'After the 10 minutes, you can use the glue on anything you would like. When using the glue, leave it to rest for two minutes before pressing together the parts to be glued.',
      ],
      paragraphsDe: [
        'Um den Klebstoff zu mischen, oeffnen Sie sowohl die gruene Tube mit Harz als auch die blaue Tube mit Haerter und druecken Sie beide Tuben in einen geeigneten Behaelter aus. Achten Sie dabei darauf, den gesamten Inhalt aus den Tuben herauszudruecken, da das Mischungsverhaeltnis fuer die Qualitaet des Klebstoffs sehr wichtig ist. Deshalb verwenden Sie am besten den blauen Holzspatel, der den Tuben beiliegt.',
        'Mischen Sie anschliessend Haerter und Harz gruendlich mit dem blauen Holzspatel. Streifen Sie den Spatel dabei wiederholt an der Kunststofffolie ab. Lassen Sie den Klebstoff fuer ein optimales Ergebnis 10 Minuten ruhen.',
        'Nach den 10 Minuten koennen Sie den Klebstoff verwenden. Beim Verkleben lassen Sie ihn vor dem Zusammendruecken der Teile noch 2 Minuten ruhen.',
      ],
      statementEn: 'When mixing the glue, a blue wooden spatula should be used.',
      statementDe: 'Beim Mischen des Klebstoffs soll ein blauer Holzspatel verwendet werden.',
      answer: 'True',
      explanation: 'The instructions recommend the blue wooden spatula and then explicitly say to mix with it.',
      explanationDe: 'Die Anweisung empfiehlt den blauen Holzspatel und sagt anschliessend ausdruecklich, dass damit gemischt werden soll.',
    }),
    buildInstructionScenario({
      variantKey: 'verbal-instruction-mixing-material',
      titleEn: 'Mixing',
      titleDe: 'Mischen',
      paragraphsEn: [
        'In order to mix the glue, open the green tube of pitch as well as the blue tube of hardener and empty out the two tubes into an appropriate container. When doing so, please ensure that you squeeze out everything from the tubes because the mix ratio is of high importance for the quality of the glue. Therefore, it is best to use the blue wooden spatula that comes with the tubes.',
        'Then, mix the hardener and the pitch well using the blue wooden spatula. When doing so, scrape off the spatula against the plastic foil repeatedly. Leave the glue to rest for 10 minutes in order to get the optimal result.',
        'After the 10 minutes, you can use the glue on anything you would like. When using the glue, leave it to rest for two minutes before pressing together the parts to be glued.',
      ],
      paragraphsDe: [
        'Um den Klebstoff zu mischen, oeffnen Sie sowohl die gruene Tube mit Harz als auch die blaue Tube mit Haerter und druecken Sie beide Tuben in einen geeigneten Behaelter aus. Achten Sie dabei darauf, den gesamten Inhalt aus den Tuben herauszudruecken, da das Mischungsverhaeltnis fuer die Qualitaet des Klebstoffs sehr wichtig ist. Deshalb verwenden Sie am besten den blauen Holzspatel, der den Tuben beiliegt.',
        'Mischen Sie anschliessend Haerter und Harz gruendlich mit dem blauen Holzspatel. Streifen Sie den Spatel dabei wiederholt an der Kunststofffolie ab. Lassen Sie den Klebstoff fuer ein optimales Ergebnis 10 Minuten ruhen.',
        'Nach den 10 Minuten koennen Sie den Klebstoff verwenden. Beim Verkleben lassen Sie ihn vor dem Zusammendruecken der Teile noch 2 Minuten ruhen.',
      ],
      statementEn: 'When mixing the glue, a spatula made of aluminium helps with mixing up the hardener and the resin properly.',
      statementDe: 'Beim Mischen des Klebstoffs hilft ein Spatel aus Aluminium dabei, Haerter und Harz richtig zu vermischen.',
      answer: 'False',
      explanation: 'The instructions specifically refer to the blue wooden spatula, not an aluminium one.',
      explanationDe: 'In der Anweisung ist ausdruecklich vom blauen Holzspatel die Rede, nicht von einem Aluminiumspatel.',
    }),
    buildInstructionScenario({
      variantKey: 'verbal-instruction-mixing-timing',
      titleEn: 'Mixing',
      titleDe: 'Mischen',
      paragraphsEn: [
        'In order to mix the glue, open the green tube of pitch as well as the blue tube of hardener and empty out the two tubes into an appropriate container. When doing so, please ensure that you squeeze out everything from the tubes because the mix ratio is of high importance for the quality of the glue. Therefore, it is best to use the blue wooden spatula that comes with the tubes.',
        'Then, mix the hardener and the pitch well using the blue wooden spatula. When doing so, scrape off the spatula against the plastic foil repeatedly. Leave the glue to rest for 10 minutes in order to get the optimal result.',
        'After the 10 minutes, you can use the glue on anything you would like. When using the glue, leave it to rest for two minutes before pressing together the parts to be glued.',
      ],
      paragraphsDe: [
        'Um den Klebstoff zu mischen, oeffnen Sie sowohl die gruene Tube mit Harz als auch die blaue Tube mit Haerter und druecken Sie beide Tuben in einen geeigneten Behaelter aus. Achten Sie dabei darauf, den gesamten Inhalt aus den Tuben herauszudruecken, da das Mischungsverhaeltnis fuer die Qualitaet des Klebstoffs sehr wichtig ist. Deshalb verwenden Sie am besten den blauen Holzspatel, der den Tuben beiliegt.',
        'Mischen Sie anschliessend Haerter und Harz gruendlich mit dem blauen Holzspatel. Streifen Sie den Spatel dabei wiederholt an der Kunststofffolie ab. Lassen Sie den Klebstoff fuer ein optimales Ergebnis 10 Minuten ruhen.',
        'Nach den 10 Minuten koennen Sie den Klebstoff verwenden. Beim Verkleben lassen Sie ihn vor dem Zusammendruecken der Teile noch 2 Minuten ruhen.',
      ],
      statementEn: 'After mixing, the glue should be pressed together immediately with the parts, without any further waiting time.',
      statementDe: 'Nach dem Mischen soll der Klebstoff sofort mit den Teilen zusammengedrueckt werden, ohne weitere Wartezeit.',
      answer: 'False',
      explanation: 'The instructions require a 10-minute rest after mixing and then another 2-minute rest before pressing the parts together.',
      explanationDe: 'Die Anweisung verlangt zuerst 10 Minuten Ruhezeit nach dem Mischen und dann noch 2 Minuten vor dem Zusammendruecken der Teile.',
    }),
  ]

  return buildQuestion(pick(scenarios), difficulty)
}

function buildQuestion(item, difficulty) {
  const options = item.options || ['True', 'False', 'Cannot say']
  const correctIndex = options.indexOf(item.answer)
  return {
    topic: 'verbal',
    topicLabel: 'Verbal reasoning',
    variantKey: item.variantKey,
    timer: getTimerSeconds('verbal', difficulty),
    prompt: item.prompt || 'Is the statement True, False, or Cannot say?',
    visualHtml: item.visualHtml || `<div class="chart"><div><strong>Text</strong></div><div class="mt8">${item.text}</div><div class="statement"><strong>Statement:</strong> ${item.statement}</div></div>`,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex,
    explanation: item.explanation,
    pattern: item.pattern || 'Do not use real-world assumptions. Use only the text. Distinguish False from Cannot say.',
    translations: item.translations,
  }
}

function buildInstructionScenario({
  variantKey,
  titleEn,
  titleDe,
  paragraphsEn,
  paragraphsDe,
  statementEn,
  statementDe,
  answer,
  explanation,
  explanationDe,
}) {
  return {
    variantKey,
    answer,
    prompt: 'According to the instructions, is the statement true or false?',
    options: ['True', 'False'],
    visualHtml: renderInstructionHtml({
      heading: 'Understanding of basic instructions',
      title: titleEn,
      paragraphs: paragraphsEn,
      statement: statementEn,
    }),
    explanation,
    pattern: 'Follow the instructions literally. Pay attention to sequence words such as before, after, only afterwards, and mandatory.',
    translations: {
      de: {
        prompt: 'Ist die Aussage gemaess der Anweisung richtig oder falsch?',
        visualHtml: renderInstructionHtml({
          heading: 'Grundverstaendnis von Arbeitsanweisungen',
          title: titleDe,
          paragraphs: paragraphsDe,
          statement: statementDe,
          statementLabel: 'Aussage:',
        }),
        options: [
          { text: 'Richtig', plain: 'Richtig' },
          { text: 'Falsch', plain: 'Falsch' },
        ],
        explanation: explanationDe,
        pattern: 'Folgen Sie der Anweisung woertlich. Achten Sie besonders auf Reihenfolgen wie vor, nach, erst danach und verpflichtend.',
      },
    },
  }
}

function renderInstructionHtml({ heading, title, paragraphs, statement, statementLabel = 'Statement:' }) {
  return `<div class="chart"><div><strong>${heading}</strong></div><div class="mt8 center"><strong>${title}</strong></div><div class="mt8">${paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}</div><div class="statement"><strong>${statementLabel}</strong> ${statement}</div></div>`
}
