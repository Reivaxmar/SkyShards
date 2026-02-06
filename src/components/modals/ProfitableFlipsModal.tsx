import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, TrendingUp, Coins, DollarSign } from "lucide-react";
import { getRarityColor } from "../../utilities";
import type { ProfitableFlip } from "../../types/types";

interface ProfitableFlipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  flips: ProfitableFlip[];
  loading: boolean;
}

const formatPrice = (price: number): string => {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(2)}M`;
  }
  if (price >= 1_000) {
    return `${(price / 1_000).toFixed(2)}K`;
  }
  return price.toFixed(2);
};

export const ProfitableFlipsModal: React.FC<ProfitableFlipsModalProps> = ({ isOpen, onClose, flips, loading }) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] flex flex-col border border-slate-700" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Profitable Flips</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-md transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-400">Calculating profitable flips...</div>
            </div>
          ) : flips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingUp className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Profitable Flips Found</h3>
              <p className="text-slate-400 text-sm max-w-md">
                There are currently no shards where fusing is more profitable than direct farming or buying.
                Try adjusting your settings or check back when market prices change.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-slate-400 border-b border-slate-700">
                <div className="col-span-3">Shard</div>
                <div className="col-span-3">Recipe (Input 1 + Input 2)</div>
                <div className="col-span-2 text-right">Fusion Cost</div>
                <div className="col-span-2 text-right">Sell Price</div>
                <div className="col-span-2 text-right">Profit</div>
              </div>

              {/* Table Rows */}
              {flips.map((flip, index) => (
                <div
                  key={`${flip.shardId}-${index}`}
                  className="grid grid-cols-12 gap-2 px-3 py-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-md transition-colors border border-slate-700/50"
                >
                  {/* Shard Name */}
                  <div className="col-span-3 flex items-center">
                    <span className={`font-medium ${getRarityColor(flip.rarity)}`}>
                      {flip.shardName}
                    </span>
                  </div>

                  {/* Recipe */}
                  <div className="col-span-3 flex items-center text-sm text-slate-300">
                    <span className="truncate">
                      {flip.recipe.inputs[0]} + {flip.recipe.inputs[1]}
                    </span>
                  </div>

                  {/* Fusion Cost */}
                  <div className="col-span-2 flex items-center justify-end text-sm">
                    <div className="flex items-center gap-1 text-red-400">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{formatPrice(flip.fusionCost)}</span>
                    </div>
                  </div>

                  {/* Sell Price */}
                  <div className="col-span-2 flex items-center justify-end text-sm">
                    <div className="flex items-center gap-1 text-blue-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{formatPrice(flip.sellPrice)}</span>
                    </div>
                  </div>

                  {/* Profit */}
                  <div className="col-span-2 flex items-center justify-end">
                    <div className="flex items-center gap-1 text-green-400 font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      <span>{formatPrice(flip.profit)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-400">
              {!loading && flips.length > 0 && `Showing ${flips.length} profitable flip${flips.length === 1 ? '' : 's'}`}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
