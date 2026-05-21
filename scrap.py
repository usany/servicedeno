import os
from playwright.async_api import async_playwright
import asyncio


async def scrap_dorm():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        print('Navigating to the list page...')
        link = 'https://dorm2.khu.ac.kr/50/5030.do#'
        await page.goto(link)
        
        await asyncio.gather(
            page.wait_for_load_state('domcontentloaded'),
            page.locator('a').filter(has_text='전체보기').first.click()
        )
        
        await page.wait_for_selector('td.te_left')
        menu_texts = await page.locator('td.te_left').all_inner_texts()
        print(menu_texts)
        print(len(menu_texts))
        
        await browser.close()


async def scrap_hufs(is_student: bool):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        print('Navigating to the list page...')
        link = ('https://www.hufs.ac.kr/hufs/11318/subview.do#click' 
                if is_student 
                else 'https://www.hufs.ac.kr/hufs/11318/subview.do?enc=Zm5jdDF8QEB8JTJGY2FmZXRlcmlhJTJGaHVmcyUyRjElMkZ2aWV3LmRvJTNGeWVhciUzRDIwMjYlMjZtb250aCUzRDA1JTI2c2VsRGF0ZSUzRDIwMjYwNTIxJTI2c2VsQ2FmSWQlM0RoMTAyJTI6')
        await page.goto(link)
        await page.wait_for_selector('td.no-menu, td.menu')
        menu_texts = await page.locator('td.no-menu, td.menu').all_inner_texts()
        print(menu_texts)
        print(len(menu_texts))
        
        await browser.close()


async def scrap(is_seoul: bool):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        print('Navigating to the list page...')
        link = ('https://www.khu.ac.kr/kor/user/bbs/BMSR00040/list.do?menuNo=200283&catId=136' 
                if is_seoul 
                else 'https://www.khu.ac.kr/kor/user/bbs/BMSR00040/list.do?menuNo=200283&catId=137')
        await page.goto(link)
        await page.wait_for_selector('tbody')
        
        # Find links in tbody
        locations = ['푸른솔', '청운관'] if is_seoul else ['학생회관']
        raw_links = []
        
        links = await page.query_selector_all('tbody a')
        for loc in locations:
            for el in links:
                text = await el.inner_text()
                if loc in text:
                    raw_links.append({
                        'href': await el.get_attribute('href'),
                        'text': text.strip(),
                        'onclick': await el.get_attribute('onclick')
                    })
                    break
        
        print(f'Found {len(raw_links)} links in tbody.')
        
        download_dir = os.path.join(os.path.dirname(__file__), 'downloads')
        if not os.path.exists(download_dir):
            os.makedirs(download_dir)
        
        for link_data in raw_links:
            if not link_data['href'] or link_data['href'].startswith('javascript:'):
                print(f'Handling link: {link_data["text"]}')
                
                if page.url != link:
                    await page.goto(link)
                    await page.wait_for_selector('tbody')
                
                try:
                    await asyncio.gather(
                        page.wait_for_load_state('domcontentloaded'),
                        page.locator('tbody a').filter(has_text=link_data['text']).first.click()
                    )
                except Exception as err:
                    print(f'Failed to navigate to {link_data["text"]}: {err}')
                    continue
            else:
                print(f'Visiting URL: {link_data["href"]}')
                try:
                    await page.goto(link_data['href'], wait_until='domcontentloaded')
                except Exception as err:
                    print(f'Failed to visit {link_data["href"]}: {err}')
                    continue
            
            title = await page.locator('p.txt06').inner_text()
            title = title.strip()
            
            # Find PNG images
            images = await page.query_selector_all('img')
            img_urls = []
            for img in images:
                src = await img.get_attribute('src')
                if src and src.endswith('.png') and 'decoGnb' not in src and 'footLogo' not in src and 'ico' not in src:
                    img_urls.append(src)
            
            print(f'Found {len(img_urls)} PNG images on this page.')
            
            for img_url in img_urls:
                try:
                    absolute_img_url = img_url if img_url.startswith('http') else f'{page.url}{img_url}'
                    image_name = 'c.png' if '청운관' in title else 'p.png' if '푸른솔' in title else 'h.png'
                    local_path = os.path.join(download_dir, image_name)
                    
                    response = await page.request.get(absolute_img_url)
                    if response.status == 200:
                        content = await response.body()
                        with open(local_path, 'wb') as f:
                            f.write(content)
                        print(f'Downloaded: {image_name}')
                except Exception as err:
                    print(f'Failed to download image {img_url}: {err}')
            
            # Go back to the list page for the next item
            await page.goto('https://www.khu.ac.kr/kor/user/bbs/BMSR00040/list.do?menuNo=200283')
            await page.wait_for_selector('tbody')
        
        await browser.close()
        print('Done.')
        return True


if __name__ == '__main__':
    asyncio.run(scrap(True))
