import { browser, type Idle } from "wxt/browser";

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
const INSTALL_DATE_KEY = "installDate";

export async function deleteHistoryOlderThanFourteenDays(
  idleState: Idle.IdleState,
): Promise<void> {
  if (idleState !== "idle") return;

  const stored = await browser.storage.local.get(INSTALL_DATE_KEY);
  let installDate = stored[INSTALL_DATE_KEY] as number | undefined;

  if (!installDate) {
    installDate = Date.now();
    await browser.storage.local.set({ [INSTALL_DATE_KEY]: installDate });
    return;
  }

  const cutoff = Date.now() - FOURTEEN_DAYS_MS;
  if (cutoff <= installDate) return;

  await browser.history.deleteRange({
    startTime: installDate,
    endTime: cutoff,
  });
}
