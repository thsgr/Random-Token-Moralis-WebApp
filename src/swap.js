/* 1inch swap START */

let dex;
const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const ONEINCH_ADDRESS = "0x111111111117dc0aa78b770fa6a738034120c302";

(async function(){

  await Moralis.initPlugins();
  dex = Moralis.Plugins.oneInch;

})();

export async function getQuote(token_addr, valueIn) {
    const quote = await Moralis.Plugins.oneInch.quote({
        chain: 'eth',
        fromTokenAddress: NATIVE_ADDRESS,
        toTokenAddress: token_addr,
        amount: valueIn,
    })
    .catch(function (error){
        console.log(error);
        return 0
    });
    console.log("Quote:", quote);
    return quote
}

export async function swap(rdm_token){

    let user = Moralis.User.current();
    if (!user) {
        alert('Please log in');
        return null;
    }

    let valueIn = document.querySelector('input[name="value-in"]').value;

    alert("Swaping !");

    const options = {chain:"eth",
                    fromTokenAddress: NATIVE_ADDRESS,
                    toTokenAddress: rdm_token,
                    amount: Number(Moralis.Units.ETH(valueIn)),
                    fromAddress: Moralis.User.current().get("ethAddress"),
                    slippage: 1
                    }

    var receipt = await dex.swap(options);
    console.log(receipt)
}

/* 1inch swap END */