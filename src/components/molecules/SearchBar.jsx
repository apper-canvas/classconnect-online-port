import { useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        leftIcon={<ApperIcon name="Search" className="h-4 w-4" />}
        rightIcon={
          searchTerm && (
            <button
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ApperIcon name="X" className="h-4 w-4" />
            </button>
          )
        }
        className="pr-10"
      />
    </div>
  );
};

export default SearchBar;