export function CompanyList() {
    const companies = [
      { name: 'Meta', count: 939 },
      { name: 'Amazon', count: 1741 },
      { name: 'Google', count: 1713 },
      { name: 'Microsoft', count: 1006 },
      { name: 'Apple', count: 733 },
      { name: 'Bloomberg', count: 855 },
    ];
  
    return (
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-4">
        <h3 className="text-lg font-medium text-white mb-4">Trending Companies</h3>
        <div className="space-y-3">
          {companies.map((company) => (
            <div
              key={company.name}
              className="flex items-center justify-between hover:bg-neutral-700/30 p-2 rounded-lg cursor-pointer"
            >
              <span className="text-neutral-200">{company.name}</span>
              <span className="text-sm px-2 py-1 bg-neutral-700 rounded-full text-neutral-300">
                {company.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }