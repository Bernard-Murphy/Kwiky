import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const transitions = {
  normalize: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  },

  fade_out: {
    opacity: 0,
    scale: 0.97,
  },

  fade_out_forward: {
    opacity: 0,
    scale: 1.1,
  },

  fade_out_scale_1: {
    opacity: 0,
  },

  fade_out_up: {
    opacity: 0,
    y: -50,
  },
  fade_out_down: {
    opacity: 0,
    y: 50,
  },

  fade_out_right: {
    opacity: 0,
    x: 50,
  },

  fade_out_left: {
    opacity: 0,
    x: -50,
  },

  fade_out_top: {
    opacity: 0,
    scale: 0.98,
    y: 40,
  },

  fade_out_bottom: {
    opacity: 0,
    scale: 0.98,
    y: -40,
  },

  fade_out_minimize: {
    opacity: 0,
    scale: 0.5,
  },

  bob_left: {
    x: -20,
    opacity: 0.5,
  },

  bob_right: {
    x: 20,
    opacity: 0.5,
  },

  fade_out_left_minor: {
    opacity: 0,
    x: -300,
  },

  fade_out_right_minor: {
    opacity: 0,
    x: 300,
  },

  transition: {
    // x: { duration: 0.33 },
    // y: { duration: 0.33 },
    // opacity: { duration: 0.25 },
    // scale: { duration: 0.26 },
    x: { duration: 0.25 },
    y: { duration: 0.25 },
    opacity: { duration: 0.17 },
    scale: { duration: 0.18 },
  },

  transition_fast: {
    x: { duration: 0.19 },
    y: { duration: 0.19 },
    opacity: { duration: 0.11 },
    scale: { duration: 0.12 },
  },
};
