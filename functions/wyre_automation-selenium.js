// require('geckodriver')
//
// const webdriver = require('selenium-webdriver'),
//   By = webdriver.By,
//   until = webdriver.until
//
// var firefox = require('selenium-webdriver/firefox');
// var options = new firefox.Options();
// options.addArguments("-headless");
//
// const baseUrl = 'https://pay.sendwyre.com/purchase'
//
// const accountId = 'AC_67VHV7QYDUU'
//
// module.exports = async function(config) {
//   let driver
//   try {
//     driver = await new webdriver.Builder()
//       .forBrowser('firefox')
//       .setFirefoxOptions(options)
//       .build()
//
//     await driver.get(`${baseUrl}?destCurrency=ETH&sourceAmount=${config.sourceAmount}&dest=ethereum:${config.destinationAddress}&paymentMethod=debit-card&referenceId=${config.referenceId}&referrerAccountId=${accountId}&url=https://us-central1-defiat-492ca.cloudfunctions.net/api/wyre-success`)
//
//     const terms = await driver.findElement(By.xpath('/html/body/div[1]/div/div/div/div/div/div[2]/div/div/div[5]/div/div/div[2]'))
//     await terms.click() // checkbox terms and conditions
//
//     const pay = await driver.findElement(By.xpath('/html/body/div[1]/div/div/div/div/div/div[2]/div/div/div[7]/div/button'))
//     await pay.click() // click pay button
//
//     await driver.sleep(4000)
//     await driver.switchTo().frame(driver.findElement(By.id('myId')))
//
//     const creditcard = await driver.findElement(By.id('i1'))
//     creditcard.sendKeys(config.number)
//     creditcard.sendKeys(webdriver.Key.TAB)
//
//     const exp = await driver.findElement(By.id('i2'))
//     exp.sendKeys(config.expiry)
//     exp.sendKeys(webdriver.Key.TAB)
//
//     const cvc = await driver.findElement(By.id('i3'))
//     cvc.sendKeys(config.cvc)
//     cvc.sendKeys(webdriver.Key.RETURN)
//
//     await driver.sleep(4000)
//     await driver.switchTo().frame(0)
//
//     const firstName = await driver.findElement(By.id('firstName'))
//     firstName.sendKeys(config.firstName)
//     firstName.sendKeys(webdriver.Key.TAB)
//
//     const lastName = await driver.findElement(By.id('lastName'))
//     lastName.sendKeys(config.lastName)
//     lastName.sendKeys(webdriver.Key.TAB)
//
//     const phone = await driver.findElement(By.id('phone'))
//     phone.sendKeys(config.phone)
//     phone.sendKeys(webdriver.Key.TAB)
//
//     const email = await driver.findElement(By.id('email'))
//     email.sendKeys('bobburgers@gmail.com')
//     email.sendKeys(webdriver.Key.TAB)
//
//     const country = await driver.findElement(By.id('address.country'))
//     country.sendKeys(webdriver.Key.ARROW_DOWN)
//     country.sendKeys(webdriver.Key.ENTER)
//     country.sendKeys(webdriver.Key.TAB)
//
//     const state = await driver.findElement(By.id('address.state'))
//     state.sendKeys(config.state)
//     state.sendKeys(webdriver.Key.ENTER)
//     state.sendKeys(webdriver.Key.TAB)
//
//     const street = await driver.findElement(By.id('address.street'))
//     street.sendKeys(config.street)
//     street.sendKeys(webdriver.Key.TAB)
//
//     const city = await driver.findElement(By.id('address.city'))
//     city.sendKeys(config.city)
//     city.sendKeys(webdriver.Key.TAB)
//
//     const zip = await driver.findElement(By.id('address.zipcode'))
//     zip.sendKeys(config.zip)
//     zip.sendKeys(webdriver.Key.TAB)
//
//     const submit = await driver.findElement(By.xpath('/html/body/div[1]/div/div/div/div/div/div[2]/div/div/div[8]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/div/form/div/div/div[8]/div/div/button'))
//     await submit.click()
//   } finally {
//     await driver && driver.quit();
//   }
// }