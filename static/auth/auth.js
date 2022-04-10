/* Moralis init code */

const serverUrl = "https://yekvcyxltd9g.usemoralis.com:2053/server";
const appId = "f3Sh5CAK8wyaRcmLlmabMDDS2FwdSYZBGGuq6V1B";
Moralis.start({ serverUrl, appId });

/* Authentication code */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
    const user = await Moralis.authenticate({
      signingMessage: "Log in using Moralis",
    })
      .then(function (user) {
        console.log("logged in user:", user);
        console.log(user);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  display();

}

function display() {
  let user = Moralis.User.current();
  if (user != null) {
    let account_adress = user.get("accounts")[0];
    let begin = account_adress.substring(0,6);
    let end = account_adress.substr(-3);
    let final = begin.concat("...", end, " connected");
    document.getElementById("btn-login").innerHTML = final;
    let img = '<img id="thmb2" src="/images/Ethereum-Logo.png" width="50" height="50" alt="" onerror="rm(this)">'
    document.getElementById("thmb").innerHTML=img;

  }
  let img = '<img id="thmb2" src="/images/Ethereum-Logo.png" width="50" height="50" alt="" onerror="rm(this)">'
  document.getElementById("thmb2").innerHTML=img;
  return null
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
  document.getElementById("btn-login").innerHTML = "Login"
  document.getElementById("thmb").innerHTML = ""
}

window.onload = display();
document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;