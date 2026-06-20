import React from 'react';
import { View } from 'react-native';
import Svg, {
  Polygon,
  Line,
  Text as SvgText,
  Circle,
  Defs,
  Stop,
  RadialGradient,
} from 'react-native-svg';
import type { PartStats } from '@beybladex/shared';
import { statColors } from '../theme';

export interface RadarDataSet {
  stats: PartStats;
  color: string;
  opacity?: number;
}

interface RadarChartProps {
  stats?: PartStats;
  datasets?: RadarDataSet[];
  size?: number;
  /** Massimo per asse (0 = centro, max = bordo). Tipicamente `getComboStatMax(line)`. */
  maxPerAxis: PartStats;
}

// 3 assi: ATK in alto, DEF in basso a destra, STA in basso a sinistra (triangolo equilatero).
const AXES = [
  { key: 'atk' as const, label: 'ATK', angle: -90 },
  { key: 'def' as const, label: 'DEF', angle: 30 },
  { key: 'sta' as const, label: 'STA', angle: 150 },
];

const DATASET_COLORS = ['#FF3A4F', '#3ABFFF', '#2EE6A8'];

function polarToCartesian(angle: number, radius: number, cx: number, cy: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function buildPolygonPoints(stats: PartStats, max: PartStats, r: number, cx: number, cy: number) {
  return AXES.map((a) => {
    const m = max[a.key];
    const value = Math.min(stats[a.key], m);
    const ratio = m > 0 ? value / m : 0;
    return polarToCartesian(a.angle, r * ratio, cx, cy);
  });
}

/**
 * Radar a 3 assi (ATK/DEF/STA). Accetta una singola `stats` o più `datasets` (deck multi-combo).
 * Portato da bbxdeckbuild (5 assi → 3, niente xdash/br, niente react-native-paper).
 */
export function RadarChart({ stats, datasets, size = 200, maxPerAxis }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.34;
  const labelR = size * 0.46;
  const gridLevels = [0.25, 0.5, 0.75, 1];

  const allDatasets: RadarDataSet[] = datasets
    ? datasets
    : stats
      ? [{ stats, color: DATASET_COLORS[0], opacity: 0.3 }]
      : [];

  return (
    <View>
      <Svg width={size} height={size}>
        <Defs>
          {allDatasets.map((ds, i) => (
            <RadialGradient key={`grad-${i}`} id={`dataGrad-${i}`} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={ds.color} stopOpacity={String((ds.opacity ?? 0.3) + 0.15)} />
              <Stop offset="100%" stopColor={ds.color} stopOpacity="0.05" />
            </RadialGradient>
          ))}
        </Defs>

        {/* Griglia (triangoli concentrici) */}
        {gridLevels.map((level) => {
          const points = AXES.map((a) => polarToCartesian(a.angle, r * level, cx, cy));
          return (
            <Polygon
              key={level}
              points={points.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#FFFFFF35"
              strokeWidth={0.8}
            />
          );
        })}

        {/* Assi */}
        {AXES.map((a) => {
          const end = polarToCartesian(a.angle, r, cx, cy);
          return (
            <Line key={a.key} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#FFFFFF35" strokeWidth={0.8} />
          );
        })}

        {/* Poligoni dati */}
        {allDatasets.map((ds, i) => {
          const hasData = AXES.some((a) => ds.stats[a.key] > 0);
          if (!hasData) return null;
          const points = buildPolygonPoints(ds.stats, maxPerAxis, r, cx, cy);
          const poly = points.map((p) => `${p.x},${p.y}`).join(' ');
          return (
            <React.Fragment key={`ds-${i}`}>
              <Polygon points={poly} fill={`url(#dataGrad-${i})`} stroke={ds.color} strokeWidth={1} strokeOpacity={0.3} />
              <Polygon points={poly} fill="none" stroke={ds.color} strokeWidth={2.5} strokeOpacity={0.9} />
              {points.map((p, j) => (
                <React.Fragment key={`pt-${i}-${j}`}>
                  <Circle cx={p.x} cy={p.y} r={5} fill={statColors[AXES[j].key]} opacity={0.3} />
                  <Circle cx={p.x} cy={p.y} r={3} fill={statColors[AXES[j].key]} />
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        })}

        {/* Etichette assi */}
        {AXES.map((a) => {
          const pos = polarToCartesian(a.angle, labelR, cx, cy);
          return (
            <SvgText
              key={a.key}
              x={pos.x}
              y={pos.y}
              fontSize={15}
              fontWeight="bold"
              fill={statColors[a.key]}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {a.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

export default RadarChart;
