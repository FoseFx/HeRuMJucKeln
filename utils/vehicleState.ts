import { Deviation, Occupancy } from "~/swagger/Api";

export const getDeviationSemanticsColor = (
  semantics: Deviation["semantics"]
) => {
  switch (semantics) {
    case "ON_TIME":
      return "green";
    case "SUBOPTIMAL":
      return "#D18700"; // dark orange
    case "PROBLEMATIC":
      return "red";
    case "WAITING":
      return "grey";
    default:
      return undefined;
  }
};

export const getDeviationSemanticsText = (
  semantics: Deviation["semantics"]
) => {
  switch (semantics) {
    case "ON_TIME":
      return "Pünktlich";
    case "SUBOPTIMAL":
      return "Suboptimal";
    case "PROBLEMATIC":
      return "Problematisch";
    case "WAITING":
      return "Wartet";
    default:
      return undefined;
  }
};

/**
 * Color gradually goes to red when approaching 5 Minutes (value -5) for late arrivals or
 * 3.5 minutes (value 3.5) for early arrivals, as early arrivals are more critical
 */
export const getDeviationColor = (deviationInSeconds?: number) => {
  const MINUTE = 60;

  if (deviationInSeconds === undefined) {
    return "grey";
  } else if (
    deviationInSeconds < -5 * MINUTE ||
    deviationInSeconds > 3.5 * MINUTE
  ) {
    return "red";
  } else if (deviationInSeconds <= 0) {
    return getColorFromRedGreenRange(
      Math.abs(deviationInSeconds) / (3.5 * MINUTE)
    );
  } else {
    return getColorFromRedGreenRange(
      Math.abs(deviationInSeconds) / (5 * MINUTE)
    );
  }
};

export const getOccupancyColor = (occupancy?: Occupancy) => {
  const lowerPercentage = occupancy?.range?.[0] ?? -1;
  if (lowerPercentage < 0) {
    return "grey";
  } else if (lowerPercentage < 25) {
    return "green";
  } else if (lowerPercentage < 50) {
    return "#D18700";
  } else if (lowerPercentage < 75) {
    return "orange";
  } else {
    return "red";
  }
};

export const prettifyOccupancy = (occupany?: Occupancy) => {
  if (!occupany?.range || occupany.range.length === 0) {
    return "";
  } else if (occupany.range.length === 1) {
    return `${occupany.range[0]}%`;
  } else {
    return `${occupany.range[0]}% - ${occupany.range[1]}%`;
  }
};
