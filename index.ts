import cron from 'node-cron'
import scrap from './scrap.ts'

const generateTargetReports = () => {
  console.log('Generating target reports')
  console.log('Target reports generated successfully')
  console.log('Sending target reports to sales executives')
  console.log('Target reports sent successfully')
}

cron.schedule('24 4 * * 4', scrap)
