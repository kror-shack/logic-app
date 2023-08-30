import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import NotebookLines from "../../components/NotebookLines/NotebookLines";
import Header from "../../components/Header/Header";
import "./ReportIssuePage.scss";

export const ReportIssuePage = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
  const [snackbar, setSnackBar] = useState<string | undefined>();

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formRef.current);

    if (formRef.current && serviceId && templateId && publicKey) {
      emailjs.sendForm(serviceId, templateId, formRef.current, publicKey).then(
        (result) => {
          formRef?.current?.reset();
          setSnackBar("Your issue has been sucessfully reported!");
        },
        (error) => {
          setSnackBar(
            "There was a technical error while reporting your issue. Please try again in a while."
          );
        }
      );
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const delayedFunction = () => {
      setSnackBar(undefined);
    };

    if (snackbar) {
      // Clear any previously set tmeouts
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(delayedFunction, 5000);
    }

    // Clean up the timeout when the component unmounts or when the value changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbar]);

  return (
    <div>
      <Header heading="Report an Issue" />
      <main className="Report-issue-page">
        <NotebookLines />
        <div>
          {snackbar !== undefined && (
            <div
              className={
                snackbar
                  ? snackbar === "Your issue has been sucessfully reported!"
                    ? "show-snack-bar snack-bar success"
                    : "show-snack-bar snack-bar error"
                  : "snack-bar"
              }
            >
              {snackbar}
            </div>
          )}
          <form ref={formRef} onSubmit={sendEmail}>
            <div className="email-container">
              <label>Email:</label>
              <input
                name="user_email"
                type="email"
                placeholder="If you would like to receive an update"
              />
            </div>
            <label>Q) Which page did the issue occur on?</label>
            <div className="radio-container">
              <label>
                <input type="radio" name="page" value="PLCalc" />
                PL Calculator
              </label>
              <label>
                <input type="radio" name="page" value="QLCalc" />
                FOL Calculator
              </label>
              <label>
                <input type="radio" name="page" value="TPG" />
                FOL Semantic Tableaux
              </label>
              <label>
                <input type="radio" name="page" value="QLIndirectProof" />
                QL Indirect Proof
              </label>
              <label>
                <input type="radio" name="page" value="PLIndirectProof" />
                PL Indirect Proof
              </label>
              <label>
                <input type="radio" name="page" value="VennWizard" />
                Venn Wizard
              </label>
              <label>
                <input type="radio" name="page" value="TruthTableGenerator" />
                Truth Table Generator
              </label>
              <label>
                <input type="radio" name="page" value="Other" />
                Other
              </label>
            </div>
            <label>Q) Was the issue technical or logical?</label>
            <div className="radio-container">
              <label>
                <input type="radio" name="issueType" value="technical" />
                Technical
              </label>
              <label>
                <input type="radio" name="issueType" value="logical" />
                Logical
              </label>
            </div>
            <label>Describe the issue:</label>
            <textarea
              name="message"
              rows={4}
              placeholder="Please describe the issue that you are facing in detail."
            />
            <button type="submit">Report</button>
            <p className="feedback">Your feedback is always appreciated. </p>
            <p>
              You can also reach me at
              <a href="mailto:kororshack.helpdesk@gmail.com">
                krorshack.helpdesk@gmail.com
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};