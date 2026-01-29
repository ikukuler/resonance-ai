import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { AudioFeatures } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface VibeVisualizerProps {
  features: AudioFeatures;
  color?: string;
}

const VibeVisualizer: React.FC<VibeVisualizerProps> = ({ features, color = "#8884d8" }) => {
  const { t } = useLanguage();
  const data = [
    { subject: t.energy, A: features.energy, fullMark: 100 },
    { subject: t.mood, A: features.valence, fullMark: 100 },
    { subject: t.acousticness, A: features.acousticness, fullMark: 100 },
    { subject: t.danceability, A: features.danceability, fullMark: 100 },
    { subject: t.complexity, A: features.complexity, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Audio Features"
            dataKey="A"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
            itemStyle={{ color: color }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VibeVisualizer;