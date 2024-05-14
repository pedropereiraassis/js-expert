function supportsWorkerType() {
  let supports = false

  const tester = {
    get type() {
      supports = true
    }
  }

  try {
    new Worker('blob://', tester).terminate()
  } finally {
    return supports
  }
}

function prepareRunChecker({ timeDelay}) {
  let lastEvent = Date.now()

  return {
    shouldRun() {
      const now = Date.now()
      const result = (now - lastEvent) > timeDelay
      if (result) lastEvent = now

      return result
    }
  }
}

export {
  supportsWorkerType,
  prepareRunChecker,
}