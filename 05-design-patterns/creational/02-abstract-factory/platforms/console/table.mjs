import TableComponent from '../../shared/base/tableComponent.mjs'
import chalk from 'chalk'
import chalkTable from 'chalk-table'

export default class TableConsoleComponent extends TableComponent {
  render(data) {
    const columns = this.prepareData(data)
    const options = {
      leftPad: 2,
      columns
    }
    const table = chalkTable(options, data)
    console.log(table)
  }

  prepareData(data) {
    const [firstItem] = data
    const headers = Object.keys(firstItem)

    const formatHeader = (item, index) => index %2 === 0 ? chalk.yellow(item) : chalk.green(item)
    const columns = headers
      .map((item, index) => ({ field: item, name: formatHeader(item, index)}))
    
    return columns
  }
}