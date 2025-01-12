import { useTheme } from '../../contexts/ThemeContext';

export function Hero() {
  const { gradients } = useTheme();

  return (
    <div className={`py-12 ${gradients.hero} text-white hero-section`}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Elevate Your Basketball Game</h1>
        <p className="text-xl opacity-90">
          Advanced shot analysis to perfect your form and improve your accuracy
        </p>
      </div>
    </div>
    
  );
}