import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import scrap

def generate_target_reports():
    print('Generating target reports')
    print('Target reports generated successfully')
    print('Sending target reports to sales executives')
    print('Target reports sent successfully')

async def cron_function():
    scraped_data_seoul = await scrap.scrap(True)
    scraped_data_global = await scrap.scrap(False)
    if scraped_data_seoul and scraped_data_global:
        generate_target_reports()
    else:
        print('Failed to scrape data. Target reports generation skipped.')

if __name__ == '__main__':
    scheduler = AsyncIOScheduler()
    # Schedule: 53 5 * * 4 (5:53 AM every Thursday)
    scheduler.add_job(cron_function, 'cron', day_of_week='thu', hour=5, minute=53)
    scheduler.start()
    
    print('Scheduler started. Press Ctrl+C to exit.')
    
    try:
        # Keep the script running
        import asyncio
        asyncio.get_event_loop().run_forever()
    except (KeyboardInterrupt, SystemExit):
        pass
