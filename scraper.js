const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const basePath = 'https://www.funko.com';
async function getAllProducts() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(basePath + '/products?productBrands=pop!');
    const html = await page.$eval('.products-container', e => e.outerHTML);

    return {page, html};
}

async function getProduct(page, productLink) {
    await page.goto(basePath + productLink);

    const html = await page.$eval('#siteContainer', e => e.outerHTML);
    const $ = cheerio.load(html, {normalizeWhitespace: true});

    return $('div.product-price.span').text();
}

getAllProducts().then(
    async ({page, html}) => {
        const $ = cheerio.load(html, {normalizeWhitespace: true});
        const products = $('div.catalog-product');

        const mappedProductLinks = products.map((index, element) => $(element).find('a')[0].attribs['href']).get();

        for (const link of mappedProductLinks) {
            const price = await getProduct(page, link);
            console.log('Price is: ', price);
        }
        process.exit(0);
    },
    err => {
        console.error(err);
        process.exit(1);
    },
);
