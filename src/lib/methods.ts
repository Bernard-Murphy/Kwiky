import { toast } from "sonner";

export const copyText = (string: string) => {
  let textarea = document.createElement("textarea");
  let result;

  try {
    textarea.setAttribute("readonly", "true");
    textarea.setAttribute("contenteditable", "true");
    textarea.style.position = "fixed";
    textarea.value = string;

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const range = document.createRange();
    range.selectNodeContents(textarea);

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }

    textarea.setSelectionRange(0, textarea.value.length);
    result = document.execCommand("copy");
  } catch (err) {
    console.error(err);
    result = null;
  } finally {
    document.body.removeChild(textarea);
  }

  if (!result) {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const copyHotkey = isMac ? "⌘C" : "CTRL+C";
    result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
    if (!result) {
      return false;
    }
  }

  toast.success("Copied to clipboard");
};

export const getFileSize = (size: string | number) => {
  size = Number(size);
  const units = ["Bytes", "KB", "MB", "GB"];
  let scale = 0;
  while (size > 900 && scale < 3) {
    size /= 1024;
    scale++;
  }
  return Math.round(size * 100) / 100 + " " + units[scale];
};

const badWords = [
  "nigger",
  "faggot",
  "fag",
  "bitch",
  "kike",
  "chink",
  "cunt",
  "spic",
  "gook",
];

export const abbreviatedText = (text: string, length?: number) => {
  text = String(text);
  if (!length) length = 75;
  badWords.forEach(
    (word) =>
      (text = text.replaceAll(
        new RegExp(word, "gi"),
        Array.from(Array(word.length).keys())
          .map(() => "*")
          .join("")
      ))
  );
  return text.length > length ? text.substring(0, length) + "..." : text;
};

/**
 *
 * @param {JavaScript date} date
 * @returns a human readable date in the format "MM/DD/YYYY"
 */
export const makeDateHR = (date: Date | string) => {
  date = new Date(date);
  let months = date.getMonth() + 1;
  let days = date.getDate();
  let years = date.getFullYear();
  return months + "/" + days + "/" + years;
};

/**
 *
 * @param {JavaScript date} date
 * @returns a human readable time in the format "0:00AM"
 */
export const getTimeHR = (date: Date | string) => {
  date = new Date(date);
  let meridian = "AM";
  let hours: string | number = date.getHours();
  let minutes: string | number = date.getMinutes();
  if (hours >= 12) meridian = "PM";
  if (!hours) hours = 12;
  if (hours > 12) {
    hours -= 12;
  }
  if (String(minutes).length === 1) minutes = `0${minutes}`;
  return hours + ":" + minutes + meridian;
};

export const checkSpecial = (id: number) => {
  if (id === 1) return true;
  const split = String(id).split("");
  if (split.length === 1) return false;
  if (split.every((c) => c === split[0])) return true;
  if (split.length < 3) return false;
  let special = true;
  split.forEach((char, s) => {
    if (s && Number(char)) special = false;
  });
  return special;
};
