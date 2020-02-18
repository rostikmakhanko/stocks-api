import React, {MouseEventHandler, useState} from 'react';
import './App.css';
import './search.svg';
import {Stocks} from '../stocks';
import { StockItem } from '../../mocks';
import { ReactComponent as FilterSvg } from "../../assets/filter.svg";
import { ReactComponent as LogoSvg } from "../../assets/logo.svg";
import { ReactComponent as RefreshSvg } from "../../assets/refresh.svg";
import { ReactComponent as SearchSvg } from "../../assets/search.svg";
import { ReactComponent as SettingsSvg } from "../../assets/settings.svg";
// import searchSvg from 'react-svg-loader!./search.svg'

interface AppProps {
  initialState: Array<StockItem>,
}

interface State {
  stocks: StockItem[],
  name: string,
}

class App extends React.Component<AppProps, State> {
  // const [stocks] = useState(props.initialState)

  state = {
    stocks: [],
    name: "",
    // stocks: this.props.initialState
  };

  async componentDidMount() {
    const res = await fetch("http://127.0.0.1:3000/api/v1/companies?companyName=WIX,twitter,google")
    const data = await res.json();
    console.log(data);

    this.setState({
      stocks: data,
      name: "",
    })
  };

  handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    // this.setState((prevState) => ({
    //     ...prevState,
    //   name: e.currentTarget.value,
    // }));

    this.setState({
      name: e.currentTarget.value,
    });
  };

  handleSubmitClick = (e: any) => {
    e.preventDefault();
    console.log('----', this.state.name);
  };

  render() {
    return (
        <div className="App">
          <div className="logo-and-options">
            <p className="logo">STOKR</p>
            <ul className="options">
              <li>
                <button aria-label="Search" className="navigation-button">
                  <SearchSvg />
                </button>
              </li>
              <li>
                <button aria-label="Refresh" className="navigation-button">
                  <RefreshSvg />
                </button>
              </li>
              <li>
                <button aria-label="Filter" className="navigation-button">
                  <FilterSvg />
                </button>
              </li>
              <li>
                <button aria-label="Settings" className="navigation-button">
                  <SettingsSvg />
                </button>
              </li>
            </ul>
          </div>

          <form action="./apply.html" className="search-form">
            <div className="inputs">
              <div className="input-column">
                <div className="by-name">
                  <span className="input-description">By Name</span><input type="text" className="search-input" onChange={this.handleNameChange}/>
                </div>
                <div className="by-gain">
                  <span className="input-description">By Gain</span><input type="text" className="search-input"/>
                </div>
              </div>
              <div className="input-column">
                <div className="by-range-from">
                  <span className="input-description">By Range: From</span><input type="text" className="search-input"/>
                </div>
                <div className="by-range-to">
                  <span className="input-description">By Range: To</span><input type="text" className="search-input"/>
                </div>
              </div>
            </div>
            <button onClick={this.handleSubmitClick} className="apply">Apply</button>
          </form>

          <Stocks items={this.state.stocks} />
        </div>
    );
  }
}

export default App;
