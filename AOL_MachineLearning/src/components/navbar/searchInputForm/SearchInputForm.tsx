import { useEffect, useState } from "react";
import "./searchInputForm.css";

interface searchInputFormProps {
  label: string;
  name: string;
  placeHolder: string;
  type: string;
  value: any;
  onChange: any;
  setValue: any;
  inputItems: string[];
}

const SearchInputForm: React.FC<searchInputFormProps> = ({
  label,
  name,
  placeHolder,
  type,
  value,
  onChange,
  inputItems,
  setValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="search-input-form">
      <p className="label">{label}</p>
      <input
        className="input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeHolder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {isFocused && inputItems.length > 0 && (
        <div className="input-item-container">
          {inputItems.map((item, index) => (
            <div
              key={index}
              className="input-item"
              onMouseDown={() => setValue(name, item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInputForm;
