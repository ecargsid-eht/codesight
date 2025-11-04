import { Link } from "react-router";
import Navbar from "../components/Navbar"
import { PROBLEMS } from "../data/problems"
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyBadge } from "../lib/utils";

const ProblemsPage = () => {
  const problems = Object.values(PROBLEMS);
  const easyCount = problems.filter(pr => pr.difficulty.toLowerCase() === 'easy').length;
  const midCount = problems.filter(pr => pr.difficulty.toLowerCase() === 'medium').length;
  const hardCount = problems.filter(pr => pr.difficulty.toLowerCase() === 'hard').length;
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Practice Problems</h1>
          <p className="text-base-content/70">
            Sharpen your coding skills with these curated problems.
          </p>
        </div>

        <div className="space-y-4">
          {problems?.map((pr) => (
            <Link
              key={pr.id}
              to={`/problems/${pr.id}`}
              className="card bg-base-100 hover:scale-[1.01] transition-transform"
            >
              <div className="card-body">
                <div className="flex items-center justify-between gap-4">
                  {/* LEFT */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-12 rounded-xl flex justify-center items-center bg-primary/10">
                        <Code2Icon className="size-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold">{pr.title}</h2>
                          <span
                            className={`badge ${getDifficultyBadge(
                              pr.difficulty
                            )} font-medium rounded-xl`}
                          >
                            {pr.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-base-content/60">
                          {pr.category}
                        </p>
                      </div>
                    </div>
                    <p className="text-base-content/80 mb-3">
                      {pr.description.text}
                    </p>
                  </div>
                  {/* RIGHT */}

                  <div className="flex items-center gap-2 text-primary">
                    <span className="font-medium">Solve</span>
                    <ChevronRightIcon className="size-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* STATS FOOTER */}

        <div className="mt-12 bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Total Problems</div>
                <div className="stat-value text-primary">{problems.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Total Easy Problems</div>
                <div className="stat-value text-primary">{easyCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Total Medium Problems</div>
                <div className="stat-value text-primary">{midCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Total Hard Problems</div>
                <div className="stat-value text-primary">{hardCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemsPage