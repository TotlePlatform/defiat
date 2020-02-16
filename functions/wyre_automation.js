const puppeteer = require('puppeteer')

const baseUrl = 'https://pay.sendwyre.com/purchase'

module.exports = async function(config) {
  let browser
  try {
    const options = {
      headless: true,
      args: ['--disable-features=site-per-process', '--no-sandbox', '--disable-setuid-sandbox']
    }
    browser = await puppeteer.launch(options)
    const page = await browser.newPage()

    await page.goto(`${baseUrl}?destCurrency=ETH&sourceAmount=${config.sourceAmount}&dest=ethereum:${config.destinationAddress}&paymentMethod=debit-card`)

    const [ terms ] = await page.$x('/html/body/div[1]/div/div/div/div/div/div[2]/div/div/div[5]/div/div/div[2]')
    await terms.click()

    const [ pay ] = await page.$x('/html/body/div[1]/div/div/div/div/div/div[2]/div/div/div[7]/div/button')
    await pay.click()

    await page.waitForSelector('#myId')
    const frame = page.frames().find((frame) => frame.url() === '')
    await frame.waitForSelector('#i1')

    await frame.type('#i1', config.number)
    await frame.type('#i2', config.expiry)
    await frame.type('#i3', config.cvc)

    await frame.click('#is')

    await page.waitForSelector('#firstName')

    await page.type('#firstName', config.firstName)
    await page.type('#lastName', config.lastName)
    await page.type('#phone', config.phone)
    await page.type('#email', config.email)

    const [ country ] = await page.$x('/html/body/div[1]/div/div/div/div/div/div[2]/div/div/div[8]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/div/form/div/div/div[3]/div/select')
    await country.type('US')

    const [ state ] = await page.$x('/html/body/div[1]/div/div/div/div/div/div[2]/div/div/div[8]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/div/form/div/div/div[4]/div/select')
    await state.type(config.state)

    const [ street ] = await page.$x('/html/body/div[1]/div/div/div/div/div/div[2]/div/div/div[8]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/div/form/div/div/div[5]/div/input')
    await street.type(config.street)

    const [ city ] = await page.$x('/html/body/div[1]/div/div/div/div/div/div[2]/div/div/div[8]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/div/form/div/div/div[6]/div/input')
    await city.type(config.city)

    const [ zip ] = await page.$x('/html/body/div[1]/div/div/div/div/div/div[2]/div/div/div[8]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/div/form/div/div/div[6]/div[2]/input')
    await zip.type(config.zip)

    const [ submit ] = await page.$x('/html/body/div[1]/div/div/div/div/div/div[2]/div/div/div[8]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/div/form/div/div/div[8]/div/div/button')
    await submit.click()
  } finally {
    // await browser.close()
  }
}