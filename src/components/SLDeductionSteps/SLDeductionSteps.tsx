import { useEffect, useRef, useState } from "react";
import { DeductionStep } from "../../types/sharedTypes";
import DeductionalRuleInfo from "../DeductionalRuleInfo/DeductionalRuleInfo";
import "./SLDeductionSteps.scss";
import { transformSymbolsForInput } from "../../utils/HelperFunctions/tranfromSymbols/transformSymbols";

type Props = {
  deductionSteps: DeductionStep[] | false;
  premiseLength: number;
};

const SLDeductionSteps = ({ deductionSteps, premiseLength }: Props) => {
  const [showRule, setShowRule] = useState<number | null>(null);
  const [visibleData, setVisibleData] = useState<DeductionStep[]>([]);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const stepRef = useRef<HTMLTableRowElement>(null);

  function showRuleInfo(index: number, e: React.MouseEvent) {
    if (showRule === index) setShowRule(null);
    else setShowRule(index);
  }

  useEffect(() => {
    const handleBlur = (e: MouseEvent) => {
      const clickedElement = e.target as HTMLElement;
      if (!clickedElement.closest(".info-button")) setShowRule(null);
    };

    if (showRule) {
      document.addEventListener("click", handleBlur);
    }

    return () => {
      document.removeEventListener("click", handleBlur);
    };
  }, [showRule]);

  useEffect(() => {
    if (!deductionSteps) return;
    setVisibleData([]);
    const renderWithDelay = async () => {
      for (const { obtained, from, rule } of deductionSteps) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setVisibleData((prevVisibleData) => [
          ...prevVisibleData,
          { obtained, from, rule },
        ]);
      }
    };

    renderWithDelay();
  }, [deductionSteps]);

  useEffect(() => {
    stepRef?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [visibleData]);

  return (
    <main className="SL-deduction-steps">
      {visibleData && visibleData.length > 0 && (
        <div className="deduction-steps">
          <h2>Deduction Steps:-</h2>

          <table>
            {/* <thead>
              <tr>
                <th></th>
                <th>Obtained</th>
                <th>From</th>
                <th>Rule</th>
              </tr>
            </thead> */}
            <tbody>
              {visibleData.map((item, index) => (
                <tr className="premise" key={index} ref={stepRef}>
                  <div>
                    <td className="premise-index">{premiseLength + index}.</td>
                    <td>{transformSymbolsForInput(item.obtained.join(""))}</td>
                  </div>
                  <td>
                    <span>{"from:"}</span> {item.from}
                  </td>
                  <div className="rule-container">
                    <td>
                      <span>{"rule:"}</span> {item.rule}
                    </td>
                    <td className="info-container">
                      <button
                        onClick={(e) => showRuleInfo(index, e)}
                        className="info-button"
                        ref={infoButtonRef}
                      >
                        ?
                      </button>
                      {showRule === index && (
                        <DeductionalRuleInfo rule={item.rule} />
                      )}
                    </td>
                  </div>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {deductionSteps ? (
        ""
      ) : (
        <div>
          <h2>This Argument is invalid</h2>
        </div>
      )}
    </main>
  );
};

export default SLDeductionSteps;