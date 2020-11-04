const ms = require('ms')
const { evaluate } = require('mathjs')

const compute = require('../computations')

const msToHr = _ms => _ms / 3.6e6
const getFraction = decimal => {
  for (var denominator = 1; (decimal * denominator) % 1 !== 0; denominator++);
  return { numerator: decimal * denominator, denominator: denominator }
}

const command = {
  name: 'invophelper',
  run: async toolbox => {
    toolbox.print.info('Deja el campo vacío si no se tiene el valor')
    let { λ } = await toolbox.prompt.ask({
      type: 'input',
      name: 'λ',
      message: 'Proceso entrada (λ) (ej: 22.4). La unidad debe ser en horas'
    })
    λ = Number(λ)
    const { ps } = await toolbox.prompt.ask({
      type: 'input',
      name: 'ps',
      message: 'Proceso salida (tiempo, ej: "3.75 min")'
    })
    let { servidores } = await toolbox.prompt.ask({
      type: 'input',
      name: 'servidores',
      message: 'Cantidad de servidores? (ej: "1")'
    })
    servidores = Number(servidores)

    let ts = getFraction(msToHr(ms(ps)))
    let humanReadableTs = `${ts.numerator}/${ts.denominator} por hora`
    if (ts.denominator == '1') humanReadableTs = `${ts.numerator} por hora`

    const μ = null

    const p = λ / (servidores * μ)

    toolbox.print.info('Variables:')
    console.table({ λ, ts, humanReadableTs, p })

    let input = ''
    let expressionToEvaluate = ''
    let result = ''
    while (true) {
      ;({ input } = await toolbox.prompt.ask({
        type: 'input',
        name: 'input',
        message: "Type something to calculate, we'll replace the values"
      }))
      try {
        expressionToEvaluate = input
          .split('λ')
          .join(λ)
          .split('servidores')
          .join(servidores)
          .split('p')
          .join(p)
          .split('μ')
          .join(μ)
        result = evaluate(expressionToEvaluate)
        toolbox.print.info(`Input: ${input}`)
        toolbox.print.info(`Evaluated: ${expressionToEvaluate}`)
        toolbox.print.info(`Result: ${result}`)
      } catch (e) {
        toolbox.print.error('Invalid expression')
      }

      input = ''
      expressionToEvaluate = ''
      result = ''
    }
  }
}

module.exports = command
