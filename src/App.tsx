// Import necessary libraries and components
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "tailwindcss/tailwind.css";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import JSONDataList from "./components/jsonDataList";
import MathInput from "./components/MathInput";
import SolveForm from "./components/form/solve-form";
import EvaluateForm from "./components/form/evaluate-form";
// import 'react-mathquill/dist/mathquill.css';
addStyles();
// const MathInput = ({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (val: string) => void;
// }) => {
//   return (
//     <div className="w-full p-2 border rounded bg-white">
//       <EditableMathField
//         latex={value}
//         onChange={(mathField) => onChange(mathField.latex())}
//         className="w-full"
//         style={{ fontSize: "1.5rem" }}
//       />
//       <div>Plaintext:{value}</div>
//     </div>
//   );
// };

const App: React.FC = () => {
  const [format, setFormat] = useState(FormFormat.Solve.toString()); // State for format

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Math Question JSON Generator</h1>

      {/* Format Selector */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          Select JSON Format:
        </label>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            id={FormFormat.Solve}
            name="format"
            value={FormFormat.Solve}
            checked={format === FormFormat.Solve}
            onChange={(e) => setFormat(e.target.value)}
            className="mr-2"
          />
          <label htmlFor={FormFormat.Solve} className="mr-4">
            Original Format
          </label>

          <input
            type="radio"
            id={FormFormat.Evaluation}
            name="format"
            value={FormFormat.Evaluation}
            checked={format === FormFormat.Evaluation}
            onChange={(e) => setFormat(e.target.value)}
            className="mr-2"
          />
          <label htmlFor={FormFormat.Evaluation}>Evaluation Format</label>
        </div>
      </div>
      {format === FormFormat.Solve && <SolveForm />}
      {format === FormFormat.Evaluation && <EvaluateForm />}
    </div>
  );
};

export enum FormFormat {
  Solve = "solve",
  Evaluation = "evaluation",
}

export default App;
