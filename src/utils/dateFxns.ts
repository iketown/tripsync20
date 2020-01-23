import moment, { Moment } from 'moment'

export const getArrayOfDates = ({
  first,
  last
}: {
  first: string
  last: string
}): Moment[] => {
  const firstDay = moment(first)
    .startOf('day')
  const lastDay = moment(last).endOf('day')

  const array = []
  let latestDay = firstDay
  while (latestDay < lastDay) {
    array.push(latestDay)
    latestDay = latestDay.clone().add(1, 'day')
  }
  return array
}
