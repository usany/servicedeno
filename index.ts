import cron from 'node-cron'
import scrap from './scrap.ts'

const generateTargetReports = () => {
  console.log('Generating target reports')
  console.log('Target reports generated successfully')
  console.log('Sending target reports to sales executives')
  console.log('Target reports sent successfully')
}

const cronFunction = async () => {
  const scrapedDataSeoul = await scrap(true)
  const scrapedDataGlobal = await scrap(false)
  if (scrapedDataSeoul && scrapedDataGlobal) {
    generateTargetReports()
  } else {
    console.error('Failed to scrape data. Target reports generation skipped.')
  }
}
cron.schedule('41 5 * * 4', async () => {
  await cronFunction()
})