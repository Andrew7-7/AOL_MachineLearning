import "./numberInputForms.css";

interface numberInputFormProps {
  label: string;
  name: string;
  placeHolder: string;
  value: any;
  onChange: any;
}

const NumberInputForm: React.FC<numberInputFormProps> = ({
  label,
  name,
  placeHolder,
  value,
  onChange,
}) => {
  return (
    <div className="number-input-form">
      <p className="label">{label}</p>
      <input
        className="input"
        name={name}
        value={value}
        type="number"
        onChange={onChange}
        placeholder={placeHolder}
      />
    </div>
  );
};

export default NumberInputForm;
