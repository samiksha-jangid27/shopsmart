import React from "react";
import {
  Zap,
  CheckCircle,
  Shirt,
  Gift,
  Lightbulb,
  Plus,
  LogOut,
  ShoppingBag,
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  Heart,
  Menu,
  User
} from "lucide-react";
import { useEffect } from "react";
export default function App() {
    useEffect(() => {
  fetch("http://localhost:5005/api/health")
    .then(res => res.json())
    .then(data => console.log("API:", data))
    .catch(err => console.error(err));
}, []);
  return (
    <div className="min-h-screen bg-[#e8f3ea] flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background concentric curved dashed lines - omitted for minimal code size, can be added via SVG background if needed */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-150 rotate-12">
          <circle cx="500" cy="500" r="300" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 10" />
          <circle cx="500" cy="500" r="500" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 10" />
          <circle cx="500" cy="500" r="700" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 10" />
        </svg>
      </div>

      <div className="w-full max-w-[1400px] h-[90vh] min-h-[800px] max-h-[1000px] bg-white rounded-[40px] shadow-2xl flex overflow-hidden z-10 relative">
        
        {/* --- SIDEBAR --- */}
        <div className="w-[260px] h-full border-r border-gray-100 flex flex-col py-8 px-6 bg-white shrink-0 hidden lg:flex">
          
          <div className="flex items-center gap-1 mb-10 px-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 group">
              Shop<span className="relative inline-block">
                Smart
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-blue-600 rounded-full"></span>
              </span>
            </h1>
          </div>

          <nav className="flex flex-col gap-2 mb-10">
            <button className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Zap size={18} />
              Popular Products
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)]">
              <CheckCircle size={18} />
              Explore New
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Shirt size={18} />
              Clothing and Shoes
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Gift size={18} />
              Gifts and Living
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Lightbulb size={18} />
              Inspiration
            </button>
          </nav>

          <div className="mb-8">
            <h4 className="text-xs font-semibold text-gray-400 mb-4 px-4 w-full">Quick actions</h4>
            <div className="flex flex-col gap-1">
              <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <div className="bg-gray-100 p-1 rounded-md text-gray-500"><Plus size={14} /></div>
                Request for product
              </button>
              <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full">
                <div className="bg-gray-100 p-1 rounded-md text-gray-500"><Plus size={14} /></div>
                Add member
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <h4 className="text-xs font-semibold text-gray-400 mb-4 px-4">
              Last orders <span className="text-black ml-1 font-bold">37</span>
            </h4>
            <div className="flex items-center justify-between px-4 py-2 mb-2 group cursor-pointer hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100" className="w-8 h-8 rounded-full border border-gray-100 object-cover" alt="Nike" />
                <span className="text-xs font-bold text-gray-800">DXC Nike...</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium group-hover:text-blue-600 transition-colors">view order</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2 mb-2 group cursor-pointer hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=100" className="w-8 h-8 rounded-full border border-gray-100 object-cover" alt="Outerwear" />
                <span className="text-xs font-bold text-gray-800">Outerwear...</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium group-hover:text-blue-600 transition-colors">view order</span>
            </div>
            <button className="px-4 text-xs font-bold text-gray-400 hover:text-gray-800 self-start text-left mt-1">See all</button>
          </div>

          <button className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-black mt-auto">
            <LogOut size={18} />
            Log out
          </button>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden py-8 px-8 lg:px-12 relative">
          
          {/* Top Bar */}
          <header className="flex flex-wrap items-center justify-between mb-10 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[44px] leading-none font-medium text-black">37</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 leading-tight">Orders</span>
                <span className="text-sm text-gray-400 leading-tight">Last 7 days</span>
              </div>
            </div>

            <div className="hidden md:flex bg-gray-50/80 rounded-full p-1 border border-gray-100/60 shadow-inner">
              <button className="px-8 py-2.5 rounded-full bg-white shadow-sm text-sm font-bold text-gray-800">Dashboard</button>
              <button className="px-8 py-2.5 rounded-full text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors">Website</button>
            </div>

            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors text-gray-700">
                <ShoppingBag size={18} />
                Cart
              </button>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3 hidden sm:flex">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm bg-blue-100" alt="user" />
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm bg-orange-100" alt="user" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-800 shadow-sm z-10">+8</div>
                </div>

                <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-11 h-11 rounded-full bg-pink-100 overflow-hidden border border-pink-200 group-hover:shadow-md transition-shadow">
                    <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="Ryana" />
                  </div>
                  <span className="text-sm font-bold text-gray-800">Ryana</span>
                </div>
              </div>
            </div>
          </header>

          {/* Explore Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-8 lg:gap-14">
              <h2 className="text-[34px] font-semibold text-black tracking-tight">Explore</h2>
              
              <div className="flex gap-4 relative">
                <button className="flex items-center gap-2 px-8 py-3 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-50 text-sm font-bold text-black relative">
                  <Menu size={16} /> All
                  <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-5 h-1.5 bg-blue-600 rounded-full"></span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-gray-400 hover:bg-gray-50 transition-colors border border-transparent">
                  <User size={16} /> Men
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-gray-400 hover:bg-gray-50 transition-colors border border-transparent">
                  <User size={16} /> Women
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-gray-50 hover:bg-gray-100 text-gray-800 text-sm font-bold px-7 py-3.5 rounded-full transition-colors relative">
                Filters
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white box-content"></span>
              </button>
              <button className="w-[52px] h-[52px] bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-800 transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid flex-1 overflow-y-auto pr-3 -mr-3 scrollbar-hide gap-7 grid-cols-1 xl:grid-cols-12 auto-rows-min pb-10">
            
            {/* LEFT SIDE (Banners) -> Spans col 1-7 */}
            <div className="xl:col-span-7 flex flex-col gap-6 h-full">
              
              {/* Green Banner (GET UP TO 50% OFF) */}
              <div className="relative w-full h-[240px] rounded-[36px] overflow-hidden bg-[#C6EBD6] group cursor-pointer shrink-0">
                <img src="https://plus.unsplash.com/premium_photo-1669704098750-7cd22c354178?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-700" alt="Green fashion" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C6EBD6]/20 to-[#C6EBD6]/80" />
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 z-10 w-full">
                  <h3 className="text-[34px] font-bold tracking-tight text-gray-900 mb-5 relative z-10 px-6 py-1 drop-shadow-sm leading-tight text-center max-w-[80%]">
                    <div className="absolute inset-0 bg-white/40 blur-lg rounded-[20px] -z-10"></div>
                    GET UP TO 50% OFF
                  </h3>
                  <button className="bg-white/95 backdrop-blur-md text-gray-900 font-bold text-sm px-10 py-3.5 rounded-full shadow-sm hover:scale-[1.02] transition-transform">
                    Get Discount
                  </button>
                </div>
              </div>

              {/* Yellow Banner (Winter's weekend) */}
              <div className="relative w-full h-[180px] rounded-[36px] overflow-hidden bg-[#FCEBAE] group cursor-pointer shrink-0">
                <img src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=800" className="absolute -right-10 md:right-0 top-0 h-full w-[55%] md:w-[60%] object-cover object-left opacity-90 group-hover:scale-[1.03] transition-transform duration-700" alt="Yellow fashion" />
                <div className="absolute inset-y-0 left-0 pl-10 md:pl-12 flex flex-col justify-center z-10 w-[60%] md:w-1/2">
                  <h3 className="text-[30px] font-semibold text-gray-900 tracking-tight leading-[1.1]">Winters weekend</h3>
                  <p className="text-gray-700 font-semibold text-sm mt-2 tracking-wide">keep it casual</p>
                </div>
                <button className="absolute top-6 right-6 w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-[0_4px_15px_rgba(0,0,0,0.06)] hover:scale-105 transition-transform z-10">
                  <ArrowUpRight size={20} />
                </button>
              </div>

              {/* Bottom Row inside left block: 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[250px] flex-1 shrink-0">
                {/* Orange Vertical Card */}
                <div className="relative rounded-[36px] overflow-hidden bg-[#E9E9E9] group cursor-pointer h-full">
                  <img src="https://plus.unsplash.com/premium_photo-1690035049386-88c2780eb7ab?auto=format&fit=crop&q=80&w=500" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" alt="Orange bow" />
                  <button className="absolute top-5 right-5 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm z-10 hover:text-red-500 transition-colors">
                    <Heart size={18} />
                  </button>
                  <div className="absolute inset-x-0 bottom-6 flex justify-center z-10">
                    <button className="bg-[#FD9346] text-white font-bold text-sm px-12 py-3.5 rounded-full hover:bg-[#F28132] transition-colors shadow-lg shadow-orange-500/20">
                      Avail Offers
                    </button>
                  </div>
                </div>

                {/* Favourites Block */}
                <div className="rounded-[36px] bg-white border border-gray-100 flex flex-col items-center p-5 shadow-[0_2px_15px_rgba(0,0,0,0.03)] h-full justify-between group cursor-pointer">
                  <div className="w-full flex items-center justify-between bg-[#FCF0E8] py-2.5 px-3 rounded-full mb-4">
                    <span className="text-sm font-bold text-gray-800 ml-6">Favourites</span>
                    <div className="flex items-center gap-1.5 mr-1">
                      <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-orange-200/50 text-gray-500 hover:text-black transition-colors"><ChevronLeft size={16} /></button>
                      <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-orange-200/50 text-gray-500 hover:text-black transition-colors"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full flex-1 overflow-hidden min-h-0 mb-3">
                    <div className="w-full h-full overflow-hidden rounded-[20px]">
                      <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Fav 1" />
                    </div>
                    <div className="w-full h-full overflow-hidden rounded-[20px]">
                      <img src="https://images.unsplash.com/photo-1620803986695-98da6962ac38?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Fav 2" />
                    </div>
                  </div>
                  <button className="w-full bg-white border border-gray-100 text-gray-800 font-bold text-[13px] py-4 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:bg-gray-50 hover:border-gray-200 transition-all">
                    See All
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE (Products) -> Spans col 8-12 */}
            <div className="xl:col-span-5 flex flex-col gap-6 h-full">
              
              <div className="grid grid-cols-2 gap-6 flex-1 max-h-[440px] shrink-0">
                {/* Product 1: Zebra sandel */}
                <div className="rounded-[36px] bg-white border border-gray-100 flex flex-col p-4 shadow-[0_4px_25px_rgba(0,0,0,0.03)] group cursor-pointer relative h-full">
                  <div className="relative bg-[#F9F9F9] rounded-[28px] flex-1 overflow-hidden mb-5 p-4 flex items-center justify-center min-h-[220px]">
                    <div className="absolute top-4 left-5 flex gap-2 z-10">
                      <div className="w-[14px] h-[14px] rounded-full border-2 border-white shadow-sm bg-pink-400"></div>
                      <div className="w-[14px] h-[14px] rounded-full border-2 border-white shadow-sm bg-yellow-200 -ml-3"></div>
                    </div>
                    <button className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.06)] z-10 hover:text-red-500 hover:scale-105 transition-all">
                      <Heart size={16} />
                    </button>
                    <img src="https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&q=80&w=500" className="w-[90%] h-auto object-contain group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-700 drop-shadow-xl" alt="Zebra sandal" />
                  </div>
                  <div className="flex flex-col px-3 pb-3">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Our Picks</span>
                    <div className="flex items-start justify-between">
                      <h3 className="text-[15px] font-bold text-gray-900 leading-tight w-[60%] tracking-tight">WMX Rubber<br/>Zebra sandal</h3>
                      <span className="bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md shadow-blue-500/20">$36</span>
                    </div>
                  </div>
                </div>

                {/* Product 2: Supper Skiny jogger */}
                <div className="rounded-[36px] bg-white border border-gray-100 flex flex-col p-4 shadow-[0_4px_25px_rgba(0,0,0,0.03)] group cursor-pointer relative h-full">
                  <div className="relative bg-[#F9F9F9] rounded-[28px] flex-1 overflow-hidden mb-5 p-4 flex items-center justify-center min-h-[220px]">
                    <div className="absolute top-4 left-5 flex gap-2 z-10">
                      <div className="w-[14px] h-[14px] rounded-full border-2 border-white shadow-sm bg-yellow-300"></div>
                      <div className="w-[14px] h-[14px] rounded-full border-2 border-white shadow-sm bg-gray-900 -ml-3"></div>
                    </div>
                    <button className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.06)] z-10 hover:text-red-500 hover:scale-105 transition-all">
                      <Heart size={16} />
                    </button>
                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500" className="w-[95%] h-auto object-contain translate-y-2 -rotate-12 group-hover:-translate-y-2 group-hover:-rotate-6 transition-all duration-700 drop-shadow-2xl opacity-95" alt="Sneakers" />
                  </div>
                  <div className="flex flex-col px-3 pb-3">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Your Choice</span>
                    <div className="flex items-start justify-between">
                      <h3 className="text-[15px] font-bold text-gray-900 leading-tight w-[60%] tracking-tight">Supper Skiny<br/>jogger in brown</h3>
                      <span className="bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md shadow-blue-500/20">$89</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wide Banner Bottom Right */}
              <div className="relative min-h-[220px] lg:min-h-0 flex-1 rounded-[36px] overflow-hidden bg-[#F2F4F3] group cursor-pointer shrink-0 mt-[2px]">
                <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800" className="absolute -right-4 md:right-0 top-0 h-full w-auto object-cover opacity-90 group-hover:scale-[1.03] transition-transform duration-700 mix-blend-multiply" alt="Layers" />
                <div className="absolute inset-y-0 left-0 pl-10 flex flex-col justify-center max-w-[65%] z-10">
                  <h3 className="text-[28px] font-bold text-gray-900 tracking-tight leading-[1.1] mb-2">Bring Bold Fashion</h3>
                  <p className="text-gray-600 font-semibold text-sm">Layers on Layers</p>
                </div>
                <button className="absolute top-6 right-6 w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-sm hover:scale-105 transition-transform z-10">
                  <ArrowUpRight size={20} />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
