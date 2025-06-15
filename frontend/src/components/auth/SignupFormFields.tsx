
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { User, Mail, Lock } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormFieldsProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignupFormFields: React.FC<SignupFormFieldsProps> = ({ formData, onChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-300">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={onChange}
            className="pl-10 bg-slate-800/50 border-blue-800/30 text-white placeholder-slate-400"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-300">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={onChange}
            className="pl-10 bg-slate-800/50 border-blue-800/30 text-white placeholder-slate-400"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-300">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={onChange}
            className="pl-10 bg-slate-800/50 border-blue-800/30 text-white placeholder-slate-400"
            required
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Password must contain:
          <ul className="ml-4 mt-1">
            <li>• At least 8 characters</li>
            <li>• One uppercase letter</li>
            <li>• One number</li>
          </ul>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={onChange}
            className="pl-10 bg-slate-800/50 border-blue-800/30 text-white placeholder-slate-400"
            required
          />
        </div>
      </div>
    </>
  );
};

export default SignupFormFields;
