import { chromium } from 'playwright'

const run = async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const link = 'https://www.hufs.ac.kr/hufs/11318/subview.do#click';
    console.log('Navigating to:', link);
    await page.goto(link);
    await page.waitForSelector('table');
    
    const tdClasses = await page.$$eval('td', tds => 
        tds.map(td => ({
            className: td.className,
            text: td.innerText.trim().substring(0, 30)
        })).filter(info => info.className)
    );
    
    console.log('Found TD elements with classes:', tdClasses);
    await browser.close();
};

run().catch(console.error);
