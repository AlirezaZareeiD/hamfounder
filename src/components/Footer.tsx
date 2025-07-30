import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { FirebaseSetupDialog } from '@/components/firebase/FirebaseSetupDialog'; // Import FirebaseSetupDialog

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false); // State for popup
  // Assuming these states and handlers are defined elsewhere or you'll add them
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Replace with your actual newsletter subscription logic
      // For now, simulating a successful subscription
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: "Thank you!",
        description: "You've been subscribed to our newsletter.",
        variant: "default"
      });
      setEmail('');
      setSubmitStatus('success');
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive"
      });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Functions to control popup
  const handleOpenSetupGuide = () => {
    setIsSetupGuideOpen(true);
  };

  const handleCloseSetupGuide = () => {
    setIsSetupGuideOpen(false);
  };

  return (
    <> {/* Use a fragment to wrap the footer and the dialog */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
            {/* Column 1: Brand and Contact */}
            <div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4 block">
                Hamfounder
              </span>

              <p className="text-gray-400 mb-4">
                Building the future through Iranian innovation and global connection.
              </p>

              <div className="space-y-2">
                <div className="text-sm text-gray-300">
                  <span className="font-semibold block">Email:</span>
                  <a href="mailto:contact@hamfounder.com" className="hover:text-blue-400 transition">contact@hamfounder.com</a>
                </div>

                <div className="text-sm text-gray-300">
                  <span className="font-semibold block">Locations:</span>
                  <span>Isabel La Católica N24-274 y Galavis esq, IMPAQTO La Floresta - Quito , Pichincha, EC</span>
                </div>
              </div>
            </div>

            {/* Column 2: Explore */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>

              <ul className="space-y-2">
                <li>
                  <a href="#mission" className="text-gray-400 hover:text-blue-400 transition">Our Mission</a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-blue-400 transition">The Blueprint</a>
                </li>
                <li>
                  <a href="#global-network" className="text-gray-400 hover:text-blue-400 transition">Global Network</a>
                </li>
                <li>
                  <a href="#startups" className="text-gray-400 hover:text-blue-400 transition">Featured Startups</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition">Privacy Policy</a>
                </li>
              </ul>
            </div>

            {/* Column 3: Newsletter Subscription */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Subscribe to our Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Stay updated with the latest news and updates from Hamfounder by subscribing to our newsletter.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-2 rounded-l-md bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Join'}
                </button>
              </form>
              {submitStatus === 'success' && (
                <p className="text-green-500 mt-2">Thank you for subscribing!</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 mt-2">Failed to subscribe. Please try again later.</p>
              )}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4 mb-4">
            <a href="https://x.com/hamfounder" className="text-gray-400 hover:text-blue-400 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.766 10.255L21.75 2h-1.953l-5.833 6.82L9.045 2H2.25l7.284 10.355L2.25 22h1.953l6.234-7.292L14.955 22h6.795l-7.738-11.745zM12.84 13.8l-.723-.99-5.75-7.86h1.978l4.611 6.3.724.99 6.01 8.21h-1.978l-4.872-6.65z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/hamfounder/" className="text-gray-400 hover:text-blue-400 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/hamfounder" className="text-gray-400 hover:text-blue-400 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Copyright and Footer Links - Now outside the footer */}
      <div className="border-t border-slate-800 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Hamfounder. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Conditional rendering of FirebaseSetupDialog */}
      {isSetupGuideOpen && (
        <FirebaseSetupDialog
          open={isSetupGuideOpen}
          onOpenChange={handleCloseSetupGuide}
        />
      )}
    </>
  );
};

export default Footer;
