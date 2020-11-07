async function deleteOlderThanForteenDays (state) {
  const forteenDays = 1.21e9

  if (state === 'idle') {
    const now = new Date()
    const endTime = now.getTime() - forteenDays

    browser.history.deleteRange({ startTime: 0, endTime: endTime })
  }
}

browser.idle.onStateChanged.addListener(deleteOlderThanForteenDays)
