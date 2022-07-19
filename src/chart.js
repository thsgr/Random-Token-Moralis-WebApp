import {round, getRndInteger} from "/utils.js"
import {updateStats} from "/stats.js"

let days = document.querySelector('input[name="time"]:checked').value;

let dates = Array(Number(days)).fill().map((e,i) =>
  moment().subtract(i, "d").format("YYYY-MM-DD")
  ).reverse()

let prices = dates.map(e => getRndInteger(1,10))

export async function fetchData(symbol, addr){

    days = document.querySelector('input[name="time"]:checked').value;

    // Dates
    dates = Array(Number(days)).fill().map((e,i) =>
    moment().subtract(i, "d").format("YYYY-MM-DD")
    ).reverse()

    let n = Math.floor(dates.length/2)

    // If days is too big, Moralis will ban our IP address so we can only make a few requests

    if (days > 7) {

        // For days > 7, makeup some random data for demo purposes

        prices = dates.map(e => getRndInteger(1,10))
    }
    else if (days == 7){

        // For days == 7, fetch real price data

        // Fetch blocks
        let blocks = await Promise.all(dates.map(async (e,i) =>
            await Moralis.Web3API.native.getDateToBlock({date:e})
            ))

        
        // Fetch prices
        let pricesBlock = await Promise.all(blocks.map(async (e,i) =>
            await Moralis.Web3API.token.getTokenPrice({address:addr, to_block:e.block})
            ))

        prices = pricesBlock.map(e => e.usdPrice)
    }

    updateStats(prices);

};

export async function chartLine(symbol){
    // Simple Line Chart

    // Setup data for chart
    const data = {
        labels: dates,
        datasets: [{
        data: prices,
        label: symbol,
        fill: false,
        tension: 0.2,
        backgroundColor: 'rgb(12, 34, 236)',
        borderColor: 'rgb(12, 34, 236)',
        }]
    };

    const plugins = {
        title: {
        display: false,
        color: 'rgb(12, 34, 236)',
        labels: "Price"
        }
    };

    const options = {
        plugins: plugins,
        animations: {
        tension: {
            duration: 2000,
            easing: 'linear',
            from: 0.2,
            to: 0.35,
            loop: true
        }
        }
    };

    const config = {
        type: 'line',
        data: data,
        options: options
    };

    // Chart
    if(window.priceChart instanceof Chart){
        priceChart.destroy()
    };

    window.priceChart = new Chart(
        document.getElementById('priceChart'),
        config
    )
};

export async function chartOHLC(){
    // OHLC Chart

    var trace1 = {
  
    x: dates.slice(0,-1),

    close: prices.slice(1),

    decreasing: {line: {color: '#FF0000'}}, 
    
    high: prices.map(e => e + getRndInteger(1,10)/5),

    increasing: {line: {color: '#00FF00'}}, 
    
    line: {color: '#0000FF'}, 
    
    low: prices.map(e => e - getRndInteger(1,10)/5),
    open: prices.slice(0,-1),

    type: 'ohlc', 
    xaxis: 'x', 
    yaxis: 'y'
  };
  
  var data1 = [trace1];
  
  var layout1 = {
    dragmode: 'zoom', 
    margin: {
      r: 10, 
      t: 25, 
      b: 40, 
      l: 60
    }, 
    showlegend: false, 
    xaxis: {
      autorange: true, 
      rangeslider: {range: [dates[0], dates[-1]]}, 
      title: 'Date', 
      type: 'date'
    }, 
    yaxis: {
      autorange: true, 
      type: 'linear'
    }
  };

  var trace2 = {
    x: dates.slice(0,-1),
    close: prices.slice(1),    
    high: prices.map(e => e + e*getRndInteger(1,3)/50), //For now random High/Low because fetching intraday prices makes too many API calls
    low: prices.map(e => e - e*getRndInteger(1,3)/50), //For now random High/Low because fetching intraday prices makes too many API calls
    open: prices.slice(0,-1),
  
    increasing: {line: {color: 'green'}},
    decreasing: {line: {color: 'red'}},
  
    type: 'ohlc',
    xaxis: 'x',
    yaxis: 'y'
  };
  
  var data2 = [trace2];
  
  var layout2 = {
    margin: {
        r: 10, 
        t: 25, 
        b: 40, 
        l: 60
      }, 
    yaxis: {
        gridcolor: 'rgba(54,54,54,0.25)',
        autorange: true,
        type: 'linear',
        zerolinecolor: 'rgba(54,54,54,0.5)',
        zerolinewidth: 2,
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    xaxis: {
        gridcolor: 'rgba(54,54,54,0.25)',
        rangeslider: {
        visible: false
        },
    yaxis: {
        gridcolor: 'rgba(54,54,54,0.25)',
        autorange: true,
        type: 'linear',
        zerolinecolor: 'rgba(54,54,54,0.5)',
        zerolinewidth: 2,
    },
    dragmode: 'zoom',
    showlegend: false,
    }
  };

  var config2 = {
    responsive: true
  }

  Plotly.newPlot('ohlc', data2, layout2, config2);
};

export async function SwapDivsWithClick(symbol, addr)
    {
       let div1 = "ohlc";
       let div2 = "line";

       let d1 = document.getElementById(div1);
       let d2 = document.getElementById(div2);

       fetchData(symbol, addr)

          let check = document.getElementById("ohlc-show").checked;
          let checkLine = document.getElementById("line-show").checked;
          if( check )
          {
              d1.style.display = "block";
              d2.style.display = "none";
              chartOHLC();
              return null
          }
          else if (checkLine) {
            d1.style.display = "none";
            d2.style.display = "block";
            chartLine(symbol);
            return null
          }
    };

export function SwapDivsWithClickNoFetch(symbol, addr)
    {
        let div1 = "ohlc";
        let div2 = "line";

        let d1 = document.getElementById(div1);
        let d2 = document.getElementById(div2);

        let check = document.getElementById("ohlc-show").checked; 

        if( check )
        {
            d1.style.display = "block";
            d2.style.display = "none";
            chartOHLC();
        }
        else
        {
            d1.style.display = "none";
            d2.style.display = "block";
            chartLine(symbol);
        }

        updateStats(prices);
    };

/* Token Price Chart END */