import { questionSignature, questionTemplateSignature } from '../engine-core'
import { generateErrorCheck } from './errorCheck'
import { generateMechanical } from './mechanical'
import { generateNumerical, pieSvg } from './numerical'
import { generateConcentration, generateDiagrammatic, generateLogical, generatePlanning } from './reasoning'
import { generateQuantitative } from './quantitative'
import { generateVerbal } from './verbal'

export function generateSession(topic, difficulty, count, mode, lastQuestionTemplateSignature = null) {
  const list = []
  const pool = topic === 'mixed'
    ? ['numerical', 'verbal', 'logical', 'concentration', 'planning', 'quantitative', 'mechanical']
    : [topic]
  let previousTemplateSignature = lastQuestionTemplateSignature
  const usedSignatures = new Set()
  const usedTemplateSignatures = new Set()

  for (let i = 0; i < count; i++) {
    const selectedTopic = topic === 'mixed' ? pool[i % pool.length] : pool[0]
    let question = generateQuestion(selectedTopic, difficulty, mode)
    let signature = questionSignature(question)
    let templateSignature = questionTemplateSignature(question)

    for (let attempt = 0; attempt < 48 && (
      usedSignatures.has(signature) ||
      templateSignature === previousTemplateSignature ||
      usedTemplateSignatures.has(templateSignature)
    ); attempt++) {
      question = generateQuestion(selectedTopic, difficulty, mode)
      signature = questionSignature(question)
      templateSignature = questionTemplateSignature(question)
    }

    previousTemplateSignature = templateSignature
    usedSignatures.add(signature)
    usedTemplateSignatures.add(templateSignature)
    list.push({ ...question, id: `${question.topic}-${Date.now()}-${i}` })
  }

  return list
}

export function generateQuestion(topic, difficulty, mode) {
  switch (topic) {
    case 'numerical': return generateNumerical(difficulty, mode)
    case 'verbal': return generateVerbal(difficulty, mode)
    case 'logical': return generateLogical(difficulty, mode)
    case 'concentration': return generateConcentration(difficulty, mode)
    case 'planning': return generatePlanning(difficulty, mode)
    case 'quantitative': return generateQuantitative(difficulty, mode)
    case 'mechanical': return generateMechanical(difficulty, mode)
    case 'mixed': return generateQuantitative(difficulty, mode)
    default: return generateNumerical(difficulty, mode)
  }
}

export {
  generateConcentration,
  generateDiagrammatic,
  generateErrorCheck,
  generateLogical,
  generateMechanical,
  generateNumerical,
  generatePlanning,
  generateQuantitative,
  generateVerbal,
  pieSvg,
}

