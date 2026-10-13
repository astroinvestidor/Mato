import React, { useState } from 'react';
import { ArrowRight, QrCode, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { revenueDataPoints } from '../../data/mockData';

export const RevenueAndTransactions: React.FC = () => {
  const { transactions, setActiveTab } = useApp();
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(4); // Default to 06/05

  // Dimensions for SVG chart
  const svgWidth = 520;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingTop = 25;
  const paddingBottom = 35;

  const yMax = 5000;
  const yTicks = [5000, 3750, 2500, 1250, 0];

  const getX = (index: number) => {
    const usableWidth = svgWidth - paddingX * 2;
    return paddingX + (index / (revenueDataPoints.length - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    const usableHeight = svgHeight - paddingTop - paddingBottom;
    return paddingTop + usableHeight - (val / yMax) * usableHeight;
  };

  // Build SVG path
  const points = revenueDataPoints.map((pt, i) => ({
    x: getX(i),
    y: getY(pt.value),
    ...pt,
  }));

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${points[0].x} ${svgHeight - paddingBottom} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left: Chart of Revenue */}
      <div className="lg:col-span-7 rounded-2xl bg-[#0c1016] border border-[#1b2330] p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-base font-bold text-white tracking-tight">Seu faturamento</h4>
            <span className="text-[11px] text-[#7e8b9b]">Evolução diária em tempo real</span>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Dados em tempo real
          </span>
        </div>

        {/* Custom SVG Line Chart */}
        <div className="relative w-full overflow-x-auto py-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[360px]"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7be801" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#7be801" stopOpacity="0.0" />
              </linearGradient>
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#7be801" floodOpacity="0.7" />
              </filter>
            </defs>

            {/* Horizontal Grid lines */}
            {yTicks.map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#1c2533"
                    strokeDasharray={val === 0 ? 'none' : '3 3'}
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 3}
                    fill="#627184"
                    fontSize="9.5"
                    textAnchor="end"
                    fontFamily="inherit"
                  >
                    {val === 0 ? 'R$ 0' : `R$ ${val.toLocaleString('pt-BR')}`}
                  </text>
                </g>
              );
            })}

            {/* Fill Area */}
            <path d={areaD} fill="url(#chartGradient)" />

            {/* Stroke Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#7be801"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#neonGlow)"
            />

            {/* X-axis labels and points */}
            {points.map((pt, i) => {
              const isHovered = hoveredPoint === i;
              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(i)}
                >
                  <text
                    x={pt.x}
                    y={svgHeight - 12}
                    fill={isHovered ? '#7be801' : '#7e8b9b'}
                    fontSize="10"
                    textAnchor="middle"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                  >
                    {pt.date}
                  </text>

                  {/* Outer circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    fill="#0c1016"
                    stroke="#7be801"
                    strokeWidth={isHovered ? 3 : 2}
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}

            {/* Tooltip on selected point */}
            {hoveredPoint !== null && (
              <g
                transform={`translate(${points[hoveredPoint].x}, ${points[hoveredPoint].y - 36})`}
                className="pointer-events-none transition-transform duration-200"
              >
                <rect
                  x="-42"
                  y="-14"
                  width="84"
                  height="30"
                  rx="6"
                  fill="#121822"
                  stroke="#7be801"
                  strokeWidth="1"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                />
                <text
                  x="0"
                  y="-1"
                  fill="#ffffff"
                  fontSize="9.5"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {points[hoveredPoint].label}
                </text>
                <text
                  x="0"
                  y="10"
                  fill="#7e8b9b"
                  fontSize="8.5"
                  textAnchor="middle"
                >
                  {points[hoveredPoint].date}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Right: Recent Transactions List */}
      <div className="lg:col-span-5 rounded-2xl bg-[#0c1016] border border-[#1b2330] p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-bold text-white tracking-tight">Transações recentes</h4>
            <button
              onClick={() => setActiveTab('vendas')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              Ver todas
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {transactions.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-[#7e8b9b]">Nenhuma transação registrada ainda.</p>
                <button
                  onClick={() => {
                    setActiveTab('receber');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7be801]/10 text-[#7be801] border border-[#7be801]/30 text-xs font-semibold hover:bg-[#7be801]/20 transition-colors"
                >
                  Criar sua primeira cobrança
                </button>
              </div>
            ) : (
              transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="py-2.5 flex items-center justify-between hover:bg-white/[0.02] rounded-xl px-1.5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${tx.avatarColor}`}
                    >
                      {tx.customerInitial}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white leading-tight">
                        {tx.customerName}
                      </p>
                      <span className="text-[10px] text-[#7e8b9b] flex items-center gap-1 mt-0.5">
                        {tx.method === 'Pix' ? (
                          <QrCode className="w-2.5 h-2.5 text-emerald-400" />
                        ) : (
                          <CreditCard className="w-2.5 h-2.5 text-purple-400" />
                        )}
                        {tx.method}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-white">
                      R$ {tx.amount.toFixed(2).replace('.', ',')}
                    </p>
                    <span className="text-[10px] text-[#7e8b9b] block mt-0.5">
                      {tx.date}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#7e8b9b]">
          <span>Status de compensação: Instantâneo</span>
          <span className="text-emerald-400 font-medium">100% aprovado</span>
        </div>
      </div>
    </div>
  );
};
