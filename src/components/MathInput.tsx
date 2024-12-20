import { EditableMathField } from "react-mathquill";

const MathInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  return (
    <div className="w-full p-2 border rounded bg-white">
      <EditableMathField
        latex={value}
        onChange={(mathField) => onChange(mathField.latex())}
        className="w-full"
        style={{ fontSize: "1.5rem" }}
      />
      <div>Plaintext:{value}</div>
    </div>
  );
};

export default MathInput