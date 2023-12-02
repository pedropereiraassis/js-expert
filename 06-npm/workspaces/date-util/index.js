import StringUtil from "string-util"

const availableFormats = {
  'dd-mm-yyyy': '$<day>-$<month>-$<year>',
  'yyyy-mm-dd': '$<year>-$<month>-$<day>',
  'dd/mm/yyyy': '$<day>/$<month>/$<year>',
  'yyyy/mm/dd': '$<year>/$<month>/$<day>',
}

const yyyymmddRegex = /(?<year>\d{4}).(?<month>\d{2}).(?<day>\d{2})/
const ddmmyyyyRegex = /(?<day>\d{2}).(?<month>\d{2}).(?<year>\d{4})/

const stringToDateExps = {
  'dd-mm-yyyy': ddmmyyyyRegex,
  'yyyy-mm-dd': yyyymmddRegex,
  'dd/mm/yyyy': ddmmyyyyRegex,
  'yyyy/mm/dd': yyyymmddRegex,
}

export default class DateUtil {
  static formatDate(date, format) {
    if (!Object.keys(availableFormats).includes(format)) {
      return {
        error: `the format ${format} is not available yet`
      }
    }

    const exp = availableFormats[format]
    const [result] = date.toISOString().match(yyyymmddRegex)

    return result.replace(yyyymmddRegex, exp)
  }

  static formatString(dateStr, currentFormat, expectedFormat) {
    if (StringUtil.isEmpty(dateStr)) {
      return { error: 'your text is empty' }
    }

    if (!Object.keys(availableFormats).includes(currentFormat)) {
      return { error: `the format ${currentFormat} is not available yet` }
    }

    if (!Object.keys(availableFormats).includes(expectedFormat)) {
      return { error: `the format ${expectedFormat} is not available yet` }
    }

    const toDateExps = stringToDateExps[currentFormat]
    const dateStrInISO = StringUtil.removeEmptySpaces(dateStr).replace(toDateExps, '$<year>-$<month>-$<day>')
    const finalDate = new Date(dateStrInISO)

    return this.formatDate(finalDate, expectedFormat)
  }
}