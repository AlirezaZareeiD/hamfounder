
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const CallToAction = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="relative overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-primary rounded-xl p-8 md:p-12 text-center md:text-left relative z-10">
        {/* Background patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 z-0"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40 z-0"></div>
        
        <div className="md:flex items-center justify-between gap-8 relative z-10">
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              We're not just building companies.
              <br className="hidden lg:block" /> We're shaping history.
            </h3>
            <p className="text-white/90 text-lg md:text-xl mb-0">
              Join the movement. Help shape the next chapter of Iran's economic story.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-medium text-lg px-10 py-7 h-auto rounded-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
              >
                Join the Movement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CallToAction;
