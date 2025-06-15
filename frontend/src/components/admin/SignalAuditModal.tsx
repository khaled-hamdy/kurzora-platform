
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { User, Clock, Calendar } from 'lucide-react';

interface SignalAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  signal: {
    id: string;
    symbol: string;
    type: string;
    status: string;
    entryPrice: string;
    currentPrice: string;
    pnl: string;
    createdAt: string;
    createdBy: string;
    lastModified: string | null;
    lastModifiedBy: string | null;
    isShariahCompliant: boolean;
    notes: string;
  } | null;
}

const SignalAuditModal: React.FC<SignalAuditModalProps> = ({ isOpen, onClose, signal }) => {
  if (!signal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Signal Audit Trail</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{signal.symbol}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={signal.status === 'active' ? 'default' : signal.status === 'closed' ? 'secondary' : 'outline'}>
                {signal.status}
              </Badge>
              {signal.isShariahCompliant && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Halal
                </Badge>
              )}
            </div>
            <p className="text-slate-300 text-sm">{signal.notes}</p>
          </div>

          <div className="space-y-4">
            <div className="border-l-2 border-blue-500 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 font-medium">Created</span>
              </div>
              <p className="text-white text-sm">
                Created by <span className="font-medium">{signal.createdBy}</span>
              </p>
              <div className="flex items-center space-x-1 text-slate-400 text-xs mt-1">
                <Calendar className="h-3 w-3" />
                <span>{signal.createdAt}</span>
              </div>
            </div>

            {signal.lastModified && (
              <div className="border-l-2 border-amber-500 pl-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 font-medium">Last Modified</span>
                </div>
                <p className="text-white text-sm">
                  Modified by <span className="font-medium">{signal.lastModifiedBy}</span>
                </p>
                <div className="flex items-center space-x-1 text-slate-400 text-xs mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>{signal.lastModified}</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-700/30 p-3 rounded">
              <p className="text-slate-400">Entry Price</p>
              <p className="text-white font-semibold">{signal.entryPrice}</p>
            </div>
            <div className="bg-slate-700/30 p-3 rounded">
              <p className="text-slate-400">Current P&L</p>
              <p className={`font-semibold ${signal.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {signal.pnl}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignalAuditModal;
