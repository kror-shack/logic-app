import { checkForWordInString } from "./gstHelperFunctions/gstHelperFunctions";

type Structure = {
  subject: string;
  predicate: string;
  type: string;
};

type Terms = {
  majorTerm: string;
  minorTerm: string;
  middleTerm: string;
};

const getSyllogismTerms = (p1: Structure, p2: Structure, conc: Structure) => {
  const syllogisticTerms = {} as Terms;

  syllogisticTerms.majorTerm = conc.predicate;
  syllogisticTerms.minorTerm = conc.subject;
  if (checkForWordInString(syllogisticTerms.majorTerm, p1.subject)) {
    syllogisticTerms.middleTerm = p1.predicate;
  } else {
    syllogisticTerms.middleTerm = p1.subject;
  }
  return syllogisticTerms;
};

export default getSyllogismTerms;
