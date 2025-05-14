
export const ValueProposition = () => {
  return (
    <div className="text-center lg:text-left max-w-lg mx-auto lg:mx-0">
      <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
        Connect with Global Innovators
      </h1>
      <p className="text-xl text-slate-600 mb-10">
        Join Hamfounder's global network of founders, professionals, and investors building the future of entrepreneurship. Access exclusive resources, connect with peers, and discover new opportunities.
      </p>

      <div className="flex items-center justify-center lg:justify-start mb-8">
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
        </div>
        <span className="text-lg font-medium text-slate-700">Join 5,000+ members</span>
      </div>

      <blockquote className="italic text-slate-600 border-l-4 border-purple-300 pl-4 py-2">
        "Hamfounder has connected me with global founders, opening doors to partnerships I never thought possible."
      </blockquote>
    </div>
  );
};
