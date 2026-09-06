import React from 'react';
import { Link } from 'react-router-dom';
import APP_CONFIG from '../config/app.config';
import { Sparkles, Heart, Globe, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#292524] text-[#D6D3D1] pt-16 pb-12 border-t border-[#44403C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#44403C]">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {APP_CONFIG.appName}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#A8A29E]">
              Bridging marginalized rural artisans directly with conscious patrons worldwide through voice-guided AI cataloging and fair-margin dynamic pricing.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#F59E0B]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Direct Artisan Payouts</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore Craft
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/marketplace" className="hover:text-[#F59E0B] transition-colors">
                  All Handmade Treasures
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Pottery%20%26%20Terracotta" className="hover:text-[#F59E0B] transition-colors">
                  Pottery & Terracotta
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Handloom%20%26%20Sarees" className="hover:text-[#F59E0B] transition-colors">
                  Handloom & Sarees
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Jewellery%20%26%20Brassware" className="hover:text-[#F59E0B] transition-colors">
                  Dokra & Brassware
                </Link>
              </li>
            </ul>
          </div>

          {/* Artisan Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              For Artisans
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/register?role=artisan" className="hover:text-[#F59E0B] transition-colors font-medium text-[#F59E0B]">
                  Join as an Artisan
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#F59E0B] transition-colors">
                  Artisan Studio Login
                </Link>
              </li>
              <li>
                <span className="text-[#A8A29E]">Multilingual Voice Assist: हिन्दी / বাংলা / English</span>
              </li>
              <li>
                <span className="text-[#A8A29E]">Smart AI Pricing Guidance</span>
              </li>
            </ul>
          </div>

          {/* Heritage Crafts */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Cultural Clusters
            </h4>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-md bg-[#3E3228] text-[#FDE68A]">Bishnupur Clay</span>
              <span className="px-2.5 py-1 rounded-md bg-[#3E3228] text-[#FDE68A]">Chanderi Weaves</span>
              <span className="px-2.5 py-1 rounded-md bg-[#3E3228] text-[#FDE68A]">Jaipur Blue Pottery</span>
              <span className="px-2.5 py-1 rounded-md bg-[#3E3228] text-[#FDE68A]">Dhokra Metalcraft</span>
              <span className="px-2.5 py-1 rounded-md bg-[#3E3228] text-[#FDE68A]">Bengal Golden Jute</span>
            </div>
            <p className="mt-4 text-[11px] text-[#A8A29E]">
              Helpline: {APP_CONFIG.supportPhone}
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C]">
          <p>© {new Date().getFullYear()} {APP_CONFIG.appName}. Built with pride for Indian Handicrafts.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Preserving indigenous heritage with ethical AI <Heart className="w-3.5 h-3.5 ml-1 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
