import { Hero } from '../components/Layout';
import { ComparisonAnalysis } from '../components/ComparisonAnalysis';
import { IndividualAnalysis } from '../components/IndividualAnalysis';

export function HomePage() {
  return (
    <main>
      <Hero />
      <ComparisonAnalysis />
      <IndividualAnalysis />
    </main>
  );
}