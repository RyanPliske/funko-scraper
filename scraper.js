const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function getData() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://www.funko.com/products?productBrands=pop!');

    return await page.$eval('.main-content', e => e.outerHTML);
}

getData().then(
    res => {
        const $ = cheerio.load(res, {normalizeWhitespace: true});
        const products = $('div.catalog-product');
        const mappedProducts = products.map((index, element) => {
            const name = element.find('product-card__name').text();
            const price = element.find('product-card__price').text();
            return {name, price};
        });
        console.log(mappedProducts);

        process.exit(0);
    },
    err => {
        console.error(err);
        process.exit(1);
    },
);
