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
  const shareTheme = pick(SHARE_THEMES)
  const companies = shuffle([...shareTheme.names])
  const priceBands = [
    [980, 1320],
    [14, 28],
    [1320, 1820],
    [430, 680],
    [2210, 2740],
  ]
  const today = priceBands.map(([min, max]) => randInt(min, max))

  const rangeWinnerIndex = randInt(0, companies.length - 1)
  const winnerRange = pick([18, 24, 32, 45, 60, 80, 110, 150, 210, 280, 360, 480])
  const targetRanges = companies.map((_, index) => {
    if (index === rangeWinnerIndex) return winnerRange
    const upperCap = Math.max(2, winnerRange - pick([2, 3, 4, 5, 6, 8, 10, 12]))
    return randInt(1, upperCap)
  })

  const maxPrice = []
  const minPrice = []
  targetRanges.forEach((totalRange, index) => {
    const safeRange = Math.min(totalRange, Math.max(2, today[index] - 1 + Math.round(today[index] * 0.35)))
    const upperShare = pick([0.35, 0.4, 0.45, 0.5, 0.55, 0.6])
    const upperMove = Math.max(1, Math.round(safeRange * upperShare))
    const lowerMove = Math.max(1, safeRange - upperMove)
    maxPrice.push(today[index] + upperMove)
    minPrice.push(Math.max(1, today[index] - lowerMove))
  })

  const dayChange = companies.map(() => round2(pick([-9, -6, -4.5, -2.2, -1.1, -0.6, 0.5, 0.9, 1.2, 1.8, 2.4, 3.1])))

  const yieldWinnerIndex = randInt(0, companies.length - 1)
  const annualYieldPct = companies.map((_, index) => {
    const pct = index === yieldWinnerIndex
      ? pick([4.8, 5.2, 5.8, 6.4, 7.1])
      : pick([1.1, 1.5, 1.9, 2.2, 2.6, 3.0, 3.4, 3.8, 4.1])
    return pct
  })
  annualYieldPct[yieldWinnerIndex] = Math.max(...annualYieldPct) + pick([0.4, 0.6, 0.9])

  const annualDividend = annualYieldPct.map((pct, index) => round2(today[index] * pct / 100))
  const interimDividend = annualDividend.map(value => round2(value * pick([0.3, 0.35, 0.4, 0.45])))
  const finalDividend = annualDividend.map((value, index) => round2(value - interimDividend[index]))
  const family = pick(difficulty === 'easy' ? ['range', 'backsolve'] : ['range', 'backsolve', 'yield'])

  if (family === 'range') {
    const ranges = companies.map((_, index) => maxPrice[index] - minPrice[index])
    const winner = companies[ranges.indexOf(Math.max(...ranges))]
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      familyKey: 'numerical-share-index',
      variantKey: 'numerical-share-range',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `Which ${shareTheme.instrumentLabel} had the largest difference between highest and lowest price over the last 12 months?`,
      visualHtml: renderShareIndexCard(shareTheme, companies, today, dayChange, maxPrice, minPrice, interimDividend, finalDividend),
      options: companies.map(text => ({ text, plain: text })),
      correctIndex: companies.indexOf(winner),
      explanation: 'Compute the 12-month range for each company and compare the values.',
      explanationHtml: `<div class="formula-block">${companies.map((company, index) => `<div class="formula-line">${company}: ${formatInt(maxPrice[index])} - ${formatInt(minPrice[index])} = ${formatInt(ranges[index])}</div>`).join('')}</div><div class="formula-line">Largest range = ${winner}</div>`,
      pattern: 'Range = maximum - minimum.'
    }
  }

  if (family === 'backsolve') {
    const index = randInt(0, companies.length - 1)
    const increasePct = pick([15, 20, 25, 35, 40, 50])
    const previousPrice = round2(today[index] / (1 + increasePct / 100))
    const options = uniqueNumbers([
      previousPrice,
      round2(today[index] / (1 + (increasePct - 5) / 100)),
      round2(today[index] / (1 + (increasePct + 10) / 100)),
      round2(today[index] * (1 - increasePct / 100)),
      round2(today[index] / Math.max(1.5, increasePct / 10)),
    ])
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      familyKey: 'numerical-share-index',
      variantKey: 'numerical-share-backsolve',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `Today's ${companies[index]} ${shareTheme.instrumentLabel} represents a ${increasePct}% increase on the price one month ago. What was the price a month ago?`,
      visualHtml: renderShareIndexCard(shareTheme, companies, today, dayChange, maxPrice, minPrice, interimDividend, finalDividend),
      options: options.map(value => ({ text: `${shareTheme.currency} ${value.toFixed(2)}`, plain: `${shareTheme.currency} ${value.toFixed(2)}` })),
      correctIndex: options.indexOf(previousPrice),
      explanation: 'Reverse a percentage increase by dividing the current price by 1 plus the increase rate.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">Current = previous x (1 + ${increasePct}/100)</div><div class="formula-line">Previous = ${formatInt(today[index])} / ${(1 + increasePct / 100).toFixed(2)}</div><div class="formula-line">Previous = ${shareTheme.currency} ${previousPrice.toFixed(2)}</div></div>`,
      pattern: 'Undo percentage increase by dividing by 1 + p.'
    }
  }

  const yields = companies.map((_, index) => annualDividend[index] / today[index] * 100)
  const bestYield = companies[yields.indexOf(Math.max(...yields))]
  return {
    topic: 'numerical',
    topicLabel: 'Numerical reasoning',
    familyKey: 'numerical-share-index',
    variantKey: 'numerical-share-yield',
    timer: getTimerSeconds('numerical', difficulty),
    prompt: `Which ${shareTheme.entityLabel.toLowerCase()} has the highest annual dividend yield relative to today's ${shareTheme.instrumentLabel}?`,
    visualHtml: renderShareIndexCard(shareTheme, companies, today, dayChange, maxPrice, minPrice, interimDividend, finalDividend),
    options: companies.map(text => ({ text, plain: text })),
    correctIndex: companies.indexOf(bestYield),
    explanation: 'Dividend yield = annual dividend per share divided by current share price.',
    explanationHtml: `<div class="formula-block">${companies.map((company, index) => `<div class="formula-line">${company}: (${interimDividend[index].toFixed(2)} + ${finalDividend[index].toFixed(2)}) / ${formatInt(today[index])} = ${yields[index].toFixed(2)}%</div>`).join('')}</div><div class="formula-line">Highest yield = ${bestYield}</div>`,
    pattern: 'Yield compares annual dividend to current price.'
  }
}

export function numericalCarData(difficulty) {
  const vehicleTheme = pick(VEHICLE_THEMES)
  const cars = shuffle([...vehicleTheme.names])
  const baseProfiles = [
    { city: 48, motorway: 45, speed: 65, price: 12500 },
    { city: 40, motorway: 45, speed: 60, price: 15250 },
    { city: 35, motorway: 34, speed: 125, price: 37500 },
    { city: 34, motorway: 30, speed: 95, price: 55250 },
    { city: 33, motorway: 34, speed: 110, price: 62500 },
  ]
  const profiles = baseProfiles.map((profile, index) => {
    const city = Math.max(24, profile.city + randInt(-3, 3))
    const motorway = Math.max(city - 1, profile.motorway + randInt(-3, 4))
    const speed = Math.max(55, profile.speed + randInt(-12, 12))
    const priceShift = index < 2
      ? pick([-1250, -750, -500, 0, 500, 750, 1250])
      : index === 2
        ? pick([-3000, -2000, -1000, 0, 1000, 2000, 3000])
        : pick([-4500, -3000, -1500, 0, 1500, 3000, 4500])
    const price = Math.max(8000, profile.price + priceShift)
    return { city, motorway, speed, price }
  })
  const city = profiles.map(profile => profile.city)
  const motorway = profiles.map(profile => profile.motorway)
  const maxSpeed = profiles.map(profile => profile.speed)
  const price = profiles.map(profile => profile.price)
  const family = pick(['fuel-annual', 'budget-pair', 'fuel-cost'])

  if (family === 'fuel-annual') {
    const index = randInt(0, cars.length - 1)
    const routeType = pick(['motorway', 'city'])
    const monthlyMiles = pick([3600, 3900, 4250, 4500, 4800, 5200])
    const mpg = routeType === 'motorway' ? motorway[index] : city[index]
    const annualGallons = Math.round((monthlyMiles * 12) / mpg)
    const wrongColumnGallons = Math.round((monthlyMiles * 12) / (routeType === 'motorway' ? city[index] : motorway[index]))
    const options = uniqueNumbers([
      annualGallons,
      annualGallons + pick([12, 16, 20]),
      Math.max(1, annualGallons - pick([10, 14, 18])),
      wrongColumnGallons,
      Math.round(monthlyMiles / mpg),
    ].filter(value => value > 0))
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      familyKey: 'numerical-car-data',
      variantKey: routeType === 'motorway' ? 'numerical-car-fuel-annual-motorway' : 'numerical-car-fuel-annual-city',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `If a driver travels an average of ${formatInt(monthlyMiles)} miles per month driving only in ${routeType} conditions in a ${cars[index]} ${vehicleTheme.vehicleWord}, what is the predicted annual fuel consumption in gallons?`,
      visualHtml: renderCarDataCard(vehicleTheme, cars, city, motorway, maxSpeed, price),
      options: options.map(value => ({ text: formatInt(value), plain: formatInt(value) })),
      correctIndex: options.indexOf(annualGallons),
      explanation: `Use the ${routeType} mpg because the route is entirely ${routeType}.`,
      explanationHtml: `<div class="formula-block"><div class="formula-line">Annual miles = ${formatInt(monthlyMiles)} x 12 = ${formatInt(monthlyMiles * 12)}</div><div class="formula-line">Gallons = ${formatInt(monthlyMiles * 12)} / ${mpg} = ${formatInt(annualGallons)}</div></div>`,
      pattern: 'Fuel used = annual miles / mpg.'
    }
  }

  if (family === 'budget-pair') {
    const firstIndex = randInt(0, cars.length - 1)
    let secondIndex = randInt(0, cars.length - 1)
    while (secondIndex === firstIndex) secondIndex = randInt(0, cars.length - 1)
    const pairIndexes = [firstIndex, secondIndex].sort((a, b) => a - b)
    const pairCost = price[pairIndexes[0]] + price[pairIndexes[1]]
    const maxPairs = pick(difficulty === 'easy' ? [8, 10, 12, 14, 16] : [7, 9, 11, 13, 15, 18])
    const budget = pairCost * maxPairs + randInt(0, Math.max(1, pairCost - 1))
    const options = uniqueNumbers([
      maxPairs,
      maxPairs + 1,
      Math.max(1, maxPairs - 1),
      Math.floor(budget / price[pairIndexes[0]]),
      Math.floor(budget / price[pairIndexes[1]]),
    ].filter(value => value > 0))
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      familyKey: 'numerical-car-data',
      variantKey: 'numerical-car-budget-pair',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `A ${vehicleTheme.dealerLabel} has ${vehicleTheme.currency} ${formatInt(budget)} to spend and wants to buy equal numbers of the ${cars[pairIndexes[0]]} and ${cars[pairIndexes[1]]} ${vehicleTheme.vehiclePlural}. What is the largest number of each type that can be ordered?`,
      visualHtml: renderCarDataCard(vehicleTheme, cars, city, motorway, maxSpeed, price),
      options: options.map(value => ({ text: String(value), plain: String(value) })),
      correctIndex: options.indexOf(maxPairs),
      explanation: 'Equal numbers means evaluating the cost of one matching pair first.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">One pair = ${formatInt(price[pairIndexes[0]])} + ${formatInt(price[pairIndexes[1]])} = ${formatInt(pairCost)}</div><div class="formula-line">Largest number of pairs = floor(${formatInt(budget)} / ${formatInt(pairCost)}) = ${maxPairs}</div></div>`,
      pattern: 'For equal purchases, price the pair first.'
    }
  }

  const index = randInt(0, cars.length - 1)
  const routeType = pick(['city', 'motorway'])
  const annualMiles = pick([16000, 18000, 20000, 22000, 24000])
  const fuelPrice = pick([4.1, 4.3, 4.5, 4.8, 5.0])
  const mpg = routeType === 'city' ? city[index] : motorway[index]
  const annualCost = round2((annualMiles / mpg) * fuelPrice)
  const wrongColumnCost = round2((annualMiles / (routeType === 'city' ? motorway[index] : city[index])) * fuelPrice)
  const options = uniqueNumbers([
    annualCost,
    wrongColumnCost,
    round2(annualCost + pick([120, 160, 220])),
    round2(Math.max(1, annualCost - pick([90, 130, 170]))),
    round2((annualMiles / mpg) * (fuelPrice + 0.4)),
  ].filter(value => value > 0))
  return {
    topic: 'numerical',
    topicLabel: 'Numerical reasoning',
    familyKey: 'numerical-car-data',
    variantKey: routeType === 'city' ? 'numerical-car-fuel-cost-city' : 'numerical-car-fuel-cost-motorway',
    timer: getTimerSeconds('numerical', difficulty),
    prompt: `A ${cars[index]} ${vehicleTheme.vehicleWord} covers ${formatInt(annualMiles)} ${routeType}-driving miles per year. If fuel costs ${vehicleTheme.currency} ${fuelPrice.toFixed(2)} per gallon, what is the annual fuel cost?`,
    visualHtml: renderCarDataCard(vehicleTheme, cars, city, motorway, maxSpeed, price),
    options: options.map(value => ({ text: `${vehicleTheme.currency} ${value.toFixed(2)}`, plain: `${vehicleTheme.currency} ${value.toFixed(2)}` })),
    correctIndex: options.indexOf(annualCost),
    explanation: `Use the ${routeType} mpg because the trip is ${routeType} only.`,
    explanationHtml: `<div class="formula-block"><div class="formula-line">Gallons = ${formatInt(annualMiles)} / ${mpg} = ${(annualMiles / mpg).toFixed(2)}</div><div class="formula-line">Annual cost = ${(annualMiles / mpg).toFixed(2)} x ${fuelPrice.toFixed(2)} = ${vehicleTheme.currency} ${annualCost.toFixed(2)}</div></div>`,
    pattern: 'Choose the correct mpg column before multiplying by fuel price.'
  }
}

const SHARE_THEMES = [
  {
    names: ['Huver Co.', 'Drebs Ltd', 'Fevs Plc', 'Fauvers', 'Steapars'],
    marketTitle: 'Share Price Index',
    dividendTitle: 'Dividend Index',
    entityLabel: 'Company',
    priceLabel: 'Today\'s price',
    instrumentLabel: 'share price',
    currency: 'EUR',
  },
  {
    names: ['Norvale Group', 'Helix Systems', 'Pioneer Labs', 'Crestline', 'Asteron'],
    marketTitle: 'Equity Watchlist',
    dividendTitle: 'Dividend Snapshot',
    entityLabel: 'Listed company',
    priceLabel: 'Current price',
    instrumentLabel: 'stock price',
    currency: 'USD',
  },
  {
    names: ['Marlowe Holdings', 'Aventis Rail', 'Brightmere', 'Kestrel Tech', 'Northgate'],
    marketTitle: 'Market Performance Table',
    dividendTitle: 'Annual Dividend Table',
    entityLabel: 'Business',
    priceLabel: 'Current price',
    instrumentLabel: 'stock price',
    currency: 'GBP',
  },
  {
    names: ['Solara Energy', 'Verdant Foods', 'Ironpeak Logistics', 'Blue Harbor', 'Cinder Works'],
    marketTitle: 'Stock Performance Board',
    dividendTitle: 'Dividend Payments',
    entityLabel: 'Issuer',
    priceLabel: 'Latest price',
    instrumentLabel: 'share price',
    currency: 'EUR',
  },
  {
    names: ['Redstone Media', 'Orchid Telecom', 'Granite Foods', 'Silverline Air', 'Harbor Labs'],
    marketTitle: 'Equities Overview',
    dividendTitle: 'Shareholder Payouts',
    entityLabel: 'Listed firm',
    priceLabel: 'Quoted price',
    instrumentLabel: 'equity price',
    currency: 'USD',
  },
  {
    names: ['Ternex Group', 'Bellmont Steel', 'Rivergate Energy', 'Auralis', 'Westhaven'],
    marketTitle: 'Public Market Tracker',
    dividendTitle: 'Dividend Schedule',
    entityLabel: 'Quoted company',
    priceLabel: 'Market price',
    instrumentLabel: 'share value',
    currency: 'GBP',
  },
]

const VEHICLE_THEMES = [
  {
    names: ['Taber', 'Ursa', 'Velvo', 'Tink', 'Xtam'],
    fuelTitle: 'Fuel Consumption (miles to the gallon)',
    tableTitle: 'Car data',
    entityLabel: 'Car',
    purchaseLabel: 'Cost to purchase',
    dealerLabel: 'car dealership',
    vehicleWord: 'car',
    vehiclePlural: 'cars',
    currency: 'GBP',
  },
  {
    names: ['Lynx', 'Orion', 'Cascade', 'Summit', 'Nova'],
    fuelTitle: 'Vehicle Efficiency (miles per gallon)',
    tableTitle: 'Vehicle data',
    entityLabel: 'Model',
    purchaseLabel: 'Purchase cost',
    dealerLabel: 'fleet buyer',
    vehicleWord: 'vehicle',
    vehiclePlural: 'vehicles',
    currency: 'USD',
  },
  {
    names: ['Atlas', 'Comet', 'Ranger', 'Zephyr', 'Drift'],
    fuelTitle: 'Fuel Economy Comparison',
    tableTitle: 'Fleet models',
    entityLabel: 'Vehicle',
    purchaseLabel: 'Acquisition cost',
    dealerLabel: 'transport company',
    vehicleWord: 'vehicle',
    vehiclePlural: 'vehicles',
    currency: 'GBP',
  },
  {
    names: ['Miro', 'Kora', 'Vanta', 'Rivo', 'Selix'],
    fuelTitle: 'Efficiency by Driving Type',
    tableTitle: 'Model overview',
    entityLabel: 'Model',
    purchaseLabel: 'Purchase price',
    dealerLabel: 'leasing firm',
    vehicleWord: 'model',
    vehiclePlural: 'models',
    currency: 'EUR',
  },
  {
    names: ['Aero', 'Brink', 'Cobalt', 'Dune', 'Ember'],
    fuelTitle: 'Fleet Economy Snapshot',
    tableTitle: 'Vehicle roster',
    entityLabel: 'Model',
    purchaseLabel: 'Acquisition price',
    dealerLabel: 'procurement team',
    vehicleWord: 'vehicle',
    vehiclePlural: 'vehicles',
    currency: 'USD',
  },
  {
    names: ['Pavo', 'Rexor', 'Solis', 'Trion', 'Vale'],
    fuelTitle: 'Road Efficiency Review',
    tableTitle: 'Transport models',
    entityLabel: 'Vehicle',
    purchaseLabel: 'Buying cost',
    dealerLabel: 'dealer group',
    vehicleWord: 'vehicle',
    vehiclePlural: 'vehicles',
    currency: 'GBP',
  },
]
export function numericalLegalIT(difficulty) {
  const themes = [
    {
      sectorLabel: 'Legal sector',
      spendingTitle: 'Legal Sector IT Spending',
      incomeTitle: 'Two legal firms\' consultancy income',
      firmA: 'Make Fit Ltd',
      firmB: 'Pure Gap Plc',
      hardwareLabel: 'IT Hardware',
      softwareLabel: 'IT Software',
      consultingLabel: 'IT Consulting',
      currency: 'GBP',
    },
    {
      sectorLabel: 'Insurance sector',
      spendingTitle: 'Insurance Sector Digital Spending',
      incomeTitle: 'Two insurers\' advisory income',
      firmA: 'Northshield',
      firmB: 'Meridian Cover',
      hardwareLabel: 'Infrastructure',
      softwareLabel: 'Software',
      consultingLabel: 'Advisory',
      currency: 'USD',
    },
    {
      sectorLabel: 'Healthcare sector',
      spendingTitle: 'Healthcare Sector Tech Spending',
      incomeTitle: 'Two healthcare groups\' services income',
      firmA: 'Aster Health',
      firmB: 'Bluewell Care',
      hardwareLabel: 'Medical Hardware',
      softwareLabel: 'Digital Systems',
      consultingLabel: 'External Consulting',
      currency: 'EUR',
    },
  ]
  const theme = pick(themes)
  const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5 projection']
  const hardware = [30, 45, 35, 40, 45].map(value => value + pick([-5, 0, 5]))
  const software = [20, 30, 15, 25, 30].map(value => value + pick([-5, 0, 5]))
  const consulting = [10, 20, 15, 15, 20].map(value => value + pick([-5, 0, 5]))
  const makeFit = [290, 180, 260, 320].map(value => value + pick([-40, -20, 0, 20, 40]))
  const pureGap = [230, 310, 300, 290].map(value => value + pick([-40, -20, 0, 20, 40]))
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
      familyKey: 'numerical-legal-it',
      variantKey: 'numerical-legal-year6-total',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `${theme.sectorLabel} spending on ${theme.hardwareLabel.toLowerCase()}, ${theme.softwareLabel.toLowerCase()} and ${theme.consultingLabel.toLowerCase()} is set to increase in Year 6 by the same amounts as from Year 4 to Year 5. What would be the total ${theme.sectorLabel.toLowerCase()} spending in Year 6 on these three areas combined?`,
      visualHtml: renderLegalSectorCard(theme, years, hardware, software, consulting, makeFit, pureGap),
      options: options.map(value => ({ text: `${theme.currency} ${formatInt(value)} million`, plain: `${theme.currency} ${formatInt(value)} million` })),
      correctIndex: options.indexOf(year6Total),
      explanation: 'Project each category forward by repeating the Year 4 to Year 5 increase once more.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">${theme.hardwareLabel} Year 6 = ${hardware[4]} + (${hardware[4]} - ${hardware[3]}) = ${hardware[4] + incHardware}</div><div class="formula-line">${theme.softwareLabel} Year 6 = ${software[4]} + (${software[4]} - ${software[3]}) = ${software[4] + incSoftware}</div><div class="formula-line">${theme.consultingLabel} Year 6 = ${consulting[4]} + (${consulting[4]} - ${consulting[3]}) = ${consulting[4] + incConsulting}</div><div class="formula-line">Total Year 6 = ${year6Total}</div></div>`,
      pattern: 'Project each series first, then add them.'
    }
  }

  const statements = [
    `${theme.consultingLabel} will increase by ${theme.currency} ${consulting[4] - consulting[3]} million.`,
    `${theme.consultingLabel} in Year 5 matches that of Year 2.`,
    `${theme.softwareLabel} will exceed ${theme.consultingLabel.toLowerCase()} in Year 5.`,
    `Spending on ${theme.hardwareLabel.toLowerCase()} will decline.`,
    `Total spending will increase from Year 4 to Year 5.`,
  ]
  const truth = [true, consulting[4] === consulting[1], software[4] > consulting[4], hardware[4] < hardware[3], hardware[4] + software[4] + consulting[4] > hardware[3] + software[3] + consulting[3]]
  const falseIndex = truth.indexOf(false)
  return {
    topic: 'numerical',
    topicLabel: 'Numerical reasoning',
    familyKey: 'numerical-legal-it',
    variantKey: 'numerical-legal-false-statement',
    timer: getTimerSeconds('numerical', difficulty),
    prompt: `Which of the following statements is false regarding ${theme.sectorLabel.toLowerCase()} spending between Year 4 and projected Year 5?`,
    visualHtml: renderLegalSectorCard(theme, years, hardware, software, consulting, makeFit, pureGap),
    options: statements.map(text => ({ text, plain: text })),
    correctIndex: falseIndex,
    explanation: 'Check each statement directly against the Year 4 and Year 5 chart values.',
    explanationHtml: `<div class="formula-block"><div class="formula-line">${theme.hardwareLabel}: ${hardware[3]} -> ${hardware[4]}</div><div class="formula-line">${theme.softwareLabel}: ${software[3]} -> ${software[4]}</div><div class="formula-line">${theme.consultingLabel}: ${consulting[3]} -> ${consulting[4]}</div></div><div class="formula-line">Only option ${String.fromCharCode(65 + falseIndex)} conflicts with the data.</div>`,
    pattern: 'Validate each statement against the actual chart values.'
  }
}

export function numericalSalesTurnover(difficulty) {
  const themes = [
    { company: 'IKE Computers', month: 'January', currency: 'GBP', turnoverLabel: 'Sales turnover', labourLabel: 'Labour costs', otherLabel: 'Other costs', taxLabel: 'Sales tax' },
    { company: 'Northstar Retail', month: 'March', currency: 'USD', turnoverLabel: 'Revenue', labourLabel: 'Staff costs', otherLabel: 'Operating costs', taxLabel: 'Sales tax' },
    { company: 'Bluewave Systems', month: 'April', currency: 'EUR', turnoverLabel: 'Turnover', labourLabel: 'Payroll costs', otherLabel: 'Other overheads', taxLabel: 'Sales tax' },
    { company: 'Marlowe Foods', month: 'February', currency: 'GBP', turnoverLabel: 'Monthly sales', labourLabel: 'Staff payroll', otherLabel: 'Support costs', taxLabel: 'Sales tax' },
    { company: 'Vertex Mobility', month: 'May', currency: 'USD', turnoverLabel: 'Gross sales', labourLabel: 'Personnel costs', otherLabel: 'Admin costs', taxLabel: 'Sales tax' },
    { company: 'Helio Services', month: 'June', currency: 'EUR', turnoverLabel: 'Sales revenue', labourLabel: 'Employment costs', otherLabel: 'Other operating costs', taxLabel: 'Sales tax' },
  ]
  const theme = pick(themes)
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
      familyKey: 'numerical-sales-turnover',
      variantKey: 'numerical-sales-target-turnover',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `${theme.company} aims to grow monthly gross profit by ${growthPct.toFixed(1)}%. If all costs remain constant, what will the ${theme.turnoverLabel.toLowerCase()} need to be in the next month to hit the target?`,
      visualHtml: renderSalesTurnoverCard(theme, taxRate, salesActual, salesTaxActual, netActual, labourActual, otherActual, grossActual, salesTarget, salesTaxTarget, netTarget, labourTarget, otherTarget, grossTarget),
      options: options.map(value => ({ text: `${theme.currency} ${formatInt(value)}`, plain: `${theme.currency} ${formatInt(value)}` })),
      correctIndex: options.indexOf(requiredSales),
      explanation: 'Work backwards from target gross profit to net turnover, then remove the effect of sales tax.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">Target gross profit = ${formatInt(grossActual)} x ${(1 + growthPct / 100).toFixed(3)} = ${formatInt(desiredGross)}</div><div class="formula-line">Required net turnover = ${formatInt(desiredGross)} + ${formatInt(labourActual)} + ${formatInt(otherActual)} = ${formatInt(requiredNet)}</div><div class="formula-line">Required ${theme.turnoverLabel.toLowerCase()} = ${formatInt(requiredNet)} / ${(1 - taxRate).toFixed(2)} = ${formatInt(requiredSales)}</div></div>`,
      pattern: 'Target profit -> target net -> target sales.'
    }
  }

  const employees = pick([70, 80, 90])
  const replaced = pick([15, 20, 25])
  const interimSalary = pick([2800, 3000, 3200])
  const permanentSalary = labourActual / employees
  const oldCost = replaced * permanentSalary
  const newCost = replaced * interimSalary
  const delta = Math.round(newCost - oldCost)
  const correctText = `${delta > 0 ? 'Increase' : 'Decrease'} of ${theme.currency} ${formatInt(Math.abs(delta))}`
  const options = shuffle(uniqueTextOptions([
    correctText,
    `Decrease of ${theme.currency} ${formatInt(Math.abs(oldCost))}`,
    `Increase of ${theme.currency} ${formatInt(newCost)}`,
    `Increase of ${theme.currency} ${formatInt(Math.abs(delta) + 4000)}`,
    'Cannot tell',
  ]))
  return {
    topic: 'numerical',
    topicLabel: 'Numerical reasoning',
    familyKey: 'numerical-sales-turnover',
    variantKey: 'numerical-sales-labour-replacement',
    timer: getTimerSeconds('numerical', difficulty),
    prompt: `If ${theme.company} employed ${employees} permanent employees who were on the same salary, what would have been the effect on ${theme.labourLabel.toLowerCase()} if ${replaced} permanent employees had been replaced by interim staff each on monthly salaries of ${theme.currency} ${formatInt(interimSalary)}?`,
    visualHtml: renderSalesTurnoverCard(theme, taxRate, salesActual, salesTaxActual, netActual, labourActual, otherActual, grossActual, salesTarget, salesTaxTarget, netTarget, labourTarget, otherTarget, grossTarget),
    options: options.map(text => ({ text, plain: text })),
    correctIndex: options.indexOf(correctText),
    explanation: 'Find the implied permanent salary first, then compare the replaced wage bill with the interim wage bill.',
    explanationHtml: `<div class="formula-block"><div class="formula-line">Permanent salary = ${formatInt(labourActual)} / ${employees} = ${round2(permanentSalary).toFixed(2)}</div><div class="formula-line">Old cost for replaced employees = ${replaced} x ${round2(permanentSalary).toFixed(2)} = ${formatInt(oldCost)}</div><div class="formula-line">New interim cost = ${replaced} x ${formatInt(interimSalary)} = ${formatInt(newCost)}</div><div class="formula-line">Change = ${formatInt(newCost)} - ${formatInt(oldCost)} = ${delta}</div></div>`,
    pattern: 'Per-employee labour cost first, replacement impact second.'
  }
}

export function numericalStackedProfits(difficulty) {
  const themes = [
    { company: 'Reyes Heslop Consulting', title: 'Consulting profits', regions: ['European', 'American', 'Pacific Rim'], sectors: ['Leisure', 'Manufacturing', 'Retail', 'Government', 'Utilities'], currency: 'GBP' },
    { company: 'Northbridge Advisory', title: 'Regional contract profits', regions: ['Domestic', 'International', 'Asia-Pacific'], sectors: ['Finance', 'Energy', 'Retail', 'Public Sector', 'Telecom'], currency: 'USD' },
    { company: 'Asteron Partners', title: 'Regional business profits', regions: ['Continental', 'Atlantic', 'Pacific'], sectors: ['Healthcare', 'Industry', 'Logistics', 'Government', 'Utilities'], currency: 'EUR' },
    { company: 'Granite Point Consulting', title: 'Sector profits', regions: ['Northern', 'Western', 'Southern'], sectors: ['Banking', 'Energy', 'Consumer', 'Government', 'Transport'], currency: 'GBP' },
    { company: 'Bluepeak Strategy', title: 'Regional account profits', regions: ['Metro', 'Coastal', 'Global'], sectors: ['Healthcare', 'Industry', 'Retail', 'Public Services', 'Telecom'], currency: 'USD' },
  ]
  const theme = pick(themes)
  const sectors = [...theme.sectors]
  const regionA = [5.2, 5.0, 4.4, 4.5, 3.5].map(value => round1(value + pick([-0.6, -0.3, 0, 0.3, 0.6])))
  const regionB = [7.4, 7.2, 5.8, 5.9, 5.1].map(value => round1(value + pick([-0.7, -0.4, 0, 0.4, 0.7])))
  const regionC = [4.6, 6.3, 3.8, 3.6, 6.2].map(value => round1(value + pick([-0.6, -0.3, 0, 0.3, 0.6])))
  const family = pick(['ratio-turnover', 'target-quarter'])

  if (family === 'ratio-turnover') {
    const index = randInt(0, sectors.length - 1)
    const regionIndex = randInt(0, 2)
    const regionName = theme.regions[regionIndex]
    const regionSeries = [regionA, regionB, regionC][regionIndex]
    const turnoverHundredThousands = Math.round((regionSeries[index] * 15 / 2) * 10)
    const options = uniqueNumbers([turnoverHundredThousands, turnoverHundredThousands - 90, turnoverHundredThousands + 90, turnoverHundredThousands / 10, turnoverHundredThousands * 2].filter(value => value > 0))
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      familyKey: 'numerical-stacked-profits',
      variantKey: 'numerical-stacked-ratio-turnover',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `If the ratio of profit to turnover for ${regionName} ${sectors[index]} contracts was 2:15, what was the turnover in ${theme.currency} 100,000s?`,
      visualHtml: renderStackedProfitsCard(theme, sectors, regionA, regionB, regionC),
      options: options.map(value => ({ text: String(value), plain: String(value) })),
      correctIndex: options.indexOf(turnoverHundredThousands),
      explanation: 'Scale the observed profit from the profit ratio up to the turnover ratio.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">Profit = ${regionSeries[index].toFixed(1)} million</div><div class="formula-line">Turnover = ${regionSeries[index].toFixed(1)} x 15 / 2 = ${(regionSeries[index] * 15 / 2).toFixed(1)} million</div><div class="formula-line">In ${theme.currency} 100,000s = ${(regionSeries[index] * 15 / 2).toFixed(1)} x 10 = ${turnoverHundredThousands}</div></div>`,
      pattern: 'Use the full ratio to scale the profit.'
    }
  }

  const featuredIndex = randInt(0, sectors.length - 1)
  const featuredSector = sectors[featuredIndex]
  const featuredTotal = regionA[featuredIndex] + regionB[featuredIndex] + regionC[featuredIndex]
  const totalProfits = sum(regionA) + sum(regionB) + sum(regionC)
  const target = totalProfits / 4
  const missedBy = round1(target - featuredTotal)
  const options = uniqueNumbers([missedBy, round1(missedBy + 0.6), round1(missedBy + 0.9), round1(missedBy - 0.5), round1(target)].filter(value => value > 0))
  return {
    topic: 'numerical',
    topicLabel: 'Numerical reasoning',
    familyKey: 'numerical-stacked-profits',
    variantKey: 'numerical-stacked-target-quarter',
    timer: getTimerSeconds('numerical', difficulty),
    prompt: `${theme.company} had a target for ${featuredSector} profits to be one quarter of total profits. Assuming profits in other areas remain the same, by how much did the ${featuredSector} profits miss this target?`,
    visualHtml: renderStackedProfitsCard(theme, sectors, regionA, regionB, regionC),
    options: options.map(value => ({ text: `${theme.currency} ${value.toFixed(1)} million`, plain: `${theme.currency} ${value.toFixed(1)} million` })),
    correctIndex: options.indexOf(missedBy),
    explanation: 'Total all sectors first, then take one quarter, then compare that target with the selected sector.',
    explanationHtml: `<div class="formula-block"><div class="formula-line">${featuredSector} total = ${regionA[featuredIndex].toFixed(1)} + ${regionB[featuredIndex].toFixed(1)} + ${regionC[featuredIndex].toFixed(1)} = ${featuredTotal.toFixed(1)}</div><div class="formula-line">Total profits = ${totalProfits.toFixed(1)}</div><div class="formula-line">Target = ${totalProfits.toFixed(1)} / 4 = ${target.toFixed(1)}</div><div class="formula-line">Missed by = ${target.toFixed(1)} - ${featuredTotal.toFixed(1)} = ${missedBy.toFixed(1)}</div></div>`,
    pattern: 'Find the whole before taking the target proportion.'
  }
}

export function numericalEasternSales(difficulty) {
  const themes = [
    { region: 'Eastern Region', title: 'Eastern Region sales - current year', teams: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'], directLabel: 'Direct sales', telesalesLabel: 'Telesales', currency: 'GBP' },
    { region: 'Northern Division', title: 'Northern Division channels - current year', teams: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'], directLabel: 'Field sales', telesalesLabel: 'Inside sales', currency: 'USD' },
    { region: 'Central Market', title: 'Central Market sales - current year', teams: ['North', 'South', 'East', 'West', 'Core'], directLabel: 'Retail sales', telesalesLabel: 'Remote sales', currency: 'EUR' },
    { region: 'Southern Region', title: 'Southern Region channels - current year', teams: ['Red', 'Blue', 'Gold', 'Green', 'Silver'], directLabel: 'Branch sales', telesalesLabel: 'Call-centre sales', currency: 'GBP' },
    { region: 'Metro Division', title: 'Metro Division sales - current year', teams: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5'], directLabel: 'On-site sales', telesalesLabel: 'Desk sales', currency: 'USD' },
  ]
  const theme = pick(themes)
  const teams = [...theme.teams]
  const direct = [17, 13, 16, 15, 14].map(value => value + pick([-2, -1, 0, 1, 2]))
  const telesales = [16, 17, 18, 17, 18].map(value => value + pick([-2, -1, 0, 1, 2]))
  const family = pick(['difference-total', 'regional-total'])

  if (family === 'difference-total') {
    const directTotal = sum(direct)
    const telesalesTotal = sum(telesales)
    const difference = Math.abs(telesalesTotal - directTotal)
    const options = uniqueNumbers([difference, difference + 1, difference + 2, Math.max(1, difference - 1), telesalesTotal - teams.length].filter(value => value > 0))
    return {
      topic: 'numerical',
      topicLabel: 'Numerical reasoning',
      familyKey: 'numerical-eastern-sales',
      variantKey: 'numerical-eastern-difference-total',
      timer: getTimerSeconds('numerical', difficulty),
      prompt: `What is the difference between ${theme.directLabel.toLowerCase()} and ${theme.telesalesLabel.toLowerCase()} across the five teams combined?`,
      visualHtml: renderEasternSalesCard(theme, teams, direct, telesales),
      options: options.map(value => ({ text: `${theme.currency} ${value} million`, plain: `${theme.currency} ${value} million` })),
      correctIndex: options.indexOf(difference),
      explanation: 'Sum the two channels separately, then subtract.',
      explanationHtml: `<div class="formula-block"><div class="formula-line">${theme.directLabel} total = ${direct.join(' + ')} = ${directTotal}</div><div class="formula-line">${theme.telesalesLabel} total = ${telesales.join(' + ')} = ${telesalesTotal}</div><div class="formula-line">Difference = ${Math.abs(telesalesTotal - directTotal)}</div></div>`,
      pattern: 'Total by channel first, then compare.'
    }
  }

  const regionTotal = sum(direct) + sum(telesales)
  const sharePct = pick([24, 25, 26, 28])
  const allRegions = Math.round(regionTotal / (sharePct / 100))
  const options = uniqueNumbers([allRegions, allRegions - 18, allRegions + 19, regionTotal, regionTotal * 4].filter(value => value > 0))
  return {
    topic: 'numerical',
    topicLabel: 'Numerical reasoning',
    familyKey: 'numerical-eastern-sales',
    variantKey: 'numerical-eastern-regional-total',
    timer: getTimerSeconds('numerical', difficulty),
    prompt: `If ${theme.region}'s total sales represent ${sharePct}% of the total for all regions, what are total sales across all regions to the nearest ${theme.currency} million?`,
    visualHtml: renderEasternSalesCard(theme, teams, direct, telesales),
    options: options.map(value => ({ text: `${theme.currency} ${value} million`, plain: `${theme.currency} ${value} million` })),
    correctIndex: options.indexOf(allRegions),
    explanation: 'Treat the selected region as the known part and divide by its percentage share to recover the whole.',
    explanationHtml: `<div class="formula-block"><div class="formula-line">${theme.region} total = ${sum(direct)} + ${sum(telesales)} = ${regionTotal}</div><div class="formula-line">All regions = ${regionTotal} / ${sharePct / 100} = ${allRegions}</div></div>`,
    pattern: 'Whole = part / percentage.'
  }
}

function renderShareIndexCard(theme, companies, today, dayChange, maxPrice, minPrice, interimDividend, finalDividend) {
  return `${renderTable(theme.marketTitle, [theme.entityLabel, `${theme.priceLabel} (${theme.currency})`, 'Change from previous day (%)', `Past 12 months max price (${theme.currency})`, `Past 12 months min price (${theme.currency})`], companies.map((company, index) => [company, formatInt(today[index]), `<span style="color:${dayChange[index] < 0 ? '#dc2626' : '#111827'};font-weight:700;">${dayChange[index].toFixed(2)}</span>`, formatInt(maxPrice[index]), formatInt(minPrice[index])]))}<div style="height:14px"></div>${renderTable(theme.dividendTitle, [`Dividend paid per share (${theme.currency})`, ...companies], [['Interim dividend', ...interimDividend.map(value => value.toFixed(2))], ['Final dividend', ...finalDividend.map(value => value.toFixed(2))]], 'Note: annual dividend per share = interim dividend + final dividend.')}`
}

function renderCarDataCard(theme, cars, city, motorway, maxSpeed, price) {
  return `<div class="chart" style="padding:14px 18px;"><div class="center" style="font-size:16px;font-weight:800;color:#111827;">${theme.fuelTitle}</div>${renderGroupedBarSvg(cars, [city, motorway], ['City driving', 'Motorway driving'], ['#93c5fd', '#1d4ed8'], 50, 5)}</div><div style="height:14px"></div>${renderTable(theme.tableTitle, [theme.entityLabel, 'Max speed (mph)', `${theme.purchaseLabel} (${theme.currency})`], cars.map((car, index) => [car, String(maxSpeed[index]), formatInt(price[index])]))}`
}

function renderLegalSectorCard(theme, years, hardware, software, consulting, makeFit, pureGap) {
  return `<div class="chart" style="padding:14px 18px;"><div class="center" style="font-size:16px;font-weight:800;color:#111827;">${theme.spendingTitle} (${theme.currency} millions)</div>${renderGroupedBarSvg(years, [hardware, software, consulting], [theme.hardwareLabel, theme.softwareLabel, theme.consultingLabel], ['#f97316', '#0ea5e9', '#4b5563'], 50, 10)}</div><div style="height:14px"></div>${renderTable(theme.incomeTitle + ' (10,000s)', ['Year', theme.firmA, theme.firmB], years.slice(0, 4).map((year, index) => [year, String(makeFit[index]), String(pureGap[index])]))}`
}

function renderSalesTurnoverCard(theme, taxRate, salesActual, salesTaxActual, netActual, labourActual, otherActual, grossActual, salesTarget, salesTaxTarget, netTarget, labourTarget, otherTarget, grossTarget) {
  return renderTable(`${theme.company} (${theme.month})`, ['Metric', 'Actual', 'Target'], [[theme.turnoverLabel, formatInt(salesActual), formatInt(salesTarget)], [`${theme.taxLabel} (${Math.round(taxRate * 100)}%)`, formatInt(salesTaxActual), formatInt(salesTaxTarget)], ['Net turnover', formatInt(netActual), formatInt(netTarget)], [theme.labourLabel, formatInt(labourActual), formatInt(labourTarget)], [theme.otherLabel, formatInt(otherActual), formatInt(otherTarget)], ['Gross profit', formatInt(grossActual), formatInt(grossTarget)]])
}

function renderStackedProfitsCard(theme, sectors, regionA, regionB, regionC) {
  return `<div class="chart" style="padding:14px 18px;"><div class="center" style="font-size:16px;font-weight:800;color:#111827;">${theme.company} - ${theme.title} (${theme.currency} millions)</div>${renderStackedBarSvg(sectors, [regionA, regionB, regionC], theme.regions, ['#4b5563', '#1e3a8a', '#84cc16'], 20, 5)}</div>`
}

function renderEasternSalesCard(theme, teams, direct, telesales) {
  return `<div class="chart" style="padding:14px 18px;"><div class="center" style="font-size:16px;font-weight:800;color:#111827;">${theme.title}</div>${renderGroupedBarSvg(teams, [direct, telesales], [theme.directLabel, theme.telesalesLabel], ['#a3a3a3', '#4f86c6'], 20, 2)}</div>`
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














