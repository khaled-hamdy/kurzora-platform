import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Globe } from 'lucide-react';
import Layout from '../../../components/Layout';

interface LanguageLink {
  code: string;
  label: string;
  path: string;
}

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const languageLinks: LanguageLink[] = [
  { code: 'en', label: 'EN', path: '/privacy-policy' },
  { code: 'de', label: 'DE', path: '/de/privacy-policy' },
  { code: 'ar', label: 'AR', path: '/privacy-policy' }
];

const sections: Section[] = [
  {
    id: 'introduction',
    title: '1. Einführung',
    content: (
      <p>
        Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und die Zwecke der Erhebung und 
        Verwendung personenbezogener Daten auf unserer Plattform. Wir nehmen den Schutz Ihrer persönlichen 
        Daten sehr ernst und behandeln diese vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften.
      </p>
    )
  },
  {
    id: 'controller',
    title: '2. Verantwortlicher',
    content: (
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website ist die Kurzora GmbH. 
        Kontaktdaten finden Sie im Impressum.
      </p>
    )
  },
  {
    id: 'data-collection',
    title: '3. Datenerfassung',
    content: (
      <>
        <p>
          Wir erheben folgende personenbezogene Daten:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li>Name und Kontaktdaten</li>
          <li>Zahlungsinformationen</li>
          <li>Nutzungsdaten der Plattform</li>
          <li>IP-Adresse und Browser-Informationen</li>
        </ul>
      </>
    )
  },
  {
    id: 'purpose',
    title: '4. Zweck der Datenerhebung',
    content: (
      <p>
        Die Daten werden erhoben, um Ihnen unsere Dienstleistungen anbieten zu können, die Plattform zu 
        verbessern und gesetzliche Verpflichtungen zu erfüllen.
      </p>
    )
  },
  {
    id: 'legal-basis',
    title: '5. Rechtsgrundlage',
    content: (
      <p>
        Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung), 
        Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen).
      </p>
    )
  },
  {
    id: 'data-retention',
    title: '6. Datenspeicherung',
    content: (
      <p>
        Ihre Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist oder 
        gesetzliche Aufbewahrungsfristen dies vorschreiben.
      </p>
    )
  },
  {
    id: 'data-sharing',
    title: '7. Datenweitergabe',
    content: (
      <p>
        Eine Weitergabe Ihrer Daten an Dritte erfolgt nur, wenn dies gesetzlich vorgeschrieben ist oder 
        Sie zuvor eingewilligt haben.
      </p>
    )
  },
  {
    id: 'rights',
    title: '8. Ihre Rechte',
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li>Recht auf Auskunft</li>
        <li>Recht auf Berichtigung</li>
        <li>Recht auf Löschung</li>
        <li>Recht auf Einschränkung der Verarbeitung</li>
        <li>Recht auf Datenübertragbarkeit</li>
        <li>Widerspruchsrecht</li>
      </ul>
    )
  },
  {
    id: 'cookies',
    title: '9. Cookies',
    content: (
      <p>
        Wir verwenden Cookies, um die Nutzung unserer Website zu verbessern. Sie können die Verwendung von 
        Cookies in Ihren Browsereinstellungen jederzeit deaktivieren.
      </p>
    )
  },
  {
    id: 'security',
    title: '10. Datensicherheit',
    content: (
      <p>
        Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen Manipulation, 
        Verlust oder unberechtigten Zugriff zu schützen.
      </p>
    )
  }
];

const GermanPrivacyPolicy: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Datenschutzerklärung
          </h1>
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
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-xl font-semibold text-white mb-4">
                {section.title}
              </h2>
              {section.content}
            </section>
          ))}
        </div>
        
        <div className="mt-10 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
          <p className="text-blue-400 text-sm text-center">
            Zuletzt aktualisiert: 15. Januar 2024
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default GermanPrivacyPolicy; 