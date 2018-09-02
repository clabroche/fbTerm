const fs = require('fs');
const gui = require('./src/gui');
const helpers = require('./src/helpers');
const fse = require('fs-extra');
const fb = require('./src/fb');
const credentials = require('./credentials.json');
const sidebar = require('./src/gui/sidebar')
const loading = require('./src/gui/loading')
const conv = require('./src/gui/conv')
const loadConv = require('./src/gui/loadConv')
// const home = require('./src/gui/home')
const blessed = require('./src/gui/blessed');

(async () => {
  // const conver = [{"who":"Dieu","body":"Un moine boudiste qui peut communiquer par la pensée avec n'importe qui grâce à ses galets...  Et un pc"},{"who":"me","body":"x)"},{"who":"Dieu","body":"Le mec a fait un gif x)"},{"who":"me","body":"Toujours pour les readme x)"},{"who":"Dieu","body":"c'est stylé x)"},{"who":"me","body":"Ouais assez x) dire que derrière un chrome que tu contrôle par programmation x)"},{"who":"Dieu","body":"Stylé !"},{"who":"Dieu","body":"Tu fais quoi le week-end prochain?"},{"who":"me","body":"Je vais voir mon frère a Épinal il aura déménager"},{"who":"me","body":"Pourquoi ?"},{"who":"Dieu","body":"Ah dommage je fais mon anniversaire avec Kevin"},{"who":"me","body":"du coup je vais voir pour annuler avec mon frere et les parents de vanessa"},{"who":"Dieu","body":"Ah ouais ? T'es pas obligé hein c'est pas un gros truc tu louperas pas grand chose"},{"who":"me","body":"ouais mais bon c'est quand meme ton anniv"},{"who":"Dieu","body":"ouais c'est sur mais bon je peu en faire n'ioorte quand"},{"who":"me","body":"au fait joyeux non anniversaire du coup"},{"who":"Dieu","body":"Merci, sympa d'y avoir pensé !"}]
  // conv.render(conver)
  // return
  // conv.submit.subscribe(text => {
  //   console.log(text)
  // })
  // return;
  loading.render('Remove previous session')
  await removeData()
  loading.render('Launch browser')
  await gui.launchPuppeteer()
  loading.render('Go to facebook')
  await gui.goToUrl('https://facebook.com/messages')
  loading.render(`Log in with ${credentials.email} account`)
  await fb.login()
  loading.render(`Get friends`)
  const friends = await fb.getFriends()
  loading.destroy()
  sidebar.render(friends, 'name').subscribe(async friend=>{
    loadConv.render()
    const convs = await fb.getFriend(friend)
    loadConv.destroy()
    conv.render(convs, friend)
  })
  
})().catch(console.error);


async function removeData() {
  // gui.writeCenter('Remove data')
  await fse.remove('./userData')
  await fse.remove('./png')
  await fse.mkdir('./png')
}



