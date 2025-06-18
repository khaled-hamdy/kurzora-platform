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
  { code: 'en', label: 'EN', path: '/cookie-policy' },
  { code: 'de', label: 'DE', path: '/de/cookie-policy' },
  { code: 'ar', label: 'AR', path: '/cookie-policy' }
];

const CookiePolicy: React.FC = () => (
  <Layout>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Cookie-Richtlinie</h1>
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
          <h2 className="text-xl font-semibold text-white mb-4">1. Was sind Cookies?</h2>
          <p>
            Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie unsere Website besuchen. Sie ermöglichen eine Wiedererkennung Ihres Browsers und speichern bestimmte Informationen.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">2. Welche Cookies verwenden wir?</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Notwendige Cookies: Für den Betrieb der Website erforderlich</li>
            <li>Analyse-Cookies: Zur Verbesserung unseres Angebots</li>
            <li>Marketing-Cookies: Für personalisierte Werbung</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">3. Wie können Sie Cookies verwalten?</h2>
          <p>
            Sie können Ihre Cookie-Einstellungen jederzeit in Ihrem Browser anpassen oder Cookies löschen. Die Deaktivierung von Cookies kann die Funktionalität der Website einschränken.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">4. Drittanbieter-Cookies</h2>
          <p>
            Wir nutzen auch Cookies von Drittanbietern (z.B. Google Analytics). Diese unterliegen den Datenschutzrichtlinien der jeweiligen Anbieter.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">5. Änderungen dieser Cookie-Richtlinie</h2>
          <p>
            Wir behalten uns vor, diese Cookie-Richtlinie jederzeit zu ändern. Die aktuelle Version ist immer auf unserer Website verfügbar.
          </p>
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

export default CookiePolicy; 