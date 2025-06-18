import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Globe } from 'lucide-react';
import Layout from '../../../components/Layout';

interface LanguageLink {
  code: string;
  label: string;
  path: string;
}

const languageLinks: LanguageLink[] = [
  { code: 'en', label: 'EN', path: '/impressum' },
  { code: 'de', label: 'DE', path: '/de/impressum' },
  { code: 'ar', label: 'AR', path: '/impressum' }
];

const Impressum: React.FC = () => (
  <Layout>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Impressum</h1>
        <div className="flex justify-center items-center space-x-4">
          <FileText className="h-12 w-12 text-blue-500" aria-hidden="true" />
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-500" aria-hidden="true" />
            <nav aria-label="Language selection">
              <div className="flex space-x-2">
                {languageLinks.map((link, index) => (
                  <React.Fragment key={link.code}>
                    {index > 0 && <span className="text-blue-500" aria-hidden="true">|</span>}
                    {link.code === 'de' ? (
                      <span className="text-white" aria-current="page">{link.label}</span>
                    ) : (
                      <Link 
                        to={link.path} 
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        aria-label={`Switch to ${link.label} version`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="space-y-6 text-slate-300">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Angaben gemäß § 5 TMG</h2>
          <p>
            Kurzora Platform GmbH<br />
            Musterstraße 1<br />
            12345 Berlin<br />
            Deutschland
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Vertreten durch</h2>
          <p>Khaled Hamdy</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Kontakt</h2>
          <p>
            Telefon: +49 30 1234567<br />
            E-Mail: info@kurzora.com
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Registereintrag</h2>
          <p>
            Eintragung im Handelsregister.<br />
            Registergericht: Berlin Charlottenburg<br />
            Registernummer: HRB 123456
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
            DE123456789
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>Khaled Hamdy, Adresse wie oben</p>
        </section>
      </div>
      <div className="mt-10 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <p className="text-blue-400 text-sm text-center">
          Zuletzt aktualisiert: 15. Januar 2024
        </p>
      </div>
    </div>
  </Layout>
);

export default Impressum; 