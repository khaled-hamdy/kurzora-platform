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
  { code: 'en', label: 'EN', path: '/terms-of-service' },
  { code: 'de', label: 'DE', path: '/de/terms-of-service' },
  { code: 'ar', label: 'AR', path: '/terms-of-service' }
];

const sections: Section[] = [
  {
    id: 'scope',
    title: '1. Geltungsbereich und Vertragspartner',
    content: (
      <p>
        Diese Nutzungsbedingungen regeln die Nutzung der Kurzora Trading Signals Plattform (nachfolgend "Plattform" genannt). 
        Betreiber der Plattform ist Kurzora GmbH. Durch die Nutzung der Plattform erkennen Sie diese Bedingungen an.
      </p>
    )
  },
  {
    id: 'description',
    title: '2. Leistungsbeschreibung',
    content: (
      <p>
        Die Plattform bietet Handelssignale und Analysen für Aktien des S&P 500 Index. Die Signale werden alle 15 Minuten 
        aktualisiert und dienen ausschließlich zu Bildungszwecken.
      </p>
    )
  },
  {
    id: 'registration',
    title: '3. Registrierung und Nutzerkonto',
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li>Sie müssen mindestens 18 Jahre alt sein</li>
        <li>Sie sind für die Vertraulichkeit Ihrer Zugangsdaten verantwortlich</li>
        <li>Sie verpflichten sich, wahrheitsgemäße Angaben zu machen</li>
        <li>Ein Konto ist nicht übertragbar</li>
      </ul>
    )
  },
  {
    id: 'subscription',
    title: '4. Abonnement und Zahlungsbedingungen',
    content: (
      <>
        <p>
          Das Premium-Abonnement kostet 99€ pro Monat. Die Zahlung erfolgt im Voraus und wird automatisch 
          monatlich wiederkehrend abgebucht. Sie können Ihr Abonnement jederzeit mit einer Frist von 30 Tagen kündigen.
        </p>
        <p className="mt-4">
          Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Die Rechnungsstellung erfolgt elektronisch.
        </p>
      </>
    )
  },
  {
    id: 'disclaimer',
    title: '5. Haftungsausschluss',
    content: (
      <>
        <p>
          Die bereitgestellten Handelssignale stellen keine Anlageberatung dar. Alle Handelsentscheidungen 
          treffen Sie auf eigene Verantwortung. Wir übernehmen keine Haftung für Verluste oder Schäden, 
          die aus der Nutzung unserer Signale resultieren.
        </p>
        <p className="mt-4">
          Wir behalten uns das Recht vor, die Plattform jederzeit zu ändern oder einzustellen, ohne dass 
          daraus Ansprüche gegen uns entstehen.
        </p>
      </>
    )
  },
  {
    id: 'privacy',
    title: '6. Datenschutz',
    content: (
      <p>
        Wir verarbeiten Ihre personenbezogenen Daten gemäß unserer Datenschutzerklärung und in Übereinstimmung 
        mit der DSGVO. Weitere Informationen finden Sie in unserer separaten Datenschutzerklärung.
      </p>
    )
  },
  {
    id: 'copyright',
    title: '7. Urheberrecht',
    content: (
      <p>
        Alle Inhalte der Plattform sind urheberrechtlich geschützt. Eine Vervielfältigung oder Verbreitung 
        ist ohne unsere ausdrückliche Zustimmung nicht gestattet.
      </p>
    )
  },
  {
    id: 'changes',
    title: '8. Änderungen der Nutzungsbedingungen',
    content: (
      <p>
        Wir behalten uns vor, diese Nutzungsbedingungen jederzeit zu ändern. Änderungen werden Ihnen 
        mindestens 30 Tage vor Inkrafttreten mitgeteilt.
      </p>
    )
  },
  {
    id: 'withdrawal',
    title: '9. Widerrufsrecht',
    content: (
      <>
        <p>
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. 
          Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses. Um Ihr Widerrufsrecht 
          auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter 
          Brief, Telefax oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
        </p>
        <p className="mt-4">
          Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des 
          Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
        </p>
        <p className="mt-4">
          Im Falle eines wirksamen Widerrufs werden die von Ihnen geleisteten Zahlungen unverzüglich 
          zurückerstattet.
        </p>
      </>
    )
  },
  {
    id: 'final',
    title: '10. Schlussbestimmungen',
    content: (
      <>
        <p>
          Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle Streitigkeiten 
          ist, soweit gesetzlich zulässig, unser Geschäftssitz.
        </p>
        <p className="mt-4">
          Sollten einzelne Bestimmungen dieses Vertrages unwirksam oder undurchführbar sein oder nach 
          Vertragsschluss unwirksam oder undurchführbar werden, bleibt davon die Wirksamkeit des Vertrages 
          im Übrigen unberührt.
        </p>
      </>
    )
  }
];

const GermanTermsOfService: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Nutzungsbedingungen
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

export default GermanTermsOfService; 