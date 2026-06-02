import * as React from "react"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

export const ChartConfig = {}
export const ChartContainer = ({ children }: { children: React.ReactNode; config: any }) => (
  <div className="w-full h-full">{children}</div>
)
export const ChartTooltip = Tooltip
export const ChartTooltipContent = () => null