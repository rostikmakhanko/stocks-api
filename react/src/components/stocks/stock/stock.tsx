import React, { useCallback, useState } from 'react';
import { StockItem } from '../../../mocks';
import { StocksMode } from '../useStocks';

interface StockProps {
  item: StockItem;
  mode: StocksMode;
  toggleMode: () => void;
}

export const Stock: React.FC<StockProps> = ({ item, mode, toggleMode }) => {
  return (
    <div key={item.symbol}>
      <div className="company-item">
        <span className="company-name">
          {item.symbol + ' (' + item.name + ')'}
        </span>
        <div className="stock-price-and-gain">
          <span className="stock-price">{item.price}</span>
          <button className="gain" onClick={() => toggleMode()}>
            {mode === 'absolute' ? item.change : item.change_percent}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stock;
