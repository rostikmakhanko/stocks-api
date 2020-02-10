// let curDiv = document.createElement("div");
// curDiv.innerHTML = "<p>Hello</p>";
// console.log(curDiv.innerHTML);
// document.body.appendChild(curDiv);
// document.getElementById("otherCompanies").appendChild(curDiv);

const json1 = [{
    "symbol": "MSFT",
    "open": "182.8450",
    "high": "185.6300",
    "low": "182.4800",
    "price": "183.8900",
    "volume": "33529074",
    "latest_trading_day": "2020-02-07",
    "previous_close": "183.6300",
    "change": "0.2600",
    "change_percent": "0.1416%"
}, {
    "symbol": "AAPL",
    "open": "322.3700",
    "high": "323.4000",
    "low": "318.0000",
    "price": "320.0300",
    "volume": "29421012",
    "latest_trading_day": "2020-02-07",
    "previous_close": "325.2100",
    "change": "-5.1800",
    "change_percent": "-1.5928%"
}, {
    "symbol": "GOOG",
    "open": "1467.3000",
    "high": "1485.8400",
    "low": "1466.3500",
    "price": "1479.2300",
    "volume": "1172270",
    "latest_trading_day": "2020-02-07",
    "previous_close": "1476.2300",
    "change": "3.0000",
    "change_percent": "0.2032%"
}];

const json = fetch("/api/v1/companies?companyName=google,twitter")
    .then((res) => {return res.json();})
    .then((json) => {drawCompanies(json);});

function drawCompanies(json) {
  let html = `<ul>`;
  for (let i = 0; i < json.length; i++) {
      if (json[i].Note) continue;

      const companyName = `<span class="company-name"> ${json[i].symbol} </span>`;
      const stockPrice = `<span class="stock-price"> ${json[i].price}</span>`;
      const gain = `<button onclick="" class="gain"> ${json[i].change_percent} </button>`;

      const companyItem = `<li> <div class="company-item">${companyName} <div class="stock-price-and-gain"> ${stockPrice} ${gain} </div> </div> </li>`;

      html += companyItem;
  }

  html += `</ul>`;

  let newDiv = document.createElement("div");
  newDiv.innerHTML = html;
  document.getElementById("otherCompanies").appendChild(newDiv);

  let status = new Map()
  for (let i = 0; i < 3; i++) {
      status.set(i, 0);
  }
  console.log("Hello1");
  let otherCompanies = document.getElementById("otherCompanies");
  let gainButtons = otherCompanies.querySelectorAll(".gain");
  for (let i = 0; i < gainButtons.length; i++) {
      gainButtons[i].index = i;
      //console.log("Hello");
      gainButtons[i].addEventListener("click", function (e) {
          //alert(e.target.innerHTML);
          const position = e.target.index;
          if (status.get(position) === 0) {
              status.set(position, 1);
              e.target.innerHTML = json[i].change;
          } else {
              status.set(position, 0);
              e.target.innerHTML = json[i].change_percent;
          }
          //e.target.innerHTML = 5;
      })
  }
}
