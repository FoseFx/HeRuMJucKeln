import { Deviation } from "~/swagger/Api";

export const getDeviationSemanticsColor = (
  semantics: Deviation["semantics"]
) => {
  switch (semantics) {
    case "ON_TIME":
      return "green";
    case "SUBOPTIMAL":
      return "yellow";
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
