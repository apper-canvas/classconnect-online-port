import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  type = "input", 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  placeholder,
  required = false,
  options = [],
  rows,
  leftIcon,
  rightIcon,
  ...props 
}) => {
  const commonProps = {
    label: required ? `${label} *` : label,
    name,
    value,
    onChange,
    error,
    placeholder,
    leftIcon,
    rightIcon,
    ...props
  };

  switch (type) {
    case "textarea":
      return <Textarea {...commonProps} rows={rows} />;
    case "select":
      return (
        <Select {...commonProps}>
          <option value="">Select {label?.toLowerCase()}...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    default:
      return <Input type={type} {...commonProps} />;
  }
};

export default FormField;