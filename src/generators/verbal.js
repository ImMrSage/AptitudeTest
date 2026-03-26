import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'

export function generateVerbal(difficulty) {
      const sets = [
        {
          text: 'All trainees must complete safety training. Some trainees also complete advanced technical training.',
          statement: 'Some trainees who completed safety training also completed advanced technical training.',
          answer: 'True',
          explanation: 'Все trainees complete safety training. Some also do advanced technical training. Значит есть trainees, которые сделали и то и другое.'
        },
        {
          text: 'No employee may enter the lab without a badge. Some visitors were given temporary badges.',
          statement: 'Some visitors may enter the lab.',
          answer: 'Cannot say',
          explanation: 'Badge is necessary, but не сказано, что anyone with a badge actually entered or may enter right now.'
        },
        {
          text: 'Only products tested in Room A were shipped on Monday. Product X was shipped on Monday.',
          statement: 'Product X was tested in Room A.',
          answer: 'True',
          explanation: 'Only A were shipped Monday means if X was shipped Monday, then X must have been tested in Room A.'
        },
        {
          text: 'Every apprentice in Team Blue passed the safety briefing. Nadia is in Team Blue.',
          statement: 'Nadia passed the safety briefing.',
          answer: 'True',
          explanation: 'If every apprentice in Team Blue passed, then Nadia passed because she is in Team Blue.'
        },
        {
          text: 'Some orders placed before noon were dispatched on Tuesday. Order 417 was placed before noon.',
          statement: 'Order 417 was dispatched on Tuesday.',
          answer: 'Cannot say',
          explanation: 'Only some orders placed before noon were dispatched Tuesday. We do not know whether order 417 was one of them.'
        },
        {
          text: 'No machine can be started unless the guard is closed. Machine R started successfully.',
          statement: 'The guard on Machine R was closed.',
          answer: 'True',
          explanation: 'The guard being closed is required for startup, so a successful start means the guard was closed.'
        }
      ];
      const item = pick(sets);
      const options = ['True', 'False', 'Cannot say'];
      const correctIndex = options.indexOf(item.answer);
      return {
        topic: 'verbal',
        topicLabel: 'Verbal reasoning',
        variantKey: `verbal-${item.statement}`,
        timer: getTimerSeconds('verbal', difficulty),
        prompt: 'Is the statement True, False, or Cannot say?',
        visualHtml: `<div class="chart"><div><strong>Text</strong></div><div class="mt8">${item.text}</div><div class="statement"><strong>Statement:</strong> ${item.statement}</div></div>`,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex,
        explanation: item.explanation,
        pattern: `Do not use real-world assumptions. Use only the text. Distinguish False from Cannot say.`
      };
    }
