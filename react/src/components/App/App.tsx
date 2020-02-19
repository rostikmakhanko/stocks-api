import React, {MouseEventHandler, useState} from 'react';
import './App.css';
import './search.svg';
import {Stocks} from '../stocks';
import { StockItem } from '../../mocks';
import { ReactComponent as FilterSvg } from "../../assets/filter.svg";
import { ReactComponent as RefreshSvg } from "../../assets/refresh.svg";
import { ReactComponent as SearchSvg } from "../../assets/search.svg";
import { ReactComponent as SettingsSvg } from "../../assets/settings.svg";

interface AppProps {
  initialState: Array<StockItem>,
}

interface State {
  stocks: StockItem[],
  name: string,
  gain: string,
  from: number,
  to: number,
  displaySearchForm: boolean,
}

class App extends React.Component<AppProps, State> {
  state = {
    stocks: [],
    name: "",
    gain: "",
    from: 0,
    to: 0,
    displaySearchForm: false,
  };

  async componentDidMount() {
    const res = await fetch("http://127.0.0.1:3000/api/v1/companies?companyName=WIX,twitter")
    const data = await res.json();
    console.log(data);

    this.setState({
      stocks: data,
      name: "",
      displaySearchForm: false,
    })
  }

  handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      name: e.currentTarget.value,
    });
  };

  handleGainChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      gain: e.currentTarget.value,
    });
  };

  handleFromChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      from: +e.currentTarget.value,
    });
  };

  handleToChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      to: +e.currentTarget.value,
    });
  };

  handleFilterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({
      displaySearchForm: !this.state.displaySearchForm,
    });
  };

  handleSubmitClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await fetch(`http://127.0.0.1:3000/api/v1/companies?companyName=${this.state.name}`);
    const data = await res.json();

    this.setState({
      stocks: data,
    });

    console.log('----', this.state.name);
  };

  getListOfCompaniesSymbols() {
    let listOfCompaniesSymbols: Array<string> = this.state.stocks.map(stock => Object(stock).symbol);
    return listOfCompaniesSymbols;
  }

  handleRefreshClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let listOfCompaniesSymbols: Array<string> = await this.getListOfCompaniesSymbols();
    const res = await fetch(`http://127.0.0.1:3000/api/v1/companies?companyName=${listOfCompaniesSymbols.join(',')}`);
    const data = await res.json();

    this.setState({
      stocks: data,
    });
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
                <button aria-label="Refresh" onClick={this.handleRefreshClick} className="navigation-button">
                  <RefreshSvg />
                </button>
              </li>
              <li>
                <button aria-label="Filter" onClick={this.handleFilterClick} className="navigation-button">
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

          {
            (this.state.displaySearchForm ?
            <form action="./apply.html" className="search-form">
              <div className="inputs">
                <div className="input-column">
                  <div className="by-name">
                    <span className="input-description">By Name</span><input type="text" className="search-input"
                                                                             onChange={this.handleNameChange}/>
                  </div>
                  <div className="by-gain">
                    <span className="input-description">By Gain</span><input type="text" className="search-input"
                                                                             onChange={this.handleGainChange}/>
                  </div>
                </div>
                <div className="input-column">
                  <div className="by-range-from">
                    <span className="input-description">By Range: From</span><input type="number" min="0"
                                                                                    className="search-input" onChange={this.handleFromChange}/>
                  </div>
                  <div className="by-range-to">
                    <span className="input-description">By Range: To</span><input type="number" min="0"
                                                                                  className="search-input" onChange={this.handleToChange}/>
                  </div>
                </div>
              </div>
              <button onClick={this.handleSubmitClick} className="apply">Apply</button>
            </form> : <div></div>)
          }

          <Stocks items={this.state.stocks} />
        </div>
    );
  }
}

export default App;
