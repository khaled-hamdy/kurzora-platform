
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '../../hooks/use-toast';

interface CreateSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSignalModal: React.FC<CreateSignalModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    type: '',
    status: '',
    notes: '',
    isShariahCompliant: false
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log('Creating signal:', formData);
    
    toast({
      title: "Signal Created",
      description: `New ${formData.type} signal for ${formData.symbol} has been created.`,
    });
    
    // Reset form and close modal
    setFormData({
      symbol: '',
      entryPrice: '',
      stopLoss: '',
      takeProfit: '',
      type: '',
      status: '',
      notes: '',
      isShariahCompliant: false
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Signal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Symbol</Label>
              <Input
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value)}
                placeholder="e.g., EUR/USD, AAPL"
                className="bg-slate-700 border-slate-600 text-white mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-slate-300">Signal Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="Buy">Buy</SelectItem>
                  <SelectItem value="Sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-slate-300">Entry Price</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.entryPrice}
                onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                placeholder="0.0000"
                className="bg-slate-700 border-slate-600 text-white mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-slate-300">Stop Loss</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.stopLoss}
                onChange={(e) => handleInputChange('stopLoss', e.target.value)}
                placeholder="0.0000"
                className="bg-slate-700 border-slate-600 text-white mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-slate-300">Take Profit</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.takeProfit}
                onChange={(e) => handleInputChange('takeProfit', e.target.value)}
                placeholder="0.0000"
                className="bg-slate-700 border-slate-600 text-white mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-slate-300">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300">Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any notes about this signal..."
              className="bg-slate-700 border-slate-600 text-white mt-1 min-h-[80px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="shariah"
              checked={formData.isShariahCompliant}
              onCheckedChange={(checked) => handleInputChange('isShariahCompliant', checked as boolean)}
              className="border-slate-600"
            />
            <Label htmlFor="shariah" className="text-slate-300">
              This stock is Shariah-compliant
            </Label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose}
              className="flex-1 bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Signal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSignalModal;
