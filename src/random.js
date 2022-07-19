import {getRndInteger} from "./utils.js"
import {SwapDivsWithClick, SwapDivsWithClickNoFetch} from "/chart.js"
import {getQuote, swap} from "/swap.js"
import {spin} from "/animate.js"

// Variables globales
let symbol;
let rdm_token;

async function getRandomTokens() {
  let tokens = await Moralis.Plugins.oneInch.getSupportedTokens({
    chain: 'eth', 
  })
      .then(function (tokens) {
          const keys = Object.keys(tokens.tokens);
          const len = keys.length;
          const rdm = getRndInteger(0, len);
          rdm_token = keys[rdm];
          symbol = tokens.tokens[rdm_token].symbol;
          return [symbol, rdm_token]
      })
      .catch(function (error) {
              console.log(error)
      });

      return tokens;
}


function newToken(){
  document.getElementById("rdm-tok1").style.display = "none";
  document.getElementById('image-grid').style.display = "block";
  // document.getElementById("rdm-tok1").style.fontSize = "20px";

  setTimeout(function() {
    let img1 = document.getElementById("img1")
    let img2 = document.getElementById("img2")
    let img3 = document.getElementById("img3")
    let img4 = document.getElementById("img4")

    spin(img1)
    spin(img2)
    spin(img3)
    spin(img4)
  },
  100);



  let array = getRandomTokens()
  let res = array.then(function (array) {
    symbol = array[0];
    rdm_token = array[1];

    
    setTimeout(function(){
      document.getElementById('image-grid').style.display = "none";
      SwapDivsWithClick(symbol, rdm_token);
      updateTokenHTML(symbol);
      updateTokenQuote(symbol, rdm_token);
    }, 5000);


    })
    .catch(function (error) {
    console.log(error)
    });
}

function updateTokenHTML(symbol){
  let symbolDollar = "$".concat(symbol);
  
  document.getElementById("rdm-tok4").innerHTML = symbolDollar;
  document.getElementById("rdm-tok2").innerHTML = symbolDollar;
  document.getElementById("rdm-tok1").style.fontSize = "50px";
  document.getElementById("rdm-tok1").innerHTML = symbolDollar;
  document.getElementById("rdm-tok3").innerHTML = symbolDollar.concat("/USD");
  document.getElementById("rdm-tok1").style.display = "block";
  document.getElementById('image-grid').style.display = "none";
  return null
}

async function updateTokenQuote(symbol, rdm_token){

  let valueIn = document.querySelector('input[name="value-in"]').value;

  let quote = await getQuote(rdm_token, valueIn)
  .then(function(quote) {
  let quotePrice = quote.toTokenAmount;

  let quoteText = "".concat(quotePrice).concat(" $").concat(symbol)
  if (quotePrice == undefined) {
    let quoteText = "Unavailable !";
    document.getElementById("tkn-recv-amnt").innerHTML = quoteText;
    return null
  }
  document.getElementById("tkn-recv-amnt").innerHTML = quoteText;
  });
  }

// Buttons
document.getElementById("btn-tok").onclick = newToken
document.getElementById("btn-quote").onclick = function(){updateTokenQuote(symbol, rdm_token)}
document.getElementById("btn-swap").onclick = function(){swap(rdm_token)};

document.getElementById("week").onclick = function(){SwapDivsWithClick(symbol, rdm_token)}
document.getElementById("2week").onclick = function(){SwapDivsWithClick(symbol, rdm_token)}
document.getElementById("month").onclick = function(){SwapDivsWithClick(symbol, rdm_token)}

document.getElementById("ohlc-show").onclick = function(){SwapDivsWithClickNoFetch(symbol, rdm_token)};
document.getElementById("line-show").onclick = function(){SwapDivsWithClickNoFetch(symbol, rdm_token)}

