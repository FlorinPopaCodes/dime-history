import { deleteHistoryOlderThanFourteenDays } from "@/lib/history";

export default defineBackground(() => {
  browser.idle.onStateChanged.addListener(deleteHistoryOlderThanFourteenDays);
});
