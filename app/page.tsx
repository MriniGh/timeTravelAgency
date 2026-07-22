"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type DestinationKey = "paris" | "cretace" | "florence";

const destinations = {
  paris: {
    title: "Paris 1889",
    image: "/assets/paris-1889.jpg",
    tagline: "Exposition Universelle et Belle Epoque",
    description:
      "Un sejour elegant dans le Paris de la Tour Eiffel naissante, entre pavillons, lumieres au gaz et effervescence mondaine.",
    price: "A partir de 12 900 EUR par personne",
    facts: {
      Ambiance: "Raffinee, urbaine, romantique",
      Ideal: "Architecture, mode, photographie, monuments",
      Risque: "Faible, zone historique stabilisee",
    },
  },
  cretace: {
    title: "Cretace -65M",
    image: "/assets/cretace-65ma.jpg",
    tagline: "Derniers jours des dinosaures",
    description:
      "Une expedition securisee aux confins du monde prehistorique, avec observation distante de la faune et paysages tropicaux.",
    price: "A partir de 18 700 EUR par personne",
    facts: {
      Ambiance: "Sauvage, spectaculaire, scientifique",
      Ideal: "Nature, aventure, photographie animaliere",
      Risque: "Eleve, escorte chronobiologique obligatoire",
    },
  },
  florence: {
    title: "Florence 1504",
    image: "/assets/florence-1504.jpg",
    tagline: "Age d'or artistique",
    description:
      "Une immersion culturelle dans la Renaissance, entre ateliers de sculpture, palais, Duomo et conversations d'artistes.",
    price: "A partir de 14 600 EUR par personne",
    facts: {
      Ambiance: "Culturelle, lumineuse, contemplative",
      Ideal: "Art, architecture, ateliers, histoire",
      Risque: "Modere, protocole discret requis",
    },
  },
} satisfies Record<
  DestinationKey,
  {
    title: string;
    image: string;
    tagline: string;
    description: string;
    price: string;
    facts: Record<string, string>;
  }
>;

const questions = [
  "Quel voyage est le plus romantique ?",
  "Quel est le prix pour Florence 1504 ?",
  "Je veux de l'aventure et de la nature",
];

function answer(question: string) {
  const q = question.toLowerCase();
  if (q.includes("prix") || q.includes("budget")) {
    return "Nos tarifs fictifs commencent a 12 900 EUR pour Paris 1889, 14 600 EUR pour Florence 1504 et 18 700 EUR pour le Cretace, qui demande une securite renforcee.";
  }
  if (q.includes("romantique") || q.includes("couple")) {
    return "Je recommande Paris 1889 : lumiere doree, promenades autour de l'Exposition Universelle et atmosphere Belle Epoque tres elegante.";
  }
  if (q.includes("nature") || q.includes("aventure") || q.includes("dinosaure")) {
    return "Le Cretace est le meilleur choix pour l'aventure. L'experience est spectaculaire, avec escorte et distances d'observation obligatoires.";
  }
  if (q.includes("art") || q.includes("renaissance") || q.includes("florence")) {
    return "Florence 1504 est ideale pour l'art : Duomo, ateliers, sculpture et ambiance Renaissance. C'est la destination la plus culturelle.";
  }
  return "Je peux vous aider a choisir entre Paris 1889, le Cretace et Florence 1504 selon vos envies : art, nature, elegance, budget ou niveau d'aventure.";
}

export default function Home() {
  const [selected, setSelected] = useState<DestinationKey>("paris");
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Bonjour, je suis Agent Chronos. Quelle epoque souhaitez-vous explorer ?",
    },
  ]);
  const [recommendation, setRecommendation] = useState(
    "Repondez au quiz pour recevoir une destination conseillee.",
  );
  const [booking, setBooking] = useState("");

  const current = destinations[selected];
  const destinationEntries = useMemo(
    () => Object.entries(destinations) as [DestinationKey, (typeof destinations)[DestinationKey]][],
    [],
  );

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 },
    );
    reveals.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function sendQuestion(question: string) {
    if (!question.trim()) return;
    setChatOpen(true);
    setMessages((items) => [
      ...items,
      { role: "user", text: question },
      { role: "bot", text: answer(question) },
    ]);
  }

  function handleChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendQuestion(input);
    setInput("");
  }

  function handleQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const scores: Record<DestinationKey, number> = { paris: 0, cretace: 0, florence: 0 };
    form.forEach((value) => {
      scores[value as DestinationKey] += 1;
    });
    const winner = (Object.entries(scores) as [DestinationKey, number][]).sort((a, b) => b[1] - a[1])[0][0];
    setSelected(winner);
    setRecommendation(
      `${destinations[winner].title} est votre meilleure destination. ${destinations[winner].description} Budget indicatif : ${destinations[winner].price}.`,
    );
  }

  function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setBooking(
      `Demande validee pour ${data.travelers} voyageur(s), destination ${data.destination}, depart souhaite le ${data.date}. Un conseiller TimeTravel vous contactera pour le protocole de securite.`,
    );
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#accueil" aria-label="Retour accueil">
          <span className="brand-mark">TTA</span>
          <span>TimeTravel Agency</span>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#destinations">Destinations</a>
          <a href="#assistant">Assistant</a>
          <a href="#quiz">Quiz</a>
          <a href="#reservation">Reservation</a>
        </nav>
      </header>

      <main>
        <section id="accueil" className="hero">
          <video className="hero-video" autoPlay muted loop playsInline poster="/assets/paris-1889.jpg">
            <source src="/assets/timetravel-teaser.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="hero-content reveal">
            <p className="eyebrow">Agence de voyage temporel de luxe</p>
            <h1>Choisissez votre epoque. Nous ouvrons le passage.</h1>
            <p>
              Explorez trois destinations impossibles avec un conseiller intelligent, un itineraire personnalise et
              une reservation immersive.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#destinations">Explorer</a>
              <a className="button ghost" href="#assistant">Parler a l&apos;agent</a>
            </div>
          </div>
        </section>

        <section className="agency section reveal" aria-labelledby="agency-title">
          <div>
            <p className="eyebrow">Depuis demain</p>
            <h2 id="agency-title">Une agence premium pour voyageurs temporels exigeants.</h2>
          </div>
          <p>
            TimeTravel Agency combine curation historique, simulation de risques chronologiques et accompagnement
            conversationnel pour transformer une curiosite en experience planifiee.
          </p>
        </section>

        <section id="destinations" className="section reveal" aria-labelledby="destinations-title">
          <div className="section-heading">
            <p className="eyebrow">Galerie interactive</p>
            <h2 id="destinations-title">Trois epoques, trois styles de voyage.</h2>
          </div>
          <div className="cards">
            {destinationEntries.map(([key, destination]) => (
              <article className={`card ${selected === key ? "selected" : ""}`} key={key}>
                <img src={destination.image} alt={destination.title} loading="lazy" />
                <div className="card-content">
                  <p className="eyebrow">{destination.tagline}</p>
                  <h3>{destination.title}</h3>
                  <p>{destination.description}</p>
                  <button className="button ghost" onClick={() => setSelected(key)}>Voir le detail</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section detail-panel reveal" aria-live="polite">
          <div>
            <p className="eyebrow">Destination selectionnee</p>
            <h2>{current.title}</h2>
            <p>{current.description}</p>
          </div>
          <dl className="facts">
            {Object.entries(current.facts).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="assistant" className="section split reveal" aria-labelledby="assistant-title">
          <div>
            <p className="eyebrow">Agent IA integre</p>
            <h2 id="assistant-title">Un conseiller conversationnel pour guider le choix.</h2>
            <p>
              Le widget repond aux questions frequentes, compare les destinations, propose des budgets fictifs et
              conseille selon les envies du visiteur.
            </p>
          </div>
          <div className="chat-preview">
            <p>
              <strong>Essayez :</strong>
            </p>
            {questions.map((question) => (
              <button key={question} onClick={() => sendQuestion(question)}>{question}</button>
            ))}
          </div>
        </section>

        <section id="quiz" className="section reveal" aria-labelledby="quiz-title">
          <div className="section-heading">
            <p className="eyebrow">Personnalisation</p>
            <h2 id="quiz-title">Quiz de recommandation</h2>
          </div>
          <form className="quiz" onSubmit={handleQuiz}>
            <label>
              Experience recherchee
              <select name="experience">
                <option value="florence">Culturelle et artistique</option>
                <option value="cretace">Aventure et nature</option>
                <option value="paris">Elegance et raffinement</option>
              </select>
            </label>
            <label>
              Periode preferee
              <select name="period">
                <option value="paris">Histoire moderne</option>
                <option value="cretace">Temps anciens et origines</option>
                <option value="florence">Renaissance et classicisme</option>
              </select>
            </label>
            <label>
              Vous preferez
              <select name="mood">
                <option value="paris">L&apos;effervescence urbaine</option>
                <option value="cretace">La nature sauvage</option>
                <option value="florence">L&apos;art et l&apos;architecture</option>
              </select>
            </label>
            <label>
              Activite ideale
              <select name="activity">
                <option value="paris">Visiter des monuments</option>
                <option value="cretace">Observer la faune</option>
                <option value="florence">Explorer des ateliers et musees</option>
              </select>
            </label>
            <button className="button primary" type="submit">Obtenir ma recommandation</button>
          </form>
          <article className="recommendation">{recommendation}</article>
        </section>

        <section id="reservation" className="section reservation reveal" aria-labelledby="reservation-title">
          <div>
            <p className="eyebrow">Reservation</p>
            <h2 id="reservation-title">Planifier un depart temporel.</h2>
          </div>
          <form className="booking" onSubmit={handleBooking}>
            <label>
              Destination
              <select name="destination">
                <option>Paris 1889</option>
                <option>Cretace -65M</option>
                <option>Florence 1504</option>
              </select>
            </label>
            <label>
              Date de depart
              <input name="date" type="date" required />
            </label>
            <label>
              Voyageurs
              <input name="travelers" type="number" min="1" max="6" defaultValue="2" />
            </label>
            <button className="button primary" type="submit">Valider la demande</button>
          </form>
          <p className="booking-result">{booking}</p>
        </section>
      </main>

      <button className="chat-toggle" onClick={() => setChatOpen(true)} aria-label="Ouvrir le chatbot">
        Chat
      </button>
      <aside className={`chat-widget ${chatOpen ? "open" : ""}`} aria-label="Assistant TimeTravel">
        <div className="chat-header">
          <div>
            <strong>Agent Chronos</strong>
            <span>Conseiller TimeTravel</span>
          </div>
          <button onClick={() => setChatOpen(false)} aria-label="Fermer">x</button>
        </div>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
              {message.text}
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={handleChat}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            type="text"
            placeholder="Posez-moi vos questions sur les voyages temporels..."
            autoComplete="off"
          />
          <button type="submit">Envoyer</button>
        </form>
      </aside>

      <footer>
        <p>TimeTravel Agency - Projet pedagogique Digital & IA</p>
        <p>Noms du groupe : a completer avant depot Moodle</p>
      </footer>
    </>
  );
}
