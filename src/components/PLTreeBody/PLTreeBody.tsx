import React, { useEffect, useState } from "react";
import "./PLTreeBody.scss";
import NotebookLines from "../NotebookLines/NotebookLines";
import SLInputForm from "../SLInputForm/SLInputForm";
import constructTreeProof from "../../utils/PLTreeUtils/constructTreeProof/constructTreeProof";
import TreeNodeComponent from "../TreeNodeComponent/TreeNodeComponent";
import TreeNode from "../../utils/PLTreeUtils/TreeNode/TreeNode";
import { Link } from "react-router-dom";
import InfoLink from "../InfoLink/InfoLink";

type Props = {
  setNotebookLinesRender: React.Dispatch<React.SetStateAction<number>>;
};

/**
 * Renders the Semantic Tableaux Body
 *
 * @returns A JSX element with the argument input form, and tableaux on form submit.
 */
const PLTreeBody = ({ setNotebookLinesRender }: Props) => {
  const [rootNode, setRootNode] = useState<TreeNode>();
  const [propositionArr, setPropositionArr] = useState<string[]>([
    "P ∨ ( Q ∧ R )",
    "( P ∨ Q ) ∧ ( P ∨ R )",
  ]);

  const [firstRender, setFirstRender] = useState(true);
  const [premiseLength, setPremiseLength] = useState<number>(
    propositionArr.length + 1
  );

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    if (propositionArr) {
      const copiedPropositionArr = [...propositionArr];
      const conc = copiedPropositionArr.pop();
      if (!conc) return;
      const node = constructTreeProof(copiedPropositionArr, conc);
      setRootNode(node);
    }
  }, [propositionArr]);

  useEffect(() => {
    setNotebookLinesRender((prev) => prev + 1);
  }, [JSON.stringify(rootNode)]);

  return (
    <div className="PL-tree-body">
      <SLInputForm
        setPropositionArr={setPropositionArr}
        setPremiseLength={setPremiseLength}
        propositionArr={propositionArr}
        isQuantifiable={false}
        isSemenaticTableax={true}
      />
      {rootNode && (
        <div className="tree-node-container">
          <TreeNodeComponent node={rootNode} />
        </div>
      )}
    </div>
  );
};

export default PLTreeBody;
