import React from 'react';
import { StockItem } from '../../mocks';
import { Stock } from './Stock';
import { useStocks } from './useStocks';

interface StocksProps {
  items: StockItem[];
}

export const Stocks: React.FC<StocksProps> = props => {
  const { mode, toggleMode } = useStocks('percent');

  return (
    <div>
      {Array.from(props.items).map(item => (
        <Stock
          key={item.symbol}
          item={item}
          mode={mode}
          toggleMode={toggleMode}
        />
      ))}
    </div>
  );
};

export default Stocks;
