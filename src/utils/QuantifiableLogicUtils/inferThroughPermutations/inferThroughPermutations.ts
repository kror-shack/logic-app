import { DeductionStep } from "../../../types/sharedTypes";
import {
  addDeductionStep,
  addToSimplifiableExpressions,
  changeFromPropertyToStartAtOne,
  convertImplicationToDisjunction,
  getOperator,
  searchInArray,
  searchIndex,
} from "../../HelperFunctions/deductionHelperFunctions/deductionHelperFunctions";
import parseSymbolicLogicInput from "../../HelperFunctions/parseSymbolicLogicInput/parseSymbolicLogicInput";
import checkDisjunctionSolvability from "../../sharedFunctions/checkDisjunctionSolvability/checkDisjunctionSolvability";
import checkForContradictionExploitaion from "../../sharedFunctions/checkForContradictionExploitation/checkForContradictionExploitation";
import checkImplicationSolvability from "../../sharedFunctions/checkImplicationSolvability/checkImplicationSolvability";
import checkWithConclusion from "../../sharedFunctions/checkWithConclusion/checkWithConclusion";
import expandKnowledgeBase from "../../sharedFunctions/expandKnowledgeBase/expandKnowledgeBase";
import getDeMorganTransform from "../../sharedFunctions/getDeMorganTransform/getDeMorganTransform";
import simplifyAndOperation from "../../sharedFunctions/simplifyAndOperation/simplifyAndOperation";
import simplifyBiConditional from "../../sharedFunctions/simplifyBiConditional/simplifyBiConditional";
import calculatePossiblePermutations from "../calculatePossiblePermutations/calculatePossiblePermutations";
import checkWithQuantifiableConclusion from "../checkWithQuantifiableConclusion/checkWithQuantifiableConclusion";
import {
  getInstantiation,
  instantiateExistentialPremise,
  orderPremises,
  searchInKnowledgeBaseForInstantiatedPremsise,
} from "../inferDeductionStepsHelperFunctions/inferDeductionStepsHelperFunctions";

const inferThroughPermutations = (
  initialPremiseArr: string[],
  conclusion: string
): DeductionStep[] | false => {
  const conclusionArr = parseSymbolicLogicInput(conclusion);
  let deductionStepsArr: DeductionStep[] = [];
  const steps: DeductionStep[] = [];
  let knowledgeBase: string[][] = [];
  let premiseArr: string[][] = [];
  let alreadyInstantiatedPremises: string[][] = [];

  let simplifiableExpressions: string[][] = [];

  for (let i = 0; i < initialPremiseArr.length; i++) {
    const parsedPremise = parseSymbolicLogicInput(initialPremiseArr[i]);

    premiseArr.push(parsedPremise);
    knowledgeBase.push(parsedPremise);
  }

  const subVales = calculatePossiblePermutations(knowledgeBase);
  const possiblePerumutationsForUniversals =
    subVales?.possiblePerumutationsForUniversals;
  const usedSubstitutes = subVales?.usedSubstitutes;
  if (usedSubstitutes?.length === 0) usedSubstitutes.push("a");
  if (possiblePerumutationsForUniversals.length === 0) {
    const combination = [...usedSubstitutes];
    for (let i = 0; i < initialPremiseArr.length; i++) {
      combination.push(...usedSubstitutes);
    }
    possiblePerumutationsForUniversals.push(combination);
  }
  let valuesFromInstantiation = instantiateExistentialPremise(
    premiseArr,
    usedSubstitutes,
    deductionStepsArr,
    alreadyInstantiatedPremises
  );
  let exitentiallyInstantiatedArr =
    valuesFromInstantiation?.instantiatedPremisesArr;
  let unUsedSubs = valuesFromInstantiation?.usedSubs;

  if (!exitentiallyInstantiatedArr) return false;
  for (let i = 0; i < exitentiallyInstantiatedArr.length; i++) {
    const premise = exitentiallyInstantiatedArr[i];
    if (
      getOperator(premise) ||
      premise[0].includes("\u2203") ||
      premise[0].includes("\u2200")
    ) {
      simplifiableExpressions.push(premise);
    }
    if (!searchInArray(knowledgeBase, premise)) knowledgeBase.push(premise);
  }

  const startingKnowledgeBase = [...knowledgeBase];
  const startingInstArr = [...exitentiallyInstantiatedArr];
  const startingSimpExp = [...simplifiableExpressions];
  const startingUniArr = [...alreadyInstantiatedPremises];
  const startingdeductionStepsArr = [...deductionStepsArr];
  const startingunUsedSubs = [...unUsedSubs];

  for (let i = 0; i < possiblePerumutationsForUniversals.length; i++) {
    /**
     * RUNNING THE FUNCTION WITH ALL POSSIBLE VALUES
     * THAT THE UNIVERSAL VARIABLES CAN BE INSTANTIATED WITH
     */

    const combinations = possiblePerumutationsForUniversals[i];

    /**
     * RESET ALL THE VALUES TO THE STARTING ONE
     */

    knowledgeBase = [...startingKnowledgeBase];
    exitentiallyInstantiatedArr = [...startingInstArr];
    simplifiableExpressions = [...startingSimpExp];
    alreadyInstantiatedPremises = [...startingUniArr];
    deductionStepsArr = [...startingdeductionStepsArr];
    unUsedSubs = [...startingunUsedSubs];

    let oldKnowledgeBaseLength = knowledgeBase.length;
    let oldSimplifiableExpLength = simplifiableExpressions.length;

    let newKnowledgeBaseLength = knowledgeBase.length;
    let newSimplifiableExpLength = simplifiableExpressions.length;
    do {
      expandKnowledgeBase(
        simplifiableExpressions,
        knowledgeBase,
        deductionStepsArr,
        alreadyInstantiatedPremises,
        combinations,
        unUsedSubs
      );

      addToSimplifiableExpressions(knowledgeBase, simplifiableExpressions);

      newKnowledgeBaseLength = knowledgeBase.length;
      newSimplifiableExpLength = simplifiableExpressions.length;

      if (
        oldKnowledgeBaseLength !== newKnowledgeBaseLength ||
        oldSimplifiableExpLength !== newSimplifiableExpLength
      ) {
        oldKnowledgeBaseLength = newKnowledgeBaseLength;
        oldSimplifiableExpLength = newSimplifiableExpLength;
        if (
          checkWithQuantifiableConclusion(
            knowledgeBase,
            deductionStepsArr,
            conclusionArr,
            usedSubstitutes
          )
        ) {
          steps.push(...deductionStepsArr);
          break;
        } else if (
          !steps.length &&
          checkForContradictionExploitaion(
            conclusionArr,
            knowledgeBase,
            deductionStepsArr
          )
        ) {
          steps.push(...deductionStepsArr);
          break;
        }
      } else {
        break;
      }
    } while (true);

    if (
      !steps.length &&
      checkWithQuantifiableConclusion(
        knowledgeBase,
        deductionStepsArr,
        conclusionArr,
        usedSubstitutes
      )
    ) {
      // const thisSteps = changeFromPropertyToStartAtOne(deductionStepsArr);
      steps.push(...deductionStepsArr);

      console.log(steps);
    } else if (
      !steps.length &&
      checkForContradictionExploitaion(
        conclusionArr,
        knowledgeBase,
        deductionStepsArr
      )
    ) {
      steps.push(...deductionStepsArr);
    }

    if (steps.length) {
      console.log(changeFromPropertyToStartAtOne(deductionStepsArr));
      return changeFromPropertyToStartAtOne(deductionStepsArr);
    }
  }
  return false;
};

export default inferThroughPermutations;