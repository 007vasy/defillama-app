import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { ChartWrapper } from '.'
import { toNiceDateYear, formattedNum, toNiceMonthlyDate } from 'utils'

interface IStackedDataset {
  [key: string]: number
}

interface IChainColor {
  [key: string]: string
}

interface IDaySum {
  [key: number]: number
}

interface IProps {
  stackOffset?: 'expand'
  formatPercent: boolean
  stackedDataset: IStackedDataset
  chainsUnique: string[]
  chainColor: IChainColor
  daySum: IDaySum
}

const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`

const getPercent = (value, total) => {
  const ratio = total > 0 ? value / total : 0

  return toPercent(ratio, 2)
}

export const ChainDominanceChart = ({
  stackOffset,
  formatPercent,
  stackedDataset,
  chainsUnique,
  chainColor,
  daySum
}: IProps) => (
  <ChartWrapper>
    <AreaChart
      data={stackedDataset}
      stackOffset={stackOffset}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0
      }}
    >
      <XAxis dataKey="date" tickFormatter={toNiceMonthlyDate} />
      <YAxis tickFormatter={tick => toPercent(tick)} />
      <Tooltip
        formatter={(val, chain, props) =>
          formatPercent ? getPercent(val, daySum[props.payload.date]) : formattedNum(val)
        }
        labelFormatter={label => toNiceDateYear(label)}
        itemSorter={p => -p.value}
        labelStyle={{ color: 'black', fontWeight: '500' }}
      />
      {chainsUnique.map(chainName => (
        <Area
          type="monotone"
          dataKey={chainName}
          key={chainName}
          stackId="1"
          fill={chainColor[chainName]}
          stroke={chainColor[chainName]}
        />
      ))}
    </AreaChart>
  </ChartWrapper>
)
