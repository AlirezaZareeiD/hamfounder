
import { Link } from "react-router-dom";

export const ValueProposition = () => {
  return (
    <div className="max-w-xl mx-auto lg:mx-0 space-y-6 text-center lg:text-left">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
        Connect with Iranian Innovators Worldwide
      </h1>
      <p className="text-lg text-slate-700 leading-relaxed">
        Join Hamfounder's global network of founders, professionals, and investors building the future of Iranian entrepreneurship. Access exclusive resources, connect with peers, and discover new opportunities.
      </p>
      <div className="hidden lg:block">
        <div className="flex items-center justify-center lg:justify-start space-x-4 pt-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-${300 + i*100} to-blue-${400 + i*100}`}></div>
            ))}
          </div>
          <p className="font-medium text-slate-700">Join 5,000+ members</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mt-8 border border-slate-100">
          <p className="text-slate-700 italic">
            "Hamfounder has connected me with Iranian founders globally, opening doors to partnerships I never thought possible. The network is invaluable."
          </p>
          <div className="mt-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <div className="ml-3">
              <p className="font-medium text-slate-900">Sara Rahmani</p>
              <p className="text-sm text-slate-500">Founder, TechBridge</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
