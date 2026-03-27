import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'

export function generateAssessmentDayNumerical(difficulty) {
  const families = difficulty === 'easy'
    ? ['share-index', 'car-data', 'eastern-sales']
    : ['share-index', 'car-data', 'legal-it', 'sales-turnover', 'stacked-profits', 'eastern-sales']

  const family = pick(families)
  if (family === 'share-index') return numericalShareIndexes(difficulty)
  if (family === 'car-data') return numericalCarData(difficulty)
  if (family === 'legal-it') return numericalLegalIT(difficulty)
  if (family === 'sales-turnover') return numericalSalesTurnover(difficulty)
  if (family === 'stacked-profits') return numericalStackedProfits(difficulty)
  return numericalEasternSales(difficulty)
}

export function numericalShareIndexes(difficulty) {
  const companies = ['Huver Co.', 'Drebs Ltd', 'Fevs Plc', 'Fauvers', 'Steapars']
  const today = [randInt(1020, 1280), randInt(14, 26), randInt(1380, 1760), randInt(460, 620), randInt(2280, 2680)]
  const maxPrice = today.map((value, index) => value + [randInt(140, 260), randInt(4, 8), randInt(220, 420), randInt(90, 180), randInt(110, 240)][index])
  const minPrice = today.map((value, index) => Math.max(8, value - [randInt(180, 340), randInt(3, 7), randInt(200, 380), randInt(45, 95), randInt(130, 260)][index]))
  const dayChange = [pick([1.1, 0.9, -0.6]), pick([0.5, -0.4, 0.7]), pick([-9.0, -4.5, 2.4]), pick([-1.0, 1.2, 1.8]), pick([1.0, 1.5, -0.7])]
  const interimDividend = [0.83, 0.44, 0.34, 0.09, 0.48].map(value => round2(value + pick([-0.08, -0.04, 0, 0.04, 0.08])))
  const finalDividend = [1.75, 1.12, 1.25, 0.32, 0.96].map(value => round2(value + pick([-0.12, -0.06, 0, 0.06, 0.12])))
  const annualDividend = companies.map((_, index) => round2(interimDividend[index] + finalDividend[index]))
  const family = pick(difficulty === 'easy' ? ['range', 'backsolve'] : ['range', 'backsolve', 'yield'])

  if (family === 'range') {
    const ranges = companies.map((_, index) => maxPrice[index] - minPrice[index])
    const winner = companies[ranges.indexOf(Math.max(...ranges))]
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      variantKey: 'numerical-share-range',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: 'Which share had the largest difference between highest and lowest price over the last 12 months?',
      visualHtml: renderShareIndexCard(companies, today, dayChange, maxPrice, minPrice, interimDividend, finalDividend),
      options: companies.map(text => ({ text, plain: text })),
      correctIndex: companies.indexOf(winner),
      explanation: 'Compute the 12-month range for each company and compare the values.',
      explanationHtml: `<div class="formula-block">${companies.map((company, index) => `<div class="formula-line">${company}: ${formatInt(maxPrice[index])} - ${formatInt(minPrice[index])} = ${formatInt(ranges[index])}</div>`).join('')}</div><div class="formula-line">Largest range = ${winner}</div>`,
      pattern: 'Range = maximum - minimum.'
    }
  }

  if (family === 'backsolve') {
    const index = randInt(0, companies.length - 1)
    const increasePct = pick([20, 25, 40, 50])
    const previousPrice = round2(today[index] / (1 + increasePct / 100))
    const options = uniqueNumbers([
      previousPrice,
      round2(today[index] / (1 + (increasePct - 5) / 100)),
      round2(today[index] / (1 + (increasePct + 10) / 100)),
      round2(today[index] * (1 - increasePct / 100)),
      round2(today[index] / (increasePct / 10)),
    ])
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      variantKey: 'numerical-share-backsolve',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `Today's ${companies[index]} share price represents a ${increasePct}% increase on the price one month ago. What was the share price a month ago?`,
      visualHtml: renderShareIndexCard(companies, today, dayChange, maxPrice, minPrice, interimDividend, finalDividend),
      options: options.map(value => ({ text: `EUR ${value.toFixed(2)}`, plain: `EUR ${value.toFixed(2)}` })),
      correctIndex: options.indexOf(previousPrice),
      explanation: 'Reverse a percentage increase by dividing the current price by 1 plus the increase rate.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">Current = previous x (1 + ${increasePct}/100)</div><div class="formula-line">Previous = ${formatInt(today[index])} / ${(1 + increasePct / 100).toFixed(2)}</div><div class="formula-line">Previous = EUR ${previousPrice.toFixed(2)}</div></div>`,
      pattern: 'Undo percentage increase by dividing by 1 + p.'
    }
  }

  const yields = companies.map((_, index) => annualDividend[index] / today[index] * 100)
  const bestYield = companies[yields.indexOf(Math.max(...yields))]
  return {
    topic: 'numerical',
    topicLabel: 'Numerical reasoning',
    variantKey: 'numerical-share-yield',
    timer: getTimerSeconds('numerical', difficulty),
    prompt: 'Which company has the highest annual dividend yield relative to today\'s price?',
    visualHtml: renderShareIndexCard(companies, today, dayChange, maxPrice, minPrice, interimDividend, finalDividend),
    options: companies.map(text => ({ text, plain: text })),
    correctIndex: companies.indexOf(bestYield),
    explanation: 'Dividend yield = annual dividend per share divided by current share price.',
    explanationHtml: `<div class="formula-block">${companies.map((company, index) => `<div class="formula-line">${company}: (${interimDividend[index].toFixed(2)} + ${finalDividend[index].toFixed(2)}) / ${formatInt(today[index])} = ${yields[index].toFixed(2)}%</div>`).join('')}</div><div class="formula-line">Highest yield = ${bestYield}</div>`,
    pattern: 'Yield compares annual dividend to current price.'
  }
}

export function numericalCarData(difficulty) {
  const cars = ['Taber', 'Ursa', 'Velvo', 'Tink', 'Xtam']
  const city = [48, 40, 35, 34, 33]
  const motorway = [45, 45, 34, 30, 34]
  const maxSpeed = [65, 60, 125, 95, 110]
  const price = [12500, 15250, 37500, 55250, 62500]
  const family = pick(['fuel-annual', 'budget-pair', 'fuel-cost'])

  if (family === 'fuel-annual') {
    const index = randInt(0, cars.length - 1)
    const monthlyMiles = pick([3600, 4250, 4500, 4800])
    const annualGallons = Math.round((monthlyMiles * 12) / motorway[index])
    const options = uniqueNumbers([annualGallons, annualGallons + 15, annualGallons - 20, Math.round((monthlyMiles * 12) / city[index]), Math.round(monthlyMiles / motorway[index])].filter(value => value > 0))
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      variantKey: 'numerical-car-fuel-annual',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `If a driver travels an average of ${formatInt(monthlyMiles)} miles per month driving only along motorways in an ${cars[index]} car, what is the predicted annual fuel consumption in gallons?`,
      visualHtml: renderCarDataCard(cars, city, motorway, maxSpeed, price),
      options: options.map(value => ({ text: formatInt(value), plain: formatInt(value) })),
      correctIndex: options.indexOf(annualGallons),
      explanation: 'Use motorway mpg because the route is motorway only.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">Annual miles = ${formatInt(monthlyMiles)} x 12 = ${formatInt(monthlyMiles * 12)}</div><div class="formula-line">Gallons = ${formatInt(monthlyMiles * 12)} / ${motorway[index]} = ${formatInt(annualGallons)}</div></div>`,
      pattern: 'Fuel used = annual miles / mpg.'
    }
  }

  if (family === 'budget-pair') {
    const budget = pick([480000, 540000, 600000, 660000])
    const pairCost = price[0] + price[1]
    const maxPairs = Math.floor(budget / pairCost)
    const options = uniqueNumbers([maxPairs, maxPairs + 2, maxPairs - 2, Math.floor(budget / price[0]), Math.floor(budget / price[1])].filter(value => value > 0))
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      variantKey: 'numerical-car-budget-pair',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `A car dealership has GBP ${formatInt(budget)} to spend and wants to buy equal numbers of the Taber and Ursa cars. What is the largest number of each type that can be ordered?`,
      visualHtml: renderCarDataCard(cars, city, motorway, maxSpeed, price),
      options: options.map(value => ({ text: String(value), plain: String(value) })),
      correctIndex: options.indexOf(maxPairs),
      explanation: 'Equal numbers means evaluating the cost of one matching pair first.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">One pair = ${formatInt(price[0])} + ${formatInt(price[1])} = ${formatInt(pairCost)}</div><div class="formula-line">Largest number of pairs = ${formatInt(budget)} / ${formatInt(pairCost)} = ${maxPairs}</div></div>`,
      pattern: 'For equal purchases, price the pair first.'
    }
  }

  const index = randInt(0, cars.length - 1)
  const annualMiles = pick([18000, 20000, 24000])
  const fuelPrice = pick([4.2, 4.5, 4.8])
  const annualCost = round2((annualMiles / city[index]) * fuelPrice)
  const options = uniqueNumbers([annualCost, round2((annualMiles / motorway[index]) * fuelPrice), round2(annualCost + 160), round2(annualCost - 120), round2((annualMiles / city[index]) * (fuelPrice + 0.4))].filter(value => value > 0))
  return {
    topic: 'numerical',
    topicLabel: 'Numerical reasoning',
    variantKey: 'numerical-car-fuel-cost',
    timer: getTimerSeconds('numerical', difficulty),
    prompt: `An ${cars[index]} covers ${formatInt(annualMiles)} city-driving miles per year. If fuel costs USD ${fuelPrice.toFixed(2)} per gallon, what is the annual fuel cost?`,
    visualHtml: renderCarDataCard(cars, city, motorway, maxSpeed, price),
    options: options.map(value => ({ text: `USD ${value.toFixed(2)}`, plain: `USD ${value.toFixed(2)}` })),
    correctIndex: options.indexOf(annualCost),
    explanation: 'Use the city-driving mpg because the trip is city only.',
    explanationHtml: `<div class="formula-block"><div class="formula-line">Gallons = ${formatInt(annualMiles)} / ${city[index]} = ${(annualMiles / city[index]).toFixed(2)}</div><div class="formula-line">Annual cost = ${(annualMiles / city[index]).toFixed(2)} x ${fuelPrice.toFixed(2)} = USD ${annualCost.toFixed(2)}</div></div>`,
    pattern: 'Choose the correct mpg column before multiplying by fuel price.'
  }
}
export function numericalLegalIT(difficulty) {
  const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5 projection']
  const hardware = [30, 45, 35, 40, 45]
  const software = [20, 30, 15, 25, 30]
  const consulting = [10, 20, 15, 15, 20]
  const makeFit = [290, 180, 260, 320]
  const pureGap = [230, 310, 300, 290]
  const family = pick(['year6-total', 'false-statement'])

  if (family === 'year6-total') {
    const incHardware = hardware[4] - hardware[3]
    const incSoftware = software[4] - software[3]
    const incConsulting = consulting[4] - consulting[3]
    const year6Total = hardware[4] + incHardware + software[4] + incSoftware + consulting[4] + incConsulting
    const options = uniqueNumbers([year6Total, year6Total - 10, year6Total + 10, hardware[4] + software[4] + consulting[4], year6Total + 15])
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      variantKey: 'numerical-legal-year6-total',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: 'Legal sector spending on IT hardware, IT software and IT consulting are all set to increase in Year 6 by the same amounts as from Year 4 to Year 5. What would be the total legal sector spending in Year 6 on these three IT areas combined?',
      visualHtml: renderLegalSectorCard(years, hardware, software, consulting, makeFit, pureGap),
      options: options.map(value => ({ text: `GBP ${formatInt(value)} million`, plain: `GBP ${formatInt(value)} million` })),
      correctIndex: options.indexOf(year6Total),
      explanation: 'Project each category forward by repeating the Year 4 to Year 5 increase once more.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">Hardware Year 6 = ${hardware[4]} + (${hardware[4]} - ${hardware[3]}) = ${hardware[4] + incHardware}</div><div class="formula-line">Software Year 6 = ${software[4]} + (${software[4]} - ${software[3]}) = ${software[4] + incSoftware}</div><div class="formula-line">Consulting Year 6 = ${consulting[4]} + (${consulting[4]} - ${consulting[3]}) = ${consulting[4] + incConsulting}</div><div class="formula-line">Total Year 6 = ${year6Total}</div></div>`,
      pattern: 'Project each series first, then add them.'
    }
  }

  const statements = [
    `IT consulting will increase by GBP ${consulting[4] - consulting[3]} million.`,
    `IT consulting in Year 5 matches that of Year 2.`,
    `IT software will exceed IT consulting in Year 5.`,
    'Spending on IT hardware will decline.',
    'Total IT spending will increase from Year 4 to Year 5.',
  ]
  const truth = [true, consulting[4] === consulting[1], software[4] > consulting[4], hardware[4] < hardware[3], hardware[4] + software[4] + consulting[4] > hardware[3] + software[3] + consulting[3]]
  const falseIndex = truth.indexOf(false)
  return {
    topic: 'numerical',
    topicLabel: 'Numerical reasoning',
    variantKey: 'numerical-legal-false-statement',
    timer: getTimerSeconds('numerical', difficulty),
    prompt: 'Which of the following statements is false regarding legal sector spending between Year 4 and projected Year 5?',
    visualHtml: renderLegalSectorCard(years, hardware, software, consulting, makeFit, pureGap),
    options: statements.map(text => ({ text, plain: text })),
    correctIndex: falseIndex,
    explanation: 'Check each statement directly against the Year 4 and Year 5 chart values.',
    explanationHtml: `<div class="formula-block"><div class="formula-line">Hardware: ${hardware[3]} -> ${hardware[4]}</div><div class="formula-line">Software: ${software[3]} -> ${software[4]}</div><div class="formula-line">Consulting: ${consulting[3]} -> ${consulting[4]}</div></div><div class="formula-line">Only option ${String.fromCharCode(65 + falseIndex)} conflicts with the data.</div>`,
    pattern: 'Validate each statement against the actual chart values.'
  }
}

export function numericalSalesTurnover(difficulty) {
  const taxRate = pick([0.12, 0.14, 0.16])
  const salesActual = randStep(245000, 310000, 250)
  const labourActual = randStep(150000, 180000, 250)
  const otherActual = randStep(28000, 42000, 250)
  const salesTaxActual = Math.round(salesActual * taxRate)
  const netActual = salesActual - salesTaxActual
  const grossActual = netActual - labourActual - otherActual
  const salesTarget = salesActual + randStep(28000, 62000, 250)
  const salesTaxTarget = Math.round(salesTarget * taxRate)
  const netTarget = salesTarget - salesTaxTarget
  const labourTarget = labourActual + randStep(4000, 12000, 250)
  const otherTarget = otherActual + randStep(2000, 7000, 250)
  const grossTarget = netTarget - labourTarget - otherTarget
  const family = pick(['target-turnover', 'labour-replacement'])

  if (family === 'target-turnover') {
    const growthPct = pick([1.5, 2.0, 2.5])
    const desiredGross = round2(grossActual * (1 + growthPct / 100))
    const requiredNet = desiredGross + labourActual + otherActual
    const requiredSales = Math.round(requiredNet / (1 - taxRate))
    const options = uniqueNumbers([requiredSales, requiredSales - 3250, requiredSales + 4250, Math.round(requiredNet), salesActual + Math.round(desiredGross - grossActual)])
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      variantKey: 'numerical-sales-target-turnover',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `A company aims to grow monthly gross profit by ${growthPct.toFixed(1)}%. If all costs remain constant, what will the sales turnover need to be next month to hit the target?`,
      visualHtml: renderSalesTurnoverCard(taxRate, salesActual, salesTaxActual, netActual, labourActual, otherActual, grossActual, salesTarget, salesTaxTarget, netTarget, labourTarget, otherTarget, grossTarget),
      options: options.map(value => ({ text: `GBP ${formatInt(value)}`, plain: `GBP ${formatInt(value)}` })),
      correctIndex: options.indexOf(requiredSales),
      explanation: 'Work backwards from target gross profit to net turnover, then remove the effect of sales tax.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">Target gross profit = ${formatInt(grossActual)} x ${(1 + growthPct / 100).toFixed(3)} = ${formatInt(desiredGross)}</div><div class="formula-line">Required net turnover = ${formatInt(desiredGross)} + ${formatInt(labourActual)} + ${formatInt(otherActual)} = ${formatInt(requiredNet)}</div><div class="formula-line">Required sales turnover = ${formatInt(requiredNet)} / ${(1 - taxRate).toFixed(2)} = ${formatInt(requiredSales)}</div></div>`,
      pattern: 'Target profit -> target net -> target sales.'
    }
  }

  const employees = 80
  const replaced = pick([15, 20, 25])
  const interimSalary = pick([2800, 3000, 3200])
  const permanentSalary = labourActual / employees
  const oldCost = replaced * permanentSalary
  const newCost = replaced * interimSalary
  const delta = Math.round(newCost - oldCost)
  const correctText = `${delta > 0 ? 'Increase' : 'Decrease'} of GBP ${formatInt(Math.abs(delta))}`
  const options = shuffle(uniqueTextOptions([
    correctText,
    `Decrease of GBP ${formatInt(Math.abs(oldCost))}`,
    `Increase of GBP ${formatInt(newCost)}`,
    `Increase of GBP ${formatInt(Math.abs(delta) + 4000)}`,
    'Cannot tell',
  ]))
  return {
    topic: 'numerical',
    topicLabel: 'Numerical reasoning',
    variantKey: 'numerical-sales-labour-replacement',
    timer: getTimerSeconds('numerical', difficulty),
    prompt: `If the company employed ${employees} permanent employees who were on the same salary, what would have been the effect on labour costs if ${replaced} permanent employees had been replaced by interim staff each on monthly salaries of GBP ${formatInt(interimSalary)}?`,
    visualHtml: renderSalesTurnoverCard(taxRate, salesActual, salesTaxActual, netActual, labourActual, otherActual, grossActual, salesTarget, salesTaxTarget, netTarget, labourTarget, otherTarget, grossTarget),
    options: options.map(text => ({ text, plain: text })),
    correctIndex: options.indexOf(correctText),
    explanation: 'Find the implied permanent salary first, then compare the replaced wage bill with the interim wage bill.',
    explanationHtml: `<div class="formula-block"><div class="formula-line">Permanent salary = ${formatInt(labourActual)} / ${employees} = ${round2(permanentSalary).toFixed(2)}</div><div class="formula-line">Old cost for replaced employees = ${replaced} x ${round2(permanentSalary).toFixed(2)} = ${formatInt(oldCost)}</div><div class="formula-line">New interim cost = ${replaced} x ${formatInt(interimSalary)} = ${formatInt(newCost)}</div><div class="formula-line">Change = ${formatInt(newCost)} - ${formatInt(oldCost)} = ${delta}</div></div>`,
    pattern: 'Per-employee labour cost first, replacement impact second.'
  }
}

export function numericalStackedProfits(difficulty) {
  const sectors = ['Leisure', 'Manufacturing', 'Retail', 'Government', 'Utilities']
  const european = [5.2, 5.0, 4.4, 4.5, 3.5]
  const american = [7.4, 7.2, 5.8, 5.9, 5.1]
  const pacific = [4.6, 6.3, 3.8, 3.6, 6.2]
  const family = pick(['ratio-turnover', 'target-quarter'])

  if (family === 'ratio-turnover') {
    const index = randInt(0, sectors.length - 1)
    const turnoverHundredThousands = Math.round((pacific[index] * 15 / 2) * 10)
    const options = uniqueNumbers([turnoverHundredThousands, turnoverHundredThousands - 90, turnoverHundredThousands + 90, turnoverHundredThousands / 10, turnoverHundredThousands * 2].filter(value => value > 0))
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      variantKey: 'numerical-stacked-ratio-turnover',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `If the ratio of profit to turnover for Pacific Rim ${sectors[index]} contracts was 2:15, what was the turnover in GBP 100,000s?`,
      visualHtml: renderStackedProfitsCard(sectors, european, american, pacific),
      options: options.map(value => ({ text: String(value), plain: String(value) })),
      correctIndex: options.indexOf(turnoverHundredThousands),
      explanation: 'Scale the observed profit from the profit ratio up to the turnover ratio.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">Profit = ${pacific[index].toFixed(1)} million</div><div class="formula-line">Turnover = ${pacific[index].toFixed(1)} x 15 / 2 = ${(pacific[index] * 15 / 2).toFixed(1)} million</div><div class="formula-line">In GBP 100,000s = ${(pacific[index] * 15 / 2).toFixed(1)} x 10 = ${turnoverHundredThousands}</div></div>`,
      pattern: 'Use the full ratio to scale the profit.'
    }
  }

  const leisureTotal = european[0] + american[0] + pacific[0]
  const totalProfits = sum(european) + sum(american) + sum(pacific)
  const target = totalProfits / 4
  const missedBy = round1(target - leisureTotal)
  const options = uniqueNumbers([missedBy, round1(missedBy + 0.6), round1(missedBy + 0.9), round1(missedBy - 0.5), round1(target)].filter(value => value > 0))
  return {
    topic: 'numerical',
    topicLabel: 'Numerical reasoning',
    variantKey: 'numerical-stacked-target-quarter',
    timer: getTimerSeconds('numerical', difficulty),
    prompt: 'The company had a target for Leisure profits to be one quarter of total profits. Assuming profits in other areas remain the same, by how much did the Leisure profits miss this target?',
    visualHtml: renderStackedProfitsCard(sectors, european, american, pacific),
    options: options.map(value => ({ text: `GBP ${value.toFixed(1)} million`, plain: `GBP ${value.toFixed(1)} million` })),
    correctIndex: options.indexOf(missedBy),
    explanation: 'Total all sectors first, then take one quarter, then compare that target with Leisure.',
    explanationHtml: `<div class="formula-block"><div class="formula-line">Leisure total = ${european[0].toFixed(1)} + ${american[0].toFixed(1)} + ${pacific[0].toFixed(1)} = ${leisureTotal.toFixed(1)}</div><div class="formula-line">Total profits = ${totalProfits.toFixed(1)}</div><div class="formula-line">Target = ${totalProfits.toFixed(1)} / 4 = ${target.toFixed(1)}</div><div class="formula-line">Missed by = ${target.toFixed(1)} - ${leisureTotal.toFixed(1)} = ${missedBy.toFixed(1)}</div></div>`,
    pattern: 'Find the whole before taking the target proportion.'
  }
}

export function numericalEasternSales(difficulty) {
  const teams = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E']
  const direct = [17, 13, 16, 15, 14]
  const telesales = [16, 17, 18, 17, 18]
  const family = pick(['difference-total', 'regional-total'])

  if (family === 'difference-total') {
    const directTotal = sum(direct)
    const telesalesTotal = sum(telesales)
    const difference = Math.abs(telesalesTotal - directTotal)
    const options = uniqueNumbers([difference, difference + 1, difference + 2, difference - 1, telesalesTotal - teams.length].filter(value => value > 0))
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      variantKey: 'numerical-eastern-difference-total',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: 'What is the difference between direct sales and telesales across the five teams combined?',
      visualHtml: renderEasternSalesCard(teams, direct, telesales),
      options: options.map(value => ({ text: `GBP ${value} million`, plain: `GBP ${value} million` })),
      correctIndex: options.indexOf(difference),
      explanation: 'Sum direct sales and telesales separately, then subtract.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">Direct sales total = ${direct.join(' + ')} = ${directTotal}</div><div class="formula-line">Telesales total = ${telesales.join(' + ')} = ${telesalesTotal}</div><div class="formula-line">Difference = ${telesalesTotal} - ${directTotal} = ${difference}</div></div>`,
      pattern: 'Total by channel first, then compare.'
    }
  }

  const easternTotal = sum(direct) + sum(telesales)
  const sharePct = pick([24, 25, 26, 28])
  const allRegions = Math.round(easternTotal / (sharePct / 100))
  const options = uniqueNumbers([allRegions, allRegions - 18, allRegions + 19, easternTotal, easternTotal * 4].filter(value => value > 0))
  return {
    topic: 'numerical',
    topicLabel: 'Numerical reasoning',
    variantKey: 'numerical-eastern-regional-total',
    timer: getTimerSeconds('numerical', difficulty),
    prompt: `If the Eastern Region's total sales represent ${sharePct}% of the total for all regions, what are total sales across all regions to the nearest GBP million?`,
    visualHtml: renderEasternSalesCard(teams, direct, telesales),
    options: options.map(value => ({ text: `GBP ${value} million`, plain: `GBP ${value} million` })),
    correctIndex: options.indexOf(allRegions),
    explanation: 'Treat the Eastern Region as the known part and divide by its percentage share to recover the whole.',
    explanationHtml: `<div class="formula-block"><div class="formula-line">Eastern Region total = ${sum(direct)} + ${sum(telesales)} = ${easternTotal}</div><div class="formula-line">All regions = ${easternTotal} / ${sharePct / 100} = ${allRegions}</div></div>`,
    pattern: 'Whole = part / percentage.'
  }
}

function renderShareIndexCard(companies, today, dayChange, maxPrice, minPrice, interimDividend, finalDividend) {
  return `${renderTable('Share Price Index', ['Company', 'Today\'s price (EUR)', 'Change from previous day (%)', 'Past 12 months max price (EUR)', 'Past 12 months min price (EUR)'], companies.map((company, index) => [company, formatInt(today[index]), `<span style="color:${dayChange[index] < 0 ? '#dc2626' : '#111827'};font-weight:700;">${dayChange[index].toFixed(2)}</span>`, formatInt(maxPrice[index]), formatInt(minPrice[index])]))}<div style="height:14px"></div>${renderTable('Dividend Index', ['Dividend paid per share (EUR)', ...companies], [['Interim dividend', ...interimDividend.map(value => value.toFixed(2))], ['Final dividend', ...finalDividend.map(value => value.toFixed(2))]], 'Note: annual dividend per share = interim dividend + final dividend.')}`
}

function renderCarDataCard(cars, city, motorway, maxSpeed, price) {
  return `<div class="chart" style="padding:14px 18px;"><div class="center" style="font-size:16px;font-weight:800;color:#111827;">Fuel Consumption (miles to the gallon)</div>${renderGroupedBarSvg(cars, [city, motorway], ['City driving', 'Motorway driving'], ['#93c5fd', '#1d4ed8'], 50, 5)}</div><div style="height:14px"></div>${renderTable('Car data', ['Car', 'Max speed (mph)', 'Cost to purchase (GBP)'], cars.map((car, index) => [car, String(maxSpeed[index]), formatInt(price[index])] ))}`
}

function renderLegalSectorCard(years, hardware, software, consulting, makeFit, pureGap) {
  return `<div class="chart" style="padding:14px 18px;"><div class="center" style="font-size:16px;font-weight:800;color:#111827;">Legal Sector IT Spending (GBP millions)</div>${renderGroupedBarSvg(years, [hardware, software, consulting], ['IT Hardware', 'IT Software', 'IT Consulting'], ['#f97316', '#0ea5e9', '#4b5563'], 50, 10)}</div><div style="height:14px"></div>${renderTable('Two firms\' consultancy income (10,000s)', ['Year', 'Make Fit Ltd', 'Pure Gap Plc'], years.slice(0, 4).map((year, index) => [year, String(makeFit[index]), String(pureGap[index])]))}`
}

function renderSalesTurnoverCard(taxRate, salesActual, salesTaxActual, netActual, labourActual, otherActual, grossActual, salesTarget, salesTaxTarget, netTarget, labourTarget, otherTarget, grossTarget) {
  return renderTable('January sales turnover and profit', ['Metric', 'Actual', 'Target'], [['Sales turnover', formatInt(salesActual), formatInt(salesTarget)], [`Sales tax (${Math.round(taxRate * 100)}%)`, formatInt(salesTaxActual), formatInt(salesTaxTarget)], ['Net turnover', formatInt(netActual), formatInt(netTarget)], ['Labour costs', formatInt(labourActual), formatInt(labourTarget)], ['Other costs', formatInt(otherActual), formatInt(otherTarget)], ['Gross profit', formatInt(grossActual), formatInt(grossTarget)]])
}

function renderStackedProfitsCard(sectors, european, american, pacific) {
  return `<div class="chart" style="padding:14px 18px;"><div class="center" style="font-size:16px;font-weight:800;color:#111827;">Consulting profits (GBP millions)</div>${renderStackedBarSvg(sectors, [european, american, pacific], ['European', 'American', 'Pacific Rim'], ['#4b5563', '#1e3a8a', '#84cc16'], 20, 5)}</div>`
}

function renderEasternSalesCard(teams, direct, telesales) {
  return `<div class="chart" style="padding:14px 18px;"><div class="center" style="font-size:16px;font-weight:800;color:#111827;">Eastern Region sales - current year</div>${renderGroupedBarSvg(teams, [direct, telesales], ['Direct sales', 'Telesales'], ['#a3a3a3', '#4f86c6'], 20, 2)}</div>`
}

function renderTable(title, columns, rows, note = '') {
  return `<div class="chart" style="padding:14px 18px;"><div class="center" style="font-size:16px;font-weight:800;color:#111827;">${title}</div><table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;color:#111827;"><thead><tr>${columns.map(column => `<th style="background:#2f2f39;color:#f8fafc;border:2px solid #ffffff;padding:8px 6px;font-weight:700;text-align:center;">${column}</th>`).join('')}</tr></thead><tbody>${rows.map((row, rowIndex) => `<tr>${row.map(cell => `<td style="background:${rowIndex % 2 === 0 ? '#ffffff' : '#e5e7eb'};border:2px solid #ffffff;padding:8px 6px;text-align:center;font-weight:500;">${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>${note ? `<div style="margin-top:10px;font-size:13px;color:#475569;font-style:italic;">${note}</div>` : ''}</div>`
}

function renderGroupedBarSvg(categories, seriesValues, legendLabels, colors, yMax, yStep) {
  const width = 620
  const height = 280
  const left = 56
  const right = 20
  const top = 24
  const bottom = 44
  const plotWidth = width - left - right
  const plotHeight = height - top - bottom
  const groupWidth = plotWidth / categories.length
  const barWidth = Math.min(28, groupWidth / (seriesValues.length + 1))
  const lines = []
  for (let value = 0; value <= yMax; value += yStep) {
    const y = top + plotHeight - (value / yMax) * plotHeight
    lines.push(`<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="#cbd5e1" stroke-width="1" />`)
    lines.push(`<text x="${left - 8}" y="${y + 4}" font-size="11" text-anchor="end" fill="#475569">${value}</text>`)
  }
  const bars = categories.map((category, categoryIndex) => {
    const startX = left + categoryIndex * groupWidth + groupWidth / 2 - (seriesValues.length * barWidth + (seriesValues.length - 1) * 6) / 2
    const currentBars = seriesValues.map((series, seriesIndex) => {
      const value = series[categoryIndex]
      const barHeight = (value / yMax) * plotHeight
      const x = startX + seriesIndex * (barWidth + 6)
      const y = top + plotHeight - barHeight
      return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${colors[seriesIndex]}" rx="2" />`
    }).join('')
    return `${currentBars}<text x="${left + categoryIndex * groupWidth + groupWidth / 2}" y="${height - 10}" font-size="12" text-anchor="middle" fill="#111827">${category}</text>`
  }).join('')
  const legend = legendLabels.map((label, index) => `<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#111827;"><span style="display:inline-block;width:12px;height:12px;background:${colors[index]};"></span>${label}</div>`).join('')
  return `<div style="display:flex;justify-content:flex-end;gap:16px;margin:10px 0 6px;flex-wrap:wrap;">${legend}</div><svg viewBox="0 0 ${width} ${height}" width="100%" height="280" role="img">${lines.join('')}<line x1="${left}" y1="${top + plotHeight}" x2="${width - right}" y2="${top + plotHeight}" stroke="#111827" stroke-width="1.5" />${bars}</svg>`
}

function renderStackedBarSvg(categories, stackSeries, legendLabels, colors, yMax, yStep) {
  const width = 620
  const height = 290
  const left = 56
  const right = 20
  const top = 24
  const bottom = 44
  const plotWidth = width - left - right
  const plotHeight = height - top - bottom
  const groupWidth = plotWidth / categories.length
  const barWidth = Math.min(56, groupWidth * 0.58)
  const lines = []
  for (let value = 0; value <= yMax; value += yStep) {
    const y = top + plotHeight - (value / yMax) * plotHeight
    lines.push(`<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="#cbd5e1" stroke-width="1" />`)
    lines.push(`<text x="${left - 8}" y="${y + 4}" font-size="11" text-anchor="end" fill="#475569">${value}</text>`)
  }
  const bars = categories.map((category, categoryIndex) => {
    const x = left + categoryIndex * groupWidth + (groupWidth - barWidth) / 2
    let currentY = top + plotHeight
    const segments = stackSeries.map((series, seriesIndex) => {
      const value = series[categoryIndex]
      const segmentHeight = (value / yMax) * plotHeight
      const y = currentY - segmentHeight
      currentY = y
      return `<rect x="${x}" y="${y}" width="${barWidth}" height="${segmentHeight}" fill="${colors[seriesIndex]}" /><text x="${x + barWidth / 2}" y="${y + segmentHeight / 2 + 4}" font-size="10" text-anchor="middle" fill="#ffffff">${value.toFixed(1)}</text>`
    }).join('')
    return `${segments}<text x="${x + barWidth / 2}" y="${height - 10}" font-size="12" text-anchor="middle" fill="#111827">${category}</text>`
  }).join('')
  const legend = legendLabels.map((label, index) => `<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#111827;"><span style="display:inline-block;width:12px;height:12px;background:${colors[index]};"></span>${label}</div>`).join('')
  return `<div style="display:flex;justify-content:flex-end;gap:16px;margin:10px 0 6px;flex-wrap:wrap;">${legend}</div><svg viewBox="0 0 ${width} ${height}" width="100%" height="290" role="img">${lines.join('')}<line x1="${left}" y1="${top + plotHeight}" x2="${width - right}" y2="${top + plotHeight}" stroke="#111827" stroke-width="1.5" />${bars}</svg>`
}

function uniqueNumbers(values) {
  const result = []
  values.forEach(value => {
    const normalized = Math.abs(value - Math.round(value)) < 0.0001 ? Math.round(value) : round2(value)
    if (!result.includes(normalized)) result.push(normalized)
  })
  return result.slice(0, 5)
}

function uniqueTextOptions(values) {
  const result = []
  values.forEach(value => {
    if (!result.includes(value)) result.push(value)
  })
  return result.slice(0, 5)
}

function randStep(min, max, step) {
  const slots = Math.floor((max - min) / step)
  return min + randInt(0, slots) * step
}

function formatInt(value) {
  return Math.round(value).toLocaleString('en-US')
}

function round1(value) {
  return Math.round(value * 10) / 10
}

function round2(value) {
  return Math.round(value * 100) / 100
}

function sum(values) {
  return values.reduce((acc, value) => acc + value, 0)
}



