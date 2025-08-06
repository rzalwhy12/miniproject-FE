import { useAppSelector } from '@/lib/redux/hook';
import { User, Crown, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

const Header = () => {
  const fullname = useAppSelector((state) => state.account.name);

  return (
    <>
      <nav className="w-full h-20 my-4 flex items-center justify-between backdrop-blur-xl bg-white/20 rounded-2xl shadow-2xl px-6 border border-white/30 relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl"></div>

        <div className="mx-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                Event Saya
              </h1>
              <p className="text-xs text-purple-200 font-medium">
                Kelola event Anda dengan mudah
              </p>
            </div>
          </div>
        </div>

        <div className="mx-4 relative z-10">
          <div className="flex items-center gap-3 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-white/20 hover:from-white/30 hover:to-white/20 transition-all duration-300">
            <div className="relative">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-2 shadow-lg">
                <User className="text-white w-5 h-5" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-white tracking-wide">
                {fullname || 'User'}
              </p>
              <p className="text-xs text-purple-200 font-medium">
                Event Organizer
              </p>
            </div>
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
