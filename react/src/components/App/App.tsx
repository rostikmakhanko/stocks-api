import React from 'react';
import classNames from 'classnames';

import './App.css';
import './search.svg';
import { Stocks } from '../Stocks';
import { StockItem } from '../../mocks';
import { ReactComponent as FilterSvg } from '../../assets/filter.svg';
import { ReactComponent as RefreshSvg } from '../../assets/refresh.svg';
import { ReactComponent as SearchSvg } from '../../assets/search.svg';
import { ReactComponent as SettingsSvg } from '../../assets/settings.svg';
import { ReactComponent as BigSearchSvg } from '../../assets/big_search.svg';
import { getCompanies } from '../../services/getCompanies';

interface AppProps {
  initialState: Array<StockItem>;
}

interface State {
  stocks: StockItem[];
  name: string;
  gain: string;
  from: number;
  to: number;
  displaySearchForm: boolean;
  displayFilterForm: boolean;
}

class App extends React.Component<AppProps, State> {
  state = {
    stocks: [],
    name: '',
    gain: '',
    from: 0,
    to: 0,
    displaySearchForm: false,
    displayFilterForm: false,
  };

  async componentDidMount() {
    const data = await getCompanies('WIX,twitter');
    console.log(data);

    this.setState({
      stocks: data,
      name: '',
      displaySearchForm: false,
      displayFilterForm: false,
    });
  }

  handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    // console.log(e.currentTarget.name)
    // console.log(e.currentTarget.value)
    this.setState({ [name]: value } as any);
  };

  handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({
      displaySearchForm: !this.state.displaySearchForm,
    });
  };

  handleFilterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({
      displayFilterForm: !this.state.displayFilterForm,
    });
  };

  handleSubmitClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const data = await getCompanies(this.state.name);

    this.setState({
      stocks: data,
    });

    console.log('----', this.state.name);
  };

  getListOfCompaniesSymbols() {
    let listOfCompaniesSymbols: Array<string> = Array.from(
      this.state.stocks,
    ).map(stock => Object(stock).symbol);
    return listOfCompaniesSymbols;
  }

  handleRefreshClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let listOfCompaniesSymbols: Array<string> = await this.getListOfCompaniesSymbols();
    const data = await getCompanies(listOfCompaniesSymbols.join(','));

    this.setState({
      stocks: data,
    });
  };

  render() {
    return (
      <div>
        <div className={classNames({ hidden: !this.state.displaySearchForm })}>
          <div className="search-by-name-header">
            <input className="search-by-name-input" />
            <button
              className="search-by-name-cancel-button"
              onClick={this.handleSearchClick}
            >
              Cancel
            </button>
          </div>
          <div className="search-by-name-image-and-text">
            <BigSearchSvg />
            <p className="search-by-name-text">Search</p>
          </div>
        </div>

        <div className={classNames({ hidden: this.state.displaySearchForm })}>
          <div>
            <div className="logo-and-options">
              <p className="logo">STOKR</p>
              <ul className="options">
                <li>
                  <button
                    aria-label="Search"
                    onClick={this.handleSearchClick}
                    className="navigation-button"
                  >
                    <SearchSvg />
                  </button>
                </li>
                <li>
                  <button
                    aria-label="Refresh"
                    onClick={this.handleRefreshClick}
                    className="navigation-button"
                  >
                    <RefreshSvg />
                  </button>
                </li>
                <li>
                  <button
                    aria-label="Filter"
                    onClick={this.handleFilterClick}
                    className="navigation-button"
                  >
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
          </div>

          <form
            action="./apply.html"
            className={classNames('search-form', {
              hidden: !this.state.displayFilterForm,
            })}
          >
            <div className="inputs">
              <div className="input-column">
                <div className="by-name">
                  <span className="input-description">By Name</span>
                  <input
                    type="text"
                    name="name"
                    className="search-input"
                    onChange={this.handleNameChange}
                  />
                </div>
                <div className="by-gain">
                  <span className="input-description">By Gain</span>
                  <input
                    type="text"
                    name="gain"
                    className="search-input"
                    onChange={this.handleNameChange}
                  />
                </div>
              </div>
              <div className="input-column">
                <div className="by-range-from">
                  <span className="input-description">By Range: From</span>
                  <input
                    type="number"
                    name="from"
                    min="0"
                    className="search-input"
                    onChange={this.handleNameChange}
                  />
                </div>
                <div className="by-range-to">
                  <span className="input-description">By Range: To</span>
                  <input
                    type="number"
                    name="to"
                    min="0"
                    className="search-input"
                    onChange={this.handleNameChange}
                  />
                </div>
              </div>
            </div>
            <button onClick={this.handleSubmitClick} className="apply">
              Apply
            </button>
          </form>

          <Stocks items={this.state.stocks} />
        </div>
      </div>
    );
  }
}

export default App;
