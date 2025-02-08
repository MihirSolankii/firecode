import { Link } from 'react-router-dom';
import { CheckCircle2, Lock } from 'lucide-react';

export function ProblemTable({ problems }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-[#00b8a3]';
      case 'medium':
        return 'text-[#ffc01e]';
      case 'hard':
        return 'text-[#ff375f]';
      default:
        return 'text-white';
    }
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-neutral-700 text-neutral-400 text-sm">
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Title</th>
          <th className="px-4 py-3 text-center">Solution</th>
          <th className="px-4 py-3 text-center">Acceptance</th>
          <th className="px-4 py-3 text-center">Difficulty</th>
          <th className="px-4 py-3 text-center">Frequency</th>
        </tr>
      </thead>
      <tbody>
        {problems.map((problem, index) => (
          <tr
            key={problem.main?.id || index}
            className="border-b border-neutral-700 hover:bg-neutral-700/30 text-sm"
          >
            <td className="px-4 py-4">
              {problem.solved ? (
                <CheckCircle2 className="h-5 w-5 text-[#2cbb5d]" />
              ) : (
                <div className="h-5 w-5" />
              )}
            </td>
            <td className="px-4 py-4">
              <Link
                to={`/problem/${problem.main?.id}`}
                className="text-[#2cbb5d] hover:text-[#2cbb5d]/80"
              >
                {problem.main?.name}
              </Link>
            </td>
            <td className="px-4 py-4 text-center">
              {problem.premium ? (
                <Lock className="h-4 w-4 text-[#ffc01e] mx-auto" />
              ) : null}
            </td>
            <td className="px-4 py-4 text-center text-neutral-400">
              {((problem.main?.like_count / (problem.main?.like_count + problem.main?.dislike_count)) * 100).toFixed(1)}%
            </td>
            <td className="px-4 py-4 text-center">
              <span className={getDifficultyColor(problem.main?.difficulty)}>
                {problem.main?.difficulty}
              </span>
            </td>
            <td className="px-4 py-4">
              <div className="w-24 h-1 bg-neutral-700 rounded-full mx-auto">
                <div
                  className="h-full bg-[#2cbb5d] rounded-full"
                  style={{ width: `${problem.frequency || 0}%` }}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}