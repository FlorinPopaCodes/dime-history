import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { deleteHistoryOlderThanFourteenDays } from "@/lib/history";

const DAY_MS = 24 * 60 * 60 * 1000;
const FOURTEEN_DAYS_MS = 14 * DAY_MS;
const INSTALL_DATE_KEY = "installDate";
const NOW = 1700000000000;

describe("deleteHistoryOlderThanFourteenDays", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    fakeBrowser.reset();
    fakeBrowser.history.deleteRange = vi.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("saves install date on first run", async () => {
    await deleteHistoryOlderThanFourteenDays("idle");

    const stored = await fakeBrowser.storage.local.get(INSTALL_DATE_KEY);
    expect(stored[INSTALL_DATE_KEY]).toBe(NOW);
  });

  it("does not delete before 14 days have passed since install", async () => {
    await deleteHistoryOlderThanFourteenDays("idle");

    expect(fakeBrowser.history.deleteRange).not.toHaveBeenCalled();
  });

  it("deletes between install date and cutoff after 14 days", async () => {
    const installDate = NOW;
    await fakeBrowser.storage.local.set({ [INSTALL_DATE_KEY]: installDate });

    vi.setSystemTime(NOW + FOURTEEN_DAYS_MS + DAY_MS);
    await deleteHistoryOlderThanFourteenDays("idle");

    expect(fakeBrowser.history.deleteRange).toHaveBeenCalledWith({
      startTime: installDate,
      endTime: NOW + DAY_MS,
    });
  });

  it("does not delete when state is not idle", async () => {
    await fakeBrowser.storage.local.set({ [INSTALL_DATE_KEY]: NOW });
    vi.setSystemTime(NOW + FOURTEEN_DAYS_MS + DAY_MS);

    await deleteHistoryOlderThanFourteenDays("active");
    await deleteHistoryOlderThanFourteenDays("locked");

    expect(fakeBrowser.history.deleteRange).not.toHaveBeenCalled();
  });

  it("moves the cutoff forward on subsequent runs", async () => {
    await fakeBrowser.storage.local.set({ [INSTALL_DATE_KEY]: NOW });

    vi.setSystemTime(NOW + FOURTEEN_DAYS_MS + DAY_MS);
    await deleteHistoryOlderThanFourteenDays("idle");

    vi.setSystemTime(NOW + FOURTEEN_DAYS_MS + 2 * DAY_MS);
    await deleteHistoryOlderThanFourteenDays("idle");

    const calls = vi.mocked(fakeBrowser.history.deleteRange).mock.calls;
    expect(calls).toHaveLength(2);
    expect(calls[0][0]).toEqual({
      startTime: NOW,
      endTime: NOW + DAY_MS,
    });
    expect(calls[1][0]).toEqual({
      startTime: NOW,
      endTime: NOW + 2 * DAY_MS,
    });
  });
});
