
import React, { useEffect, useRef } from 'react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface CandlestickData {
  date: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

interface CandlestickChartProps {}

// Generate random candlestick data for demo purposes
const generateData = (): CandlestickData[] => {
  const data: CandlestickData[] = [];
  let price = 1000;
  
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.5) * 30;
    const open = price;
    price = open + change;
    const high = Math.max(open, price) + Math.random() * 10;
    const low = Math.min(open, price) - Math.random() * 10;
    
    data.push({
      date: i,
      open,
      close: price,
      high,
      low,
      volume: Math.floor(Math.random() * 1000),
    });
  }
  
  return data;
};

const CandlestickChart: React.FC<CandlestickChartProps> = () => {
  const chartDataRef = useRef(generateData());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw candlesticks on canvas for more customization than recharts offers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const data = chartDataRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find min and max values for scaling
    const allValues = data.flatMap(d => [d.high, d.low]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min;
    
    // Scale to fit canvas with padding
    const padding = 20;
    const scale = (height - padding * 2) / range;
    const candleWidth = Math.max(2, (width - padding * 2) / data.length - 2);
    
    // Draw each candlestick
    data.forEach((candle, i) => {
      const x = padding + i * ((width - padding * 2) / data.length);
      const openY = height - padding - (candle.open - min) * scale;
      const closeY = height - padding - (candle.close - min) * scale;
      const highY = height - padding - (candle.high - min) * scale;
      const lowY = height - padding - (candle.low - min) * scale;
      
      // Wick (high to low line)
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.stroke();
      
      // Body (open to close rectangle)
      ctx.fillStyle = candle.open > candle.close 
        ? 'rgba(239, 68, 68, 0.8)' 
        : 'rgba(16, 185, 129, 0.8)';
      
      const bodyHeight = Math.abs(closeY - openY);
      const bodyY = Math.min(openY, closeY);
      
      ctx.fillRect(x, bodyY, candleWidth, bodyHeight);
    });
    
    // Draw support/resistance lines (just for visual effect)
    const supportLevel = min + range * 0.2;
    const supportY = height - padding - (supportLevel - min) * scale;
    
    const resistanceLevel = min + range * 0.8;
    const resistanceY = height - padding - (resistanceLevel - min) * scale;
    
    ctx.beginPath();
    ctx.moveTo(padding, supportY);
    ctx.lineTo(width - padding, supportY);
    ctx.strokeStyle = 'rgba(255, 123, 0, 0.4)';
    ctx.setLineDash([5, 3]);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(padding, resistanceY);
    ctx.lineTo(width - padding, resistanceY);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.stroke();
    ctx.setLineDash([]);
    
  }, []);
  
  return (
    <div className="h-full w-full relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full absolute top-0 left-0 z-10"
        width={600}
        height={240}
      />
      
      {/* Backdrop area chart for visual effect */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartDataRef.current}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF7B00" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#FF7B00" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="volume" 
            stroke="rgba(255, 123, 0, 0.2)" 
            fillOpacity={1} 
            fill="url(#colorVolume)" 
          />
          <ReferenceLine 
            y={chartDataRef.current[0].open} 
            stroke="rgba(255, 215, 0, 0.2)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandlestickChart;
