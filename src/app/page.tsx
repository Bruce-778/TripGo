import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { getT, getLocale } from "@/lib/i18n";

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-blue-50/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.1),transparent_50%)]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-brand-200/50 shadow-sm text-sm font-medium text-brand-700">
                <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                固定价格 · 中文客服 · 多车型可选
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  JapanGo 日本机场接送机预订
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
                像 Ctrip / Klook 一样快速下单：填写航班、上车点、下车点、人数行李，选择车型即可完成预订。
              </p>

              {/* Feature Chips */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="badge">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  24 小时内订单标记为 急单，不可自助取消
                </div>
                <div className="badge">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  支持 5/7/9 座、豪华型、大巴
                </div>
                <div className="badge">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  后台可改价、改状态
                </div>
              </div>

              {/* Quick Links */}
              <div className="pt-4">
                <p className="text-sm font-medium text-slate-700 mb-3">试试示例热门路线：</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    className="group px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white font-medium hover:from-brand-700 hover:to-brand-800 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                    href="/vehicles?tripType=PICKUP&fromArea=NRT&toArea=Shinjuku&pickupTime=2026-02-01T10:00&passengers=2&luggageSmall=1&luggageMedium=0&luggageLarge=0"
                  >
                    <span className="flex items-center gap-2">
                      成田(NRT) → 新宿
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    className="group px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                    href="/vehicles?tripType=PICKUP&fromArea=HND&toArea=Shibuya&pickupTime=2026-02-01T22:30&passengers=3&luggageSmall=1&luggageMedium=1&luggageLarge=0"
                  >
                    <span className="flex items-center gap-2">
                      羽田(HND) → 涩谷（夜间）
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right - Search Form */}
            <div className="relative animate-slide-up">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative card-elevated p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-slate-900">搜索接送服务</h2>
                    <p className="text-sm text-slate-500">填写信息后进入车型选择页</p>
                  </div>
                </div>
                <div className="mt-6">
                  <SearchForm
                    locale="zh"
                    labels={{
                      pickup: "接机",
                      dropoff: "送机",
                      p2p: "点到点",
                      from: "出发地",
                      to: "目的地",
                      pickupTime: "上车时间",
                      passengers: "乘客人数",
                      luggageSmall: "小行李",
                      luggageMedium: "中行李",
                      luggageLarge: "大行李",
                      submit: "搜索车型并报价",
                      timezoneHint: "日本标准时间 (JST)"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">为什么选择 JapanGo</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              专业、可靠、透明的日本机场接送服务
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="group card p-6 sm:p-8 hover:scale-[1.02] transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-3">透明定价</h3>
              <p className="text-slate-600 leading-relaxed">
                基础价 + 夜间/急单附加费清晰展示，后台支持手动调整（加价/优惠）。
              </p>
            </div>
            
            <div className="group card p-6 sm:p-8 hover:scale-[1.02] transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-3">多车型可选</h3>
              <p className="text-slate-600 leading-relaxed">
                5/7/9 座、豪华型、大巴，按人数行李给出推荐选择。
              </p>
            </div>
            
            <div className="group card p-6 sm:p-8 hover:scale-[1.02] transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-3">急单规则</h3>
              <p className="text-slate-600 leading-relaxed">
                24 小时内订单标记为急单，用户端不可自助取消，避免临近出车被放鸽子。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


