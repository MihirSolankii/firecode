import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const topics = [
  { id: 'all', label: 'All Topics' },
  { id: 'algorithms', label: 'Algorithms', icon: '🔄' },
  { id: 'database', label: 'Database', icon: '💾' },
  { id: 'shell', label: 'Shell', icon: '🐚' },
  { id: 'concurrency', label: 'Concurrency', icon: '⚡' },
  { id: 'javascript', label: 'JavaScript', icon: '📜' },
];

export function TopicTabs({ activeTab, onTabChange }) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1">
      <TabsList className="bg-transparent border-none gap-2">
        {topics.map((topic) => (
          <TabsTrigger
            key={topic.id}
            value={topic.id}
            className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white px-3 py-1.5 text-sm text-neutral-400"
          >
            {topic.icon && <span className="mr-2">{topic.icon}</span>}
            {topic.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}