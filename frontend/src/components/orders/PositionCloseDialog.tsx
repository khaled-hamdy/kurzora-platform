
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Position {
  id: string;
  symbol: string;
  name: string;
  entryPrice: number;
  currentPrice: number;
  shares: number;
}

interface PositionCloseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: Position | null;
  onConfirm: (positionId: string, closePrice: number) => void;
}

const PositionCloseDialog: React.FC<PositionCloseDialogProps> = ({
  open,
  onOpenChange,
  position,
  onConfirm,
}) => {
  const [closePrice, setClosePrice] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!position) return;
    
    const price = parseFloat(closePrice);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price');
      return;
    }
    
    onConfirm(position.id, price);
    setClosePrice('');
    setError('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setClosePrice('');
    setError('');
    onOpenChange(false);
  };

  if (!position) return null;

  // P&L calculation: (close_price - entry_price) * shares
  const closePriceNum = parseFloat(closePrice);
  const priceValid = !isNaN(closePriceNum) && closePriceNum > 0;
  const priceDifference = priceValid ? closePriceNum - position.entryPrice : 0;
  const estimatedPnL = priceValid ? priceDifference * position.shares : 0;

  // Currency formatting function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-800 border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Close Position: {position.symbol}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            Enter the closing price for your {position.shares} shares of {position.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Entry Price:</span>
              <span className="text-white ml-2">${position.entryPrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-400">Current Price:</span>
              <span className="text-white ml-2">${position.currentPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="closePrice" className="text-slate-300">
              Closing Price *
            </Label>
            <Input
              id="closePrice"
              type="number"
              step="0.01"
              placeholder="Enter closing price"
              value={closePrice}
              onChange={(e) => {
                setClosePrice(e.target.value);
                setError('');
              }}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>
          
          {priceValid && (
            <div className="bg-slate-700/50 p-4 rounded-md space-y-3">
              <div className="text-sm font-medium text-slate-300 border-b border-slate-600 pb-2">
                P&L Calculation Formula:
              </div>
              
              <div className="text-sm text-slate-400">
                P&L = Number of Shares × (Closing Price − Entry Price)
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="text-slate-400">
                  P&L = {position.shares} × (${closePriceNum.toFixed(2)} − ${position.entryPrice.toFixed(2)})
                </div>
                <div className="text-slate-400">
                  P&L = {position.shares} × ${priceDifference.toFixed(2)}
                </div>
                <div className="text-white font-semibold border-t border-slate-600 pt-2">
                  <span className="text-slate-400">Estimated P&L:</span>
                  <span className={`ml-2 text-lg ${estimatedPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {estimatedPnL >= 0 ? '+' : ''}{formatCurrency(Math.abs(estimatedPnL))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleCancel}
            className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Close Position
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PositionCloseDialog;
