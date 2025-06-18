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
  { code: 'en', label: 'EN', path: '/risk-disclosure' },
  { code: 'de', label: 'DE', path: '/de/risk-disclosure' },
  { code: 'ar', label: 'AR', path: '/risk-disclosure' }
];

const sections: Section[] = [
  {
    id: 'introduction',
    title: '1. Einführung',
    content: (
      <p>
        Diese Risikohinweise sind ein wichtiger Bestandteil unserer Dienstleistung. Bitte lesen Sie diese 
        sorgfältig durch, bevor Sie unsere Plattform nutzen. Der Handel mit Finanzinstrumenten birgt 
        erhebliche Risiken.
      </p>
    )
  },
  {
    id: 'general-risks',
    title: '2. Allgemeine Risiken',
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li>Verlustrisiko: Sie können Ihr eingesetztes Kapital vollständig verlieren</li>
        <li>Marktrisiko: Kursschwankungen können zu Verlusten führen</li>
        <li>Liquiditätsrisiko: Positionen können nicht immer sofort geschlossen werden</li>
        <li>Währungsrisiko: Bei internationalen Transaktionen</li>
      </ul>
    )
  },
  {
    id: 'trading-risks',
    title: '3. Handelsrisiken',
    content: (
      <>
        <p>
          Unsere Handelssignale basieren auf technischen Analysen und historischen Daten. Diese sind keine 
          Garantie für zukünftige Ergebnisse.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li>Verzögerungen bei der Signalübermittlung</li>
          <li>Technische Probleme bei der Ausführung</li>
          <li>Unterschiedliche Marktbedingungen</li>
          <li>Emotionale Handelsentscheidungen</li>
        </ul>
      </>
    )
  },
  {
    id: 'leverage',
    title: '4. Hebelwirkung',
    content: (
      <p>
        Die Nutzung von Hebelprodukten kann zu überproportionalen Gewinnen, aber auch zu überproportionalen 
        Verlusten führen. Ein kleiner Marktbewegung kann zu erheblichen Verlusten führen.
      </p>
    )
  },
  {
    id: 'past-performance',
    title: '5. Vergangene Performance',
    content: (
      <p>
        Vergangene Ergebnisse sind kein Indikator für zukünftige Ergebnisse. Die Wertentwicklung in der 
        Vergangenheit garantiert keine ähnliche Entwicklung in der Zukunft.
      </p>
    )
  },
  {
    id: 'tax',
    title: '6. Steuerliche Aspekte',
    content: (
      <p>
        Gewinne aus dem Handel können steuerpflichtig sein. Wir empfehlen, sich von einem Steuerberater 
        beraten zu lassen.
      </p>
    )
  },
  {
    id: 'responsibility',
    title: '7. Eigenverantwortung',
    content: (
      <p>
        Sie sind für Ihre Handelsentscheidungen selbst verantwortlich. Unsere Signale sind nur ein 
        Hilfsmittel und ersetzen keine eigene Analyse.
      </p>
    )
  },
  {
    id: 'recommendations',
    title: '8. Empfehlungen',
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li>Handeln Sie nur mit Kapital, dessen Verlust Sie verschmerzen können</li>
        <li>Diversifizieren Sie Ihr Portfolio</li>
        <li>Setzen Sie Stop-Loss-Orders</li>
        <li>Bilden Sie sich kontinuierlich weiter</li>
      </ul>
    )
  }
];

const GermanRiskDisclosure: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Risikohinweise
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

export default GermanRiskDisclosure; 