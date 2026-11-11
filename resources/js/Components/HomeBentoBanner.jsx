import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Flame, ShieldCheck, Sparkles, Tag, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

const CAMPAIGN_SLIDES = [
    {
        id: 'mega-sale',
        backdrop: '/images/hero-banner.jpg',
        gradient: 'from-[#032D6B]/95 via-[#0953B5]/90 to-[#0B6CD9]/85',
        badgeTitle: '11.11',
        badgeSub: 'BIG SALE',
        promoTag: 'ONE DAY OFFER',
        footerBadge: 'FREE Delivery',
        footerSub: 'Orders over ৳2,000',
        deals: [
            {
                tag: 'Hybrid ANC • 40h Battery',
                title: 'AeroBeat ANC Headphones',
                regular: '৳4,290',
                campaign: '৳3,490',
                image: '/images/products/headphones.jpg',
                href: '/products/aerobeat-anc-wireless-headphones',
                accent: 'light',
            },
            {
                tag: '1.43" AMOLED • BT Calling',
                title: 'PulseFit AMOLED Watch',
                regular: '৳3,500',
                campaign: '৳2,850',
                image: '/images/products/smartwatch.jpg',
                href: '/products/pulsefit-amoled-smart-watch',
                accent: 'amber',
            },
        ],
    },
    {
        id: 'workspace-pro',
        backdrop: '/images/hero-banner.jpg',
        gradient: 'from-[#0B1F3A]/95 via-[#0F3F5C]/90 to-[#0E7490]/85',
        badgeTitle: 'TECH',
        badgeSub: 'DESK FEST',
        promoTag: 'FLASH SAVER',
        footerBadge: 'OTP Verified',
        footerSub: 'Cash on Delivery',
        deals: [
            {
                tag: 'Hot-Swap Wireless 75%',
                title: 'KeyCraft Mechanical Keyboard',
                regular: '৳5,200',
                campaign: '৳4,650',
                image: '/images/products/keyboard.jpg',
                href: '/products/keycraft-75-mechanical-keyboard',
                accent: 'light',
            },
            {
                tag: '3-Mode Touch Aluminum',
                title: 'LumiArc Minimal Desk Lamp',
                regular: '৳1,790',
                campaign: '৳1,450',
                image: '/images/products/lamp.jpg',
                href: '/products/lumiarc-minimal-led-desk-lamp',
                accent: 'amber',
            },
        ],
    },
    {
        id: 'urban-carry',
        backdrop: '/images/hero-banner.jpg',
        gradient: 'from-[#14203E]/95 via-[#1E3A8A]/90 to-[#0284C7]/85',
        badgeTitle: 'STYLE',
        badgeSub: 'WEEK DROP',
        promoTag: 'LIMITED STOCK',
        footerBadge: 'Same-Day Dispatch',
        footerSub: 'Inside Dhaka',
        deals: [
            {
                tag: 'Breathable Knit • EVA Sole',
                title: 'StrideAir Urban Sneakers',
                regular: '৳2,690',
                campaign: '৳2,190',
                image: '/images/products/sneakers.jpg',
                href: '/products/strideair-urban-running-sneakers',
                accent: 'light',
            },
            {
                tag: 'Fits 16" Laptop • USB Port',
                title: 'NomadPro 22L Backpack',
                regular: '৳2,250',
                campaign: '৳1,890',
                image: '/images/products/backpack.jpg',
                href: '/products/nomadpro-22l-laptop-backpack',
                accent: 'amber',
            },
        ],
    },
];

export default function HomeBentoBanner() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
        }, 5500);

        return () => window.clearInterval(timer);
    }, [paused]);

    const slide = CAMPAIGN_SLIDES[activeIndex];

    const goPrev = () => {
        setActiveIndex((prev) => (prev - 1 + CAMPAIGN_SLIDES.length) % CAMPAIGN_SLIDES.length);
    };

    const goNext = () => {
        setActiveIndex((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
    };

    return (
        <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                {/* Main Asymmetric Left Campaign Carousel */}
                <div
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-xl bg-[#05357B] text-white shadow-sm sm:min-h-[372px] lg:col-span-8 lg:h-[388px]"
                >
                    <img
                        src={slide.backdrop}
                        alt="Featured NovaMart Deals"
                        className="absolute inset-0 h-full w-full object-cover object-center opacity-35 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />

                    {/* Decorative subtle stadium glow circles */}
                    <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-cyan-300/15 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-12 left-1/3 h-48 w-48 rounded-full bg-amber-400/15 blur-2xl" />

                    {/* Top Content Grid */}
                    <div className="relative z-10 grid flex-1 grid-cols-1 items-center gap-4 p-5 sm:grid-cols-12 sm:p-6">
                        {/* Left Stacked Regular vs Campaign Price Cards */}
                        <div className="flex flex-col gap-3 sm:col-span-5">
                            {slide.deals.map((deal) => (
                                <Link
                                    key={deal.title}
                                    href={deal.href}
                                    className={`group/card relative block rounded-xl p-3 transition hover:-translate-y-0.5 ${
                                        deal.accent === 'light'
                                            ? 'bg-white text-slate-900 shadow-md'
                                            : 'bg-gradient-to-r from-[#9C4516] to-[#B75619] text-white shadow-md'
                                    }`}
                                >
                                    <span
                                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                                            deal.accent === 'light'
                                                ? 'bg-slate-800 text-white'
                                                : 'bg-white/95 text-slate-900'
                                        }`}
                                    >
                                        {deal.title}
                                    </span>

                                    <div className="mt-2 flex items-baseline justify-between gap-2">
                                        <div>
                                            <div
                                                className={`text-[10px] font-semibold ${
                                                    deal.accent === 'light' ? 'text-slate-500' : 'text-amber-100'
                                                }`}
                                            >
                                                Regular price
                                            </div>
                                            <div
                                                className={`text-sm font-bold line-through ${
                                                    deal.accent === 'light' ? 'text-slate-500' : 'text-white/80'
                                                }`}
                                            >
                                                {deal.regular}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div
                                                className={`text-[10px] font-bold ${
                                                    deal.accent === 'light' ? 'text-slate-600' : 'text-amber-100'
                                                }`}
                                            >
                                                Campaign Price
                                            </div>
                                            <div
                                                className={`text-xl font-black tracking-tight sm:text-2xl ${
                                                    deal.accent === 'light' ? 'text-[#0095D9]' : 'text-yellow-300'
                                                }`}
                                            >
                                                {deal.campaign}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            <div className="flex items-center gap-2 pt-0.5">
                                <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-[11px] font-black tracking-wide text-slate-950 uppercase shadow-xs">
                                    <Flame className="h-3.5 w-3.5" />
                                    Limited Stock
                                </span>
                                <span className="text-[11px] font-medium text-sky-100/90">
                                    {slide.deals[0].tag}
                                </span>
                            </div>
                        </div>

                        {/* Center Product Photos Stage */}
                        <div className="hidden items-center justify-center sm:col-span-4 sm:flex">
                            <div className="flex flex-col gap-3">
                                {slide.deals.map((deal) => (
                                    <Link
                                        key={deal.href}
                                        href={deal.href}
                                        className="block overflow-hidden rounded-xl border-2 border-white/80 bg-white p-1.5 shadow-lg transition hover:scale-[1.03]"
                                    >
                                        <img
                                            src={deal.image}
                                            alt={deal.title}
                                            className="h-28 w-44 rounded-lg object-cover"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Campaign Mega Badge & Offer Callout */}
                        <div className="flex flex-row items-center justify-between gap-3 sm:col-span-3 sm:flex-col sm:items-end sm:text-right">
                            <div>
                                <div className="text-3xl font-black tracking-tighter text-white drop-shadow-xs sm:text-4xl">
                                    {slide.badgeTitle}
                                </div>
                                <span className="mt-1 inline-block -rotate-2 rounded-md bg-yellow-300 px-2.5 py-0.5 text-xs font-black tracking-wide text-[#042D6B] uppercase shadow-xs">
                                    {slide.badgeSub}
                                </span>
                                <div className="mt-2 inline-block rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-[#05357B]">
                                    Powered by NovaMart
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-1 text-xs font-black tracking-wide text-white uppercase shadow-md">
                                    <Tag className="h-3.5 w-3.5" />
                                    {slide.promoTag}
                                </span>

                                <div className="rounded-lg border border-white/25 bg-[#022150]/85 px-3 py-2 text-right backdrop-blur-xs">
                                    <div className="flex items-center justify-end gap-1.5 text-xs font-extrabold text-white">
                                        <Truck className="h-3.5 w-3.5 text-yellow-300" />
                                        {slide.footerBadge}
                                    </div>
                                    <div className="text-[10px] text-sky-200">{slide.footerSub}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Left/Right Arrows */}
                    <button
                        type="button"
                        onClick={goPrev}
                        aria-label="Previous slide"
                        className="absolute left-2.5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-slate-950/45 p-1.5 text-white opacity-0 backdrop-blur-xs transition group-hover:opacity-100 hover:bg-slate-950/75"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        aria-label="Next slide"
                        className="absolute right-2.5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-slate-950/45 p-1.5 text-white opacity-0 backdrop-blur-xs transition group-hover:opacity-100 hover:bg-slate-950/75"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Pickaboo Signature Carousel Dots */}
                    <div className="relative z-10 flex items-center justify-center gap-1.5 pb-3">
                        {CAMPAIGN_SLIDES.map((s, idx) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setActiveIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-2 rounded-full transition-all ${
                                    idx === activeIndex
                                        ? 'w-6 bg-[#0095D9] ring-1 ring-white/80'
                                        : 'w-2 bg-white/75 hover:bg-white'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Stacked Side Promo Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4 lg:h-[388px] lg:grid-cols-1 lg:grid-rows-2">
                    {/* Top Right Flash / Sponsored Style Promo Card */}
                    <Link
                        href="/products/nomadpro-22l-laptop-backpack"
                        className="group relative flex items-center justify-between overflow-hidden rounded-xl bg-gradient-to-br from-[#231942] via-[#3A226D] to-[#D97706] p-4 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <span className="absolute right-2.5 top-2.5 rounded bg-slate-950/55 px-1.5 py-0.5 text-[10px] font-semibold text-slate-200 backdrop-blur-xs">
                            Featured Deal
                        </span>

                        <div className="relative z-10 flex max-w-[58%] flex-col justify-between gap-2">
                            <div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-300 px-2 py-0.5 text-[10px] font-black text-slate-950 uppercase">
                                    <Sparkles className="h-3 w-3" />
                                    Weekly Pick
                                </span>
                                <h2 className="mt-1.5 text-base font-extrabold leading-tight text-white">
                                    NomadPro 22L Laptop Backpack
                                </h2>
                                <p className="mt-1 text-[11px] font-medium text-amber-200">
                                    Anti-theft • Splash-resistant • USB Port
                                </p>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-black text-yellow-300">৳1,890</span>
                                <span className="text-xs text-white/70 line-through">৳2,250</span>
                            </div>
                        </div>

                        <div className="relative z-10 h-28 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-white/70 bg-white shadow-md sm:h-32 sm:w-32">
                            <img
                                src="/images/products/backpack.jpg"
                                alt="NomadPro 22L Laptop Backpack"
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                        </div>
                    </Link>

                    {/* Bottom Right Pickaboo-Orange Campaign Promo Card */}
                    <Link
                        href="/products/keycraft-75-mechanical-keyboard"
                        className="group relative flex items-center justify-between overflow-hidden rounded-xl bg-gradient-to-r from-[#8C3806] via-[#C96408] to-[#F39C12] p-4 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="relative z-10 flex max-w-[58%] flex-col justify-between gap-1.5">
                            <div>
                                <div className="text-[11px] font-bold tracking-wide text-amber-100 uppercase">
                                    KeyCraft Wireless 75%
                                </div>
                                <div className="text-sm font-extrabold leading-snug text-white">
                                    Mechanical Keyboard Hot-Swap
                                </div>
                            </div>

                            <div className="rounded-lg bg-slate-950/30 px-2.5 py-1.5 backdrop-blur-xs">
                                <div className="text-[10px] font-semibold text-amber-100">
                                    Campaign Price
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black tracking-tight text-yellow-300">
                                        ৳4,650
                                    </span>
                                    <span className="text-xs text-white/75 line-through">৳5,200</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] font-bold text-white">
                                <span className="inline-flex items-center gap-1 rounded bg-white/20 px-2 py-0.5">
                                    <ShieldCheck className="h-3 w-3 text-yellow-300" />
                                    FREE Delivery
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col items-end gap-1.5">
                            <span className="rounded bg-yellow-300 px-1.5 py-0.5 text-[9px] font-black text-slate-950 uppercase shadow-xs">
                                11.11 Big Sale
                            </span>
                            <div className="h-24 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-white/80 bg-white shadow-md sm:h-28 sm:w-32">
                                <img
                                    src="/images/products/keyboard.jpg"
                                    alt="KeyCraft 75% Mechanical Keyboard"
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}

