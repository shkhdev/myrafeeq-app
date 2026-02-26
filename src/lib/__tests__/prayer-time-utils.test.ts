import { afterEach, describe, expect, it, vi } from "vitest";
import type { PrayerTimes } from "@/types/prayer";
import {
  formatCountdown,
  formatTime12h,
  getCurrentPrayerPeriod,
  getMinutesUntil,
  getNextPrayer,
  getTodayDate,
} from "../prayer-time-utils";

const SAMPLE_TIMES: PrayerTimes = {
  fajr: "04:30",
  sunrise: "06:00",
  dhuhr: "12:15",
  asr: "15:45",
  maghrib: "18:30",
  isha: "20:00",
};

function mockTime(hours: number, minutes: number) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 1, 26, hours, minutes, 0));
}

afterEach(() => {
  vi.useRealTimers();
});

describe("formatTime12h", () => {
  it("converts midnight correctly", () => {
    expect(formatTime12h("00:00")).toBe("12:00 AM");
  });

  it("converts noon correctly", () => {
    expect(formatTime12h("12:00")).toBe("12:00 PM");
  });

  it("converts morning time", () => {
    expect(formatTime12h("04:30")).toBe("4:30 AM");
  });

  it("converts afternoon time", () => {
    expect(formatTime12h("15:45")).toBe("3:45 PM");
  });

  it("converts 1 PM", () => {
    expect(formatTime12h("13:00")).toBe("1:00 PM");
  });

  it("returns original on invalid input", () => {
    expect(formatTime12h("invalid")).toBe("invalid");
    expect(formatTime12h("25")).toBe("25");
  });
});

describe("formatCountdown", () => {
  it("returns '0m' for zero or negative", () => {
    expect(formatCountdown(0)).toBe("0m");
    expect(formatCountdown(-10)).toBe("0m");
  });

  it("formats minutes only", () => {
    expect(formatCountdown(45)).toBe("45m");
  });

  it("formats hours and minutes", () => {
    expect(formatCountdown(125)).toBe("2h 5m");
  });

  it("formats exact hour", () => {
    expect(formatCountdown(60)).toBe("1h 0m");
  });
});

describe("getCurrentPrayerPeriod", () => {
  it("returns null before fajr", () => {
    mockTime(3, 0);
    expect(getCurrentPrayerPeriod(SAMPLE_TIMES)).toBeNull();
  });

  it("returns fajr during fajr time", () => {
    mockTime(5, 0);
    expect(getCurrentPrayerPeriod(SAMPLE_TIMES)).toBe("fajr");
  });

  it("returns sunrise after sunrise", () => {
    mockTime(6, 30);
    expect(getCurrentPrayerPeriod(SAMPLE_TIMES)).toBe("sunrise");
  });

  it("returns dhuhr at dhuhr time", () => {
    mockTime(12, 15);
    expect(getCurrentPrayerPeriod(SAMPLE_TIMES)).toBe("dhuhr");
  });

  it("returns asr during asr", () => {
    mockTime(16, 0);
    expect(getCurrentPrayerPeriod(SAMPLE_TIMES)).toBe("asr");
  });

  it("returns maghrib during maghrib", () => {
    mockTime(19, 0);
    expect(getCurrentPrayerPeriod(SAMPLE_TIMES)).toBe("maghrib");
  });

  it("returns isha after isha", () => {
    mockTime(22, 0);
    expect(getCurrentPrayerPeriod(SAMPLE_TIMES)).toBe("isha");
  });

  it("returns isha right at isha time", () => {
    mockTime(20, 0);
    expect(getCurrentPrayerPeriod(SAMPLE_TIMES)).toBe("isha");
  });
});

describe("getNextPrayer", () => {
  it("returns fajr when before fajr", () => {
    mockTime(3, 0);
    const next = getNextPrayer(SAMPLE_TIMES);
    expect(next).toEqual({ name: "fajr", time: "04:30" });
  });

  it("returns dhuhr during sunrise period", () => {
    mockTime(7, 0);
    const next = getNextPrayer(SAMPLE_TIMES);
    expect(next).toEqual({ name: "dhuhr", time: "12:15" });
  });

  it("returns null after isha", () => {
    mockTime(22, 0);
    expect(getNextPrayer(SAMPLE_TIMES)).toBeNull();
  });

  it("returns sunrise after fajr starts", () => {
    mockTime(4, 30);
    const next = getNextPrayer(SAMPLE_TIMES);
    expect(next).toEqual({ name: "sunrise", time: "06:00" });
  });

  it("returns isha during maghrib", () => {
    mockTime(19, 0);
    const next = getNextPrayer(SAMPLE_TIMES);
    expect(next).toEqual({ name: "isha", time: "20:00" });
  });
});

describe("getMinutesUntil", () => {
  it("returns positive minutes for future time", () => {
    mockTime(4, 0);
    expect(getMinutesUntil("04:30")).toBe(30);
  });

  it("returns 0 when at exact time", () => {
    mockTime(12, 15);
    expect(getMinutesUntil("12:15")).toBe(0);
  });

  it("returns negative for past time", () => {
    mockTime(13, 0);
    expect(getMinutesUntil("12:15")).toBe(-45);
  });
});

describe("getTodayDate", () => {
  it("returns YYYY-MM-DD format", () => {
    mockTime(12, 0);
    expect(getTodayDate()).toBe("2026-02-26");
  });

  it("pads single-digit month and day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5, 12, 0, 0));
    expect(getTodayDate()).toBe("2026-01-05");
  });
});
