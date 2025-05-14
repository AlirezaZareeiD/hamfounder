
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const [strength, setStrength] = useState(0);
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setCriteria({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
      return;
    }
    
    const updatedCriteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    
    setCriteria(updatedCriteria);
    
    // Calculate strength based on criteria
    const metCriteriaCount = Object.values(updatedCriteria).filter(Boolean).length;
    setStrength(metCriteriaCount);
  }, [password]);

  const getStrengthLabel = () => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    if (strength === 4) return "Strong";
    return "Very Strong";
  };

  const getStrengthColor = () => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-yellow-500";
    if (strength === 4) return "bg-green-500";
    return "bg-green-500";
  };

  const getStrengthWidth = () => {
    return `${Math.max(5, (strength / 5) * 100)}%`;
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex justify-between items-center">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${getStrengthColor()} transition-all duration-300 ease-out`}
            style={{ width: getStrengthWidth() }}
          ></div>
        </div>
        <span className="ml-2 text-xs whitespace-nowrap">{getStrengthLabel()}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center">
          <span className={`inline-block w-4 h-4 rounded-full mr-2 flex items-center justify-center ${criteria.length ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
            {criteria.length && <Check className="h-3 w-3" />}
          </span>
          <span className={criteria.length ? 'text-slate-700' : 'text-slate-500'}>8+ characters</span>
        </div>
        <div className="flex items-center">
          <span className={`inline-block w-4 h-4 rounded-full mr-2 flex items-center justify-center ${criteria.uppercase ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
            {criteria.uppercase && <Check className="h-3 w-3" />}
          </span>
          <span className={criteria.uppercase ? 'text-slate-700' : 'text-slate-500'}>Uppercase</span>
        </div>
        <div className="flex items-center">
          <span className={`inline-block w-4 h-4 rounded-full mr-2 flex items-center justify-center ${criteria.lowercase ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
            {criteria.lowercase && <Check className="h-3 w-3" />}
          </span>
          <span className={criteria.lowercase ? 'text-slate-700' : 'text-slate-500'}>Lowercase</span>
        </div>
        <div className="flex items-center">
          <span className={`inline-block w-4 h-4 rounded-full mr-2 flex items-center justify-center ${criteria.number ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
            {criteria.number && <Check className="h-3 w-3" />}
          </span>
          <span className={criteria.number ? 'text-slate-700' : 'text-slate-500'}>Number</span>
        </div>
      </div>
    </div>
  );
};
