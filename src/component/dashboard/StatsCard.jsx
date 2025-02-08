import { Card } from "@/components/ui/card";
import { Brain, Target, Trophy } from 'lucide-react';

export function StatsCard() {
  const stats = [
    { label: 'Solved', value: '93/3384', icon: Brain, color: 'text-[#2cbb5d]' },
    { label: 'Easy', value: '36/642', icon: Target, color: 'text-[#00b8a3]' },
    { label: 'Medium', value: '52/1766', icon: Trophy, color: 'text-[#ffc01e]' },
    { label: 'Hard', value: '5/776', icon: Brain, color: 'text-[#ff375f]' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-neutral-800 border-neutral-700">
          <div className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-neutral-700 rounded-lg">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-neutral-400">{stat.label}</p>
              <p className="text-lg font-semibold text-white">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}