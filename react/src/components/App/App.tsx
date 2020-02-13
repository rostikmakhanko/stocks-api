import React, {useState} from 'react';
import './App.css';
import './search.svg';
import {Stocks} from '../stocks';
import { StockItem } from '../../mocks';
// import searchSvg from 'react-svg-loader!./search.svg'

interface AppProps {
  initialState: Array<StockItem>,
}

interface State {
  stocks: StockItem[],
}

class App extends React.Component<AppProps, State> {
  // const [stocks] = useState(props.initialState)

  state = {
    stocks: []
    // stocks: this.props.initialState
  };

  async componentDidMount() {
    const res = await fetch("http://127.0.0.1:3000/api/v1/companies?companyName=WIX,twitter")
    const data = await res.json();
    console.log(data);

    this.setState({
      stocks: data,
    })
  }

  render() {
    return (
        <div className="App">
          <div className="logo-and-options">
            <p className="logo">STOKR</p>
            <ul className="options">
              <li>
                <button aria-label="Search" className="navigation-button">
                  <img src="searchSvg"/>
                </button>
              </li>
              <li>
                <button aria-label="Refresh" className="navigation-button">
                  <img src="refresh.svg"/>
                </button>
              </li>
              <li>
                <button aria-label="Filter" className="navigation-button">
                  <img src="filter.svg"/>
                </button>
              </li>
              <li>
                <button aria-label="Settings" className="navigation-button">
                  <img src="settings.svg"/>
                </button>
              </li>
            </ul>
          </div>

          <Stocks items={this.state.stocks} />
        </div>
    );
  }
}

export default App;
