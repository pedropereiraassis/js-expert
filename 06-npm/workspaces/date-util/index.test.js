import { deepStrictEqual } from 'assert'
import DateUtil from './index.js'

{
  const format = 'dd-M-Y'
  const expected = { error: `the format ${format} is not available yet` }
  const date = new Date(1990, 2, 1)
  const result = DateUtil.formatDate(date, format)

  deepStrictEqual(result, expected)
}

{
  const format = 'dd-mm-yyyy'
  const expected = '01-12-1990'
  const date = new Date('1990-12-01')
  const result = DateUtil.formatDate(date, format)

  deepStrictEqual(result, expected)
}

{
  const format = 'dd/mm/yyyy'
  const expected = '14/06/1995'
  const date = new Date('1995-06-14')
  const result = DateUtil.formatDate(date, format)

  deepStrictEqual(result, expected)
}

{
  const format = 'yyyy-mm-dd'
  const expected = '1992-10-24'
  const date = new Date('1992-10-24')
  const result = DateUtil.formatDate(date, format)

  deepStrictEqual(result, expected)
}

/// formatString

{
  const expected = { error: 'your text is empty' }
  const date = ''
  const result = DateUtil.formatString(date)

  deepStrictEqual(result, expected)
}

{
  const format = 'yyyy-MM-dd'
  const date = '1990-april-10'
  const expected = { error: `the format ${format} is not available yet` }
  const result = DateUtil.formatString(date, format)

  deepStrictEqual(result, expected)
}

{
  const format = 'yyyy-mm-dd'
  const date = '1990-04-10'
  const expectedFormat = 'dd/M/yyy'
  const expected = { error: `the format ${expectedFormat} is not available yet` }
  const result = DateUtil.formatString(date, format, expectedFormat)

  deepStrictEqual(result, expected)
}

{
  const format = 'yyyy-mm-dd'
  const date = '1990-04-10'
  const expectedFormat = 'dd/mm/yyyy'
  const expected = '10/04/1990'
  const result = DateUtil.formatString(date, format, expectedFormat)

  deepStrictEqual(result, expected)
}

{
  const format = 'yyyy/mm/dd'
  const date = '1  990/ 04/ 1 0'
  const expectedFormat = 'dd-mm-yyyy'
  const expected = '10-04-1990'
  const result = DateUtil.formatString(date, format, expectedFormat)

  deepStrictEqual(result, expected)
}

{
  const format = 'dd/mm/yyyy'
  const date = '04 / 0  5/  19  9 5'
  const expectedFormat = 'yyyy-mm-dd'
  const expected = '1995-05-04'
  const result = DateUtil.formatString(date, format, expectedFormat)

  deepStrictEqual(result, expected)
}

{
  const format = 'dd-mm-yyyy'
  const date = '28 - 0  2-  19  9 4'
  const expectedFormat = 'yyyy/mm/dd'
  const expected = '1994/02/28'
  const result = DateUtil.formatString(date, format, expectedFormat)

  deepStrictEqual(result, expected)
}