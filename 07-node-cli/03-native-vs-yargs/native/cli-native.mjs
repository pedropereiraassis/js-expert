const [ nodePath, filePath, ...commands ] = process.argv

function parseArguments(commands) {
  const cmd = new Map()
  const commandPrefix = '--'

  for (const command of commands) {
    if (!command.includes(commandPrefix)) {
      continue
    }

    const commandIndex = commands.indexOf(command)

    cmd.set(
      command.replace(commandPrefix, ''),
      commands[commandIndex + 1],
    )
  }

  return Object.fromEntries(cmd)
}

console.log(parseArguments(commands))