import getNegation from "../getNegation/getNegation";
import {
  addDeductionStep,
  convertImplicationToDisjunction,
  getOperator,
  searchInArray,
  searchIndex,
  splitArray,
} from "../../HelperFunctions/deductionHelperFunctions/deductionHelperFunctions";
import { DeductionStep } from "../../../types/sharedTypes";
import getDeMorganTransform from "../getDeMorganTransform/getDeMorganTransform";
import checkForHypotheticalSyllogism from "../checkForHypotheticalSyllogism/checkForHypotheticalSyllogism";

// recursive function to check different
// combinations within the knowledge base
const checkKnowledgeBase = (
  premise: string[],
  knowledgeBase: string[][],
  deductionStepsArr: DeductionStep[]
): boolean => {
  const operator = getOperator(premise);
  console.log("this is the premsie and operator");
  console.log(premise);
  console.log(operator);

  for (let i = 0; i < premise.length; i++) {
    if (premise[i].includes("\u2200") || premise[i].includes("\u2203")) {
      return false;
    }
  }

  if (searchInArray(knowledgeBase, premise)) {
    return true;
  }

  // if the proposition is not simplifiable
  if (!operator) {
    const return11 = searchInArray(knowledgeBase, premise) ? true : false;

    return return11;
  } else {
    const [before, after] = splitArray(premise, operator);

    if (operator === "~") {
      if (searchInArray(knowledgeBase, premise)) {
        return true;
      }
      const secondPremise = [...premise];
      const secondaryOperator = getOperator(secondPremise.slice(1));
      if (secondaryOperator) {
        const deMorganized = getDeMorganTransform(secondPremise);
        if (
          checkKnowledgeBase(deMorganized, knowledgeBase, deductionStepsArr)
        ) {
          addDeductionStep(
            deductionStepsArr,
            premise,
            "DeMorgan Theorem",
            `${searchIndex(knowledgeBase, deMorganized)}`
          );
          knowledgeBase.push(premise);
          return true;
        }
      }

      const negatedPremise = getNegation(premise);
      if (
        checkKnowledgeBase(negatedPremise, knowledgeBase, deductionStepsArr)
      ) {
        addDeductionStep(
          deductionStepsArr,
          premise,
          "Negation",
          `${searchIndex(knowledgeBase, negatedPremise)}`
        );
        knowledgeBase.push(premise);
        return true;
      }
    }

    if (operator === "|") {
      const existingElement = searchInArray(knowledgeBase, before)
        ? before
        : searchInArray(knowledgeBase, after)
        ? after
        : false;
      if (existingElement && !searchInArray(knowledgeBase, premise)) {
        addDeductionStep(
          deductionStepsArr,
          premise,
          "Addition",
          `${searchIndex(knowledgeBase, existingElement)}`
        );
        knowledgeBase.push(premise);
        return true;
      } else {
        const simplifiableElement = getOperator(before)
          ? getOperator(after)
            ? [before, after]
            : [before]
          : getOperator(after)
          ? [after]
          : undefined;
        if (simplifiableElement) {
          for (let i = 0; i < simplifiableElement?.length; i++) {
            if (
              checkKnowledgeBase(
                simplifiableElement[i],
                knowledgeBase,
                deductionStepsArr
              ) &&
              !searchInArray(knowledgeBase, premise)
            ) {
              addDeductionStep(
                deductionStepsArr,
                premise,
                "Addition",
                `${searchIndex(knowledgeBase, simplifiableElement[i])}`
              );
              knowledgeBase.push(premise);
              return true;
            }
          }
        }
      }
    } else if (operator === "&") {
      const existingBefore = searchInArray(knowledgeBase, before);
      const exisitngAfter = searchInArray(knowledgeBase, after);
      if (
        existingBefore &&
        exisitngAfter &&
        !searchInArray(knowledgeBase, premise)
      ) {
        addDeductionStep(
          deductionStepsArr,
          premise,
          "Conjunction",
          `${searchIndex(knowledgeBase, before)},${searchIndex(
            knowledgeBase,
            after
          )}`
        );
        knowledgeBase.push(premise);
        return true;
      } else {
        const simplifiableElements = getOperator(before)
          ? getOperator(after)
            ? [before, after]
            : [before]
          : getOperator(after)
          ? [after]
          : undefined;
        if (simplifiableElements) {
          return (
            checkKnowledgeBase(before, knowledgeBase, deductionStepsArr) &&
            checkKnowledgeBase(after, knowledgeBase, deductionStepsArr) &&
            checkKnowledgeBase(premise, knowledgeBase, deductionStepsArr)
          );
        }
      }
    } else if (operator === "->") {
      const impToDisj = convertImplicationToDisjunction(premise);

      if (checkKnowledgeBase(impToDisj, knowledgeBase, deductionStepsArr)) {
        addDeductionStep(
          deductionStepsArr,
          premise,
          "Material Implication",
          `${searchIndex(knowledgeBase, impToDisj)}`
        );
        knowledgeBase.push(premise);
        return true;
      } else if (
        checkForHypotheticalSyllogism(premise, knowledgeBase, deductionStepsArr)
      ) {
        return true;
      }
    } else if (operator === "<->") {
      const eliminatedBicondional = [
        ...["(", ...before, "->", ...after, ")"],
        "&",
        ...["(", ...after, "->", ...before, ")"],
      ];
      console.log(
        "this was the eleiminated biconditonal: " + eliminatedBicondional
      );
      if (
        checkKnowledgeBase(
          eliminatedBicondional,
          knowledgeBase,
          deductionStepsArr
        )
      ) {
        addDeductionStep(
          deductionStepsArr,
          premise,
          "Bicondional Introduction",
          `${searchIndex(knowledgeBase, eliminatedBicondional)}`
        );
        knowledgeBase.push(eliminatedBicondional);
        return true;
      }
    }
  }
  return false;
};

export default checkKnowledgeBase;