import moment from 'moment';
import { TWO_MINUTES_IN_MILLISECONDS } from '../constants/constants';

const oneHourInMs = 60 * 60 * 1000;

export const optionalNewDate = (date?: string): Date | undefined => {
  return date ? new Date(date) : undefined;
};

export const hasValidCache = (cacheTime?: number, time = new Date(), durationMs = oneHourInMs): boolean => {
  return !!cacheTime && cacheTime > time.getTime() - durationMs;
};

export const hasValidTwoMinuteCache = (cacheTime?: number, time = new Date()): boolean => {
  return hasValidCache(cacheTime, time, TWO_MINUTES_IN_MILLISECONDS);
};

export const mapDateToString = (date: Date | string): string => {
  return moment(date).format('DD-MM-YYYY');
};
