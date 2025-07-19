// 🎯 PURPOSE: Footer component with navigation links
// 🔧 SESSION #188: Fixed Home link navigation bug - now goes to landing page "/" instead of "/dashboard"
// 🔧 SESSION #190: Added missing "Pricing" link to Platform section for complete footer consistency
// 🔧 SESSION #191: Fixed Pricing link to navigate to landing page pricing section instead of current page
// 🔧 SESSION #192: Fixed conditional scroll behavior + Pricing link uses window.location to bypass auth redirect
// 🔧 SESSION #194: REMOVED Pricing link from dashboard footer - logged-in users don't need pricing in footer
// 🔧 SESSION #208: RESTORED Pricing link to Platform section for complete footer consistency across all pages
// 🛡️ PRESERVATION: All existing functionality maintained exactly as before
// 📝 HANDOVER: Dashboard footer now consistent with legal pages - includes Pricing link for uniform navigation

import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  // 🔧 SESSION #192: Made scroll behavior conditional - only scroll for same-page navigation
  const handleFooterLinkClick = (path: string) => {
    // Only scroll to top for same-page links or internal page navigation
    // Don't scroll for external navigation links like pricing, home, etc.
    if (path.startsWith("#") && !path.includes("/#")) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // 🔧 FIXED: Home link now points to landing page "/" instead of "/dashboard"
  // 🔧 SESSION #208: RESTORED Pricing link for footer consistency across all pages
  // Dashboard footer now matches legal pages with complete Platform navigation
  const platformLinks = [
    { label: t("footer.home"), path: "/" }, // ← FIXED: Changed from '/dashboard' to '/'
    { label: t("nav.howItWorks"), path: "/how-it-works" },
    { label: "Pricing", path: "/pricing" }, // ← SESSION #208: Restored for consistency
  ];

  const supportLinks = [
    { label: t("footer.contact"), path: "/contact" },
    {
      label: t("footer.discord"),
      path: "https://discord.gg/kurzora",
      external: true,
    },
    {
      label: t("footer.twitter"),
      path: "https://x.com/KurzoraPlatform",
      external: true,
    },
  ];

  const legalLinks = [
    { label: t("footer.privacyPolicy"), path: "/privacy-policy" },
    {
      label: t("footer.termsOfService"),
      path: language === "de" ? "/de/terms-of-service" : "/terms-of-service",
    },
    { label: t("footer.riskDisclosure"), path: "/risk-disclosure" },
    { label: t("footer.shariahCompliance"), path: "/shariah-compliance" },
  ];

  const bottomLinks = [
    { label: t("footer.gdprCompliance"), path: "/gdpr-compliance" },
    { label: t("footer.cookieNotice"), path: "/cookie-notice" },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="logo-container mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 chart-element" />
                <span className="logo-text text-xl sm:text-2xl font-bold">
                  Kurzora
                </span>
              </div>
            </div>
            <p className="text-slate-400 mb-4">{t("footer.description")}</p>
            <div className="flex items-center space-x-2 text-emerald-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-sm">{t("footer.shariahCompliantTag")}</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t("footer.platform")}
            </h3>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    onClick={() => handleFooterLinkClick(link.path)}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t("footer.support")}
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.path}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={
                        link.path.startsWith("#")
                          ? () => handleFooterLinkClick(link.path)
                          : undefined
                      }
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => handleFooterLinkClick(link.path)}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    onClick={() => handleFooterLinkClick(link.path)}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">{t("footer.copyright")}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => handleFooterLinkClick(link.path)}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
