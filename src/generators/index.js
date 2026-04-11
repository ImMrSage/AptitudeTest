import { questionFamilySignature, questionSignature, questionTemplateSignature } from '../engine-core'
import { generateErrorCheck } from './errorCheck'
import { generateGerman } from './german'
import { generateMechanical } from './mechanical'
import { generateNumerical, pieSvg } from './numerical'
import { generateConcentration, generateDiagrammatic, generateLogical, generatePlanning } from './reasoning'
import { generateQuantitative } from './quantitative'
import { generateVerbal } from './verbal'

export function generateSession(topic, difficulty, count, mode, lastQuestionTemplateSignature = null, language = 'en') {
  const list = []
  const pool = topic === 'mixed'
    ? ['numerical', 'verbal', 'logical', 'concentration', 'planning', 'quantitative', 'mechanical']
    : [topic]
  let previousTemplateSignature = lastQuestionTemplateSignature
  const usedSignatures = new Set()
  const usedTemplateSignatures = new Set()
  const usedFamilySignatures = new Set()
  const familyHistory = []

  for (let i = 0; i < count; i++) {
    const selectedTopic = topic === 'mixed' ? pool[i % pool.length] : pool[0]
    const familyLimit = getFamilyLimit(selectedTopic, difficulty)
    const cooldownWindow = selectedTopic === 'numerical' ? 6 : 2
    let question = generateQuestion(selectedTopic, difficulty, mode, language)
    let signature = questionSignature(question)
    let templateSignature = questionTemplateSignature(question)
    let familySignature = questionFamilySignature(question)

    for (let attempt = 0; attempt < 320 && (
      usedSignatures.has(signature) ||
      templateSignature === previousTemplateSignature ||
      usedTemplateSignatures.has(templateSignature) ||
      (usedFamilySignatures.size < familyLimit && usedFamilySignatures.has(familySignature)) ||
      familyHistory.slice(-cooldownWindow).includes(familySignature)
    ); attempt++) {
      question = generateQuestion(selectedTopic, difficulty, mode, language)
      signature = questionSignature(question)
      templateSignature = questionTemplateSignature(question)
      familySignature = questionFamilySignature(question)
    }

    previousTemplateSignature = templateSignature
    usedSignatures.add(signature)
    usedTemplateSignatures.add(templateSignature)
    usedFamilySignatures.add(familySignature)
    familyHistory.push(familySignature)
    list.push({ ...question, id: `${question.topic}-${Date.now()}-${i}` })
  }

  return list
}

export function generateQuestion(topic, difficulty, mode, language = 'en') {
  switch (topic) {
    case 'numerical': return generateNumerical(difficulty, mode)
    case 'verbal': return generateVerbal(difficulty, mode)
    case 'logical': return generateLogical(difficulty, mode)
    case 'concentration': return generateConcentration(difficulty, mode)
    case 'planning': return generatePlanning(difficulty, mode)
    case 'german': return generateGerman(difficulty, mode)
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
  generateGerman,
  generateLogical,
  generateMechanical,
  generateNumerical,
  generatePlanning,
  generateQuantitative,
  generateVerbal,
  pieSvg,
}

function getFamilyLimit(topic, difficulty) {
  if (topic === 'numerical') {
    return difficulty === 'easy' ? 10 : 14
  }
  return Number.POSITIVE_INFINITY
}
