import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useEffect, useState } from 'react';

export const DriftChart = () => {
  const [data, setData] = useState<any[]>([]);
  const drift = useStore((state) => state.currentDrift);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          val: drift.translation.length() + (Math.random() - 0.5) * 0.005
        }];
        if (newData.length > 20) return newData.slice(1);
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [drift]);

  return (
    <Card variant="technical">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-xs uppercase tracking-widest opacity-60">Drift Correction (Translation RMSE)</CardTitle>
      </CardHeader>
      <CardContent className="h-32 p-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 0.1]} />
            <Tooltip 
              contentStyle={{ background: '#111', border: '1px solid #333', fontSize: '10px' }}
              labelStyle={{ display: 'none' }}
            />
            <Line 
              type="monotone" 
              dataKey="val" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
