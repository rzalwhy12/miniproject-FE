import React from "react";

const MyCustomBanner: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Banner Atas */}
      <div className="w-full flex justify-center">
        <img
          src="/images/banner/1.png"
          alt="Banner Promo"
          className="rounded-2xl w-full max-w-7xl h-auto min-h-[100px] md:h-[200px] object-cover"
        />
      </div>

      {/* Top Events */}
      <div className="w-full bg-[#1a2950] py-10">
        <div className=" px-2">
          <h2 className="text-white max-w-7xl mx-auto text-2xl font-bold mb-6">Top Events</h2>
          <div className="flex flex-col gap-6 md:flex-row md:gap-8 justify-center">
            {/* Event 1 */}
            <div className="flex flex-row items-center gap-4 w-full md:w-auto">
              <span className="text-[96px] font-extrabold leading-none drop-shadow-lg text-white">
                1
              </span>
              <img
                src="/images/banner/2.png"
                alt="Event 1"
                // Added mobile-specific width and padding-right
                className="rounded-xl w-[300px] pr-1 h-[180px] md:w-auto md:pr-0 object-cover shadow-lg"
              />
            </div>
            {/* Event 2 */}
            <div className="flex flex-row items-center gap-4 w-full md:w-auto">
              <span className="text-[96px] font-extrabold leading-none drop-shadow-lg text-white">
                2
              </span>
              <img
                src="/images/banner/3.png"
                alt="Event 2"
                // Added mobile-specific width and padding-right
                className="rounded-xl w-[300px] pr-1 h-[180px] md:w-auto md:pr-0 object-cover shadow-lg"
              />
            </div>
            {/* Event 3 */}
            <div className="flex flex-row items-center gap-4 w-full md:w-auto">
              <span className="text-[96px] font-extrabold leading-none drop-shadow-lg text-white">
                3
              </span>
              <img
                src="/images/banner/4.png"
                alt="Event 3"
                // Added mobile-specific width and padding-right
                className="rounded-xl w-[300px] pr-1 h-[180px] md:w-auto md:pr-0 object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Banner Bawah */}
      <div className="w-full flex justify-center">
        <img
          src="/images/banner/5.png"
          alt="Banner Promo Bawah"
          className="rounded-2xl w-full max-w-7xl h-auto min-h-[100px] md:h-[200px] object-cover pb-7"
        />
      </div>
    </div>
  );
};

export default MyCustomBanner;