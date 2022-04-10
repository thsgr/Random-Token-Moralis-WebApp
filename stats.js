import {round, getRndInteger} from "/utils.js"


/* Token Stats START */

export function updateStats(prices){

    // RSI Handling
    let rsi = computeRSI(prices);
    document.getElementById("RSI").innerHTML = rsi;
    if (rsi > 70) {
        let color = "#008000";
        document.getElementById("RSI").style.color = color;
    }
    else if (rsi < 30) {
        let color = "#FF0000";
        document.getElementById("RSI").style.color = color;
    }
    else {
        let color = "#111827";
        document.getElementById("RSI").style.color = color;
    }
  
  
    // MOM Handling
    let mom = computeMOM(prices);
    document.getElementById("MOM").innerHTML = mom;
    if (mom > 0) {
      let color = "#008000";
      document.getElementById("MOM").style.color = color;
    }
    else if (mom < 0) {
      let color = "#FF0000";
      document.getElementById("MOM").style.color = color;
    }
    else if (mom = 0) {
      let color = "#111827";
      document.getElementById("MOM").style.color = color;
    }
  
  
    // ROI Handling
    let pctChange = computePctChange(prices);
    let pctChangePct = "".concat(pctChange).concat("%");
    document.getElementById("7d%").innerHTML = pctChangePct;
    if (pctChange > 0) {
      let color = "#008000";
      document.getElementById("7d%").style.color = color;
    }
    else if (pctChange < 0) {
      let color = "#FF0000";
      document.getElementById("7d%").style.color = color;
    }
    else if (pctChange = 0) {
      let color = "#111827";
      document.getElementById("7d%").style.color = color;
    }
  
  
    let score = opportunityBuySell(prices, rsi, mom, pctChange)
    console.log("SCORE", score)
    let opportunity = "Neutral";
    if (score >= 100)
      {
        opportunity = "BUY Opportunity !";
        let color = "#008000";
        document.getElementById("opp").style.color = color;
      }
    else if (score <= -100)
      {
        opportunity = "SELL Opportunity !";
        let color = "#FF0000";
        document.getElementById("opp").style.color = color;
      }
    else {
        let color = "#111827"
        document.getElementById("opp").style.color = color;
    }
    document.getElementById("opp").innerHTML = opportunity;
    
}
  
function expMovAverage(prices, period){
    let A = 2/(1+period);

    let ema = [sum(prices.slice(0, period))];

    for (let i = 0; i < prices.length-period; i++) {
        ema.append(ema[0] + A*(prices[period+i]-ema[0]));
    }

    return ema
}
  
function computeRSI(prices){
  
    let period = document.querySelector('input[name="time"]:checked').value;
  
    let pricesRSI = prices.slice(-period);
  
    let sumGain = 0;
    let sumLoss = 0;
    for (let i = 1; i < pricesRSI.length; i++)
      {
          let delta = prices[i] - prices[i-1];
          if (delta >= 0)
          {
              sumGain += delta;
          }
          else
          {
              sumLoss -= delta;
          }
      }
    if (sumGain == 0) return 0;
  
    let rsi = 100*(sumGain/(sumGain+sumLoss));
    rsi = round(rsi, 0)
  
    return rsi
  }
  
function computeMOM(prices){
    let mom = prices[prices.length-1] - prices[0]
    mom = round(mom,0)
    return mom
}
  
function computePctChange(prices){
    let pctChange = prices[prices.length-1] - prices[0]
    pctChange = pctChange/prices[0]
    pctChange = round(pctChange,2)
    return pctChange
}
  
function computeStd(prices){
    let n = prices.length
    let mean = prices.reduce((a, b) => a + b) / n
    return Math.sqrt(prices.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}
  
function opportunityBuySell(prices, rsi, mom, pctChange){
    
    let scoreRSI = -1000 * (1/(Math.exp(60-rsi)+1) + 1/(Math.exp(40-rsi)+1) - 1)
  
    let std = computeStd(prices)
    let scorePctChange = 1000 * (1/(Math.exp(std+0.5-pctChange)+1) + 1/(Math.exp(-std-0.5-pctChange)+1) - 1)
  
    let score = (scoreRSI + scorePctChange)/2
  
    return score
}
  
  /* Token Stats END */