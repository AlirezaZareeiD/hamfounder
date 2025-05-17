
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-primary rounded-lg p-8 md:p-12 text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        We're not just building companies. We're shaping history.
      </h3>
      <p className="text-white/90 text-lg mb-8">
        Join the movement. Help shape the next chapter of Iran's economic story.
      </p>
      <Link to="/signup">
        <Button 
          size="lg" 
          className="bg-white text-primary hover:bg-white/90 font-medium text-lg px-8 py-6 h-auto"
        >
          Join the Movement
        </Button>
      </Link>
    </div>
  );
};

export default CallToAction;
