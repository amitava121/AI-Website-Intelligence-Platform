"use client";

import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ResponsiveContainerAny = ResponsiveContainer as any;
const RechartsLineChartAny = RechartsLineChart as any;
const CartesianGridAny = CartesianGrid as any;
const XAxisAny = XAxis as any;
const YAxisAny = YAxis as any;
const TooltipAny = Tooltip as any;
const LegendAny = Legend as any;
const LineAny = Line as any;

export default function GrowthChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainerAny width="100%" height="100%">
      <RechartsLineChartAny data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGridAny strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxisAny dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
        <YAxisAny axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dx={-10} />
        <TooltipAny 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
          cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <LegendAny iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 600 }} />
        <LineAny type="monotone" dataKey="yourSite" name="Your Site" stroke="#0066FF" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#0066FF' }} />
        <LineAny type="monotone" dataKey="competitor" name="Competitor" stroke="#94A3B8" strokeWidth={3} strokeDasharray="8 8" dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#94A3B8' }} />
      </RechartsLineChartAny>
    </ResponsiveContainerAny>
  );
}
