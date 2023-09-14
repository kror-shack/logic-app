import React, { useEffect, useState } from "react";
import { DeductionStep } from "../../types/PropositionalLogicTypes/PropositionalLogicTypes";
import getDeductionSteps from "../../utils/PropositionalLogicUtils/getDeductionSteps/getDeductionsteps";
import "./PLIndirectProofBody.scss";
import NotebookLines from "../NotebookLines/NotebookLines";
import SLInputForm from "../SLInputForm/SLInputForm";
import SLDeductionSteps from "../SLDeductionSteps/SLDeductionSteps";
import getContradictionSteps from "../../utils/PLIndirectProofUtils/getContradictionSteps/getContradictionSteps";
import { transformSymbolsForDisplay } from "../../utils/HelperFunctions/tranfromSymbols/transformSymbols";
import { Link } from "react-router-dom";
import InfoLink from "../InfoLink/InfoLink";

const PLIndirectProofBody = () => {
  const [deductionSteps, setDeductionSteps] = useState<DeductionStep[] | false>(
    []
  );

  const [propositionArr, setPropositionArr] = useState<string[]>([
    "(S ∨ R) -> (¬P -> Q)",
    "¬S -> ¬(T -> Q)",
    "R -> ¬T",
    "¬P",
    "¬R -> Q",
    "S -> ¬Q",
    "¬S -> T",
    "(T -> R) ∧ ¬S",
  ]);
  const [premiseLength, setPremiseLength] = useState<number>(
    propositionArr.length
  );
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    if (propositionArr) {
      const copiedPropositionArr = [...propositionArr];
      const conc = copiedPropositionArr.pop();
      if (!conc) return;
      const newDeductionSteps = getContradictionSteps(
        copiedPropositionArr,
        conc
      );

      setDeductionSteps(newDeductionSteps);
    }
  }, [propositionArr]);

  return (
    <div className="Propositional-logic-body">
      <InfoLink url="/info/propositional-logic-indirect-proof" />
      <SLInputForm
        setPropositionArr={setPropositionArr}
        setPremiseLength={setPremiseLength}
        propositionArr={propositionArr}
        isQuantifiable={false}
      />
      <SLDeductionSteps
        deductionSteps={deductionSteps}
        premiseLength={premiseLength}
      />
    </div>
  );
};

export default PLIndirectProofBody;
