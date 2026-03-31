import { asyncScheduler } from "../scheduler/async";
import { timer } from "./timer";

export function interval(period = 0, scheduler = asyncScheduler) {
  return timer(period, period, scheduler);
}