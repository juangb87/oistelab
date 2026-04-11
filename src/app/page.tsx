"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FiDollarSign, FiGrid, FiMessageSquare, FiSend, FiSettings, FiShoppingBag, FiUserCheck } from "react-icons/fi";

const BOOKING_URL = "https://wa.me/573106460010?text=Hola%20Pacho%2C%20quiero%20informaci%C3%B3n%20sobre%20automatizaci%C3%B3n%20de%20procesos%20y%20canales%20para%20mi%20negocio";
const CONTACT_LABEL = "WhatsApp: +57 310 6460010";

const PORTFOLIO = [
  { name: "Arca Build", logo: "/logo-arca.jpg", url: "https://arcabuild.co", industry: "Construcción" },
  { name: "Home Inspections Halley", logo: "/logo-halley.jpg", url: "https://homeinspectionshalley.com", industry: "Servicios inmobiliarios" },
  { name: "Bumbei", logo: "/logo-bumbei.jpg", url: "https://bumbei.com", industry: "Fintech" },
  { name: "Galeonica", logo: "/logo-galeonica.jpg", url: "https://galeonica.com", industry: "Fintech B2B" },
];

const BENEFITS = [
  { title: "Responde al instante", desc: "Atiende preguntas, solicitudes y mensajes sin dejar todo en visto.", icon: FiMessageSquare },
  { title: "Filtra y organiza", desc: "Clasifica leads, pedidos o citas y mueve cada caso al siguiente paso.", icon: FiUserCheck },
  { title: "Le quita carga al equipo", desc: "Menos tareas repetitivas, más foco en cerrar y operar mejor.", icon: FiSettings },
];

const PLANS = [
  { name: "Base", price: "Desde COP 1.800.000", icon: FiGrid },
  { name: "Pro", price: "Desde COP 3.500.000", icon: FiShoppingBag },
  { name: "Soporte mensual", price: "Desde COP 350.000/mes", icon: FiDollarSign },
];

type DemoKey = "restaurante" | "inmobiliaria" | "clinica";

type KnowledgeDoc = { text: string; keywords: string[] };
type DemoConfig = {
  label: string;
  badge: string;
  placeholder: string;
  questions: string[];
  docs: KnowledgeDoc[];
  fallback: string;
};

const DEMOS: Record<DemoKey, DemoConfig> = {
  restaurante: {
    label: "Restaurante",
    badge: "Pedidos y reservas",
    placeholder: "Ej: La Cocina de Pacho",
    questions: ["¿Cuál es el menú de hoy?", "¿Hacen domicilios en esta zona?", "Quiero reservar para 4 personas hoy a las 8 pm"],
    docs: [
      { text: "El restaurante ofrece menú ejecutivo, opciones a la carta, atención por chat, preguntas sobre ingredientes, horarios y recomendaciones según el cliente.", keywords: ["menu", "carta", "platos", "almuerzo", "comida", "ingredientes"] },
      { text: "Los domicilios se confirman según zona de cobertura, horario y volumen de pedidos. Se puede pedir ubicación, barrio y tiempo estimado de entrega antes de confirmar.", keywords: ["domicilio", "envio", "zona", "cobertura", "barrio", "entrega"] },
      { text: "Las reservas piden nombre, número de contacto, cantidad de personas, fecha y hora. Luego se confirma disponibilidad y se envía mensaje de confirmación.", keywords: ["reserva", "mesa", "personas", "hora", "agendar", "booking"] },
    ],
    fallback: "Puedo ayudarte con menú, domicilios, reservas o preguntas frecuentes.",
  },
  inmobiliaria: {
    label: "Inmobiliaria",
    badge: "Leads y agenda",
    placeholder: "Ej: Inmobiliaria Medellín Norte",
    questions: ["Busco apartamento en arriendo en Medellín", "¿Qué documentos necesito para arrendar?", "Quiero agendar una visita esta semana"],
    docs: [
      { text: "Para recomendar inmuebles conviene preguntar ciudad, zona, presupuesto, número de habitaciones y si busca arriendo o compra. Luego se filtran opciones y se comparte el siguiente paso.", keywords: ["apartamento", "casa", "arriendo", "compra", "medellin", "zona", "presupuesto"] },
      { text: "El proceso de arrendamiento normalmente pide documento, soportes de ingresos, datos de codeudor o respaldo y validación del perfil del interesado.", keywords: ["documentos", "requisitos", "papeles", "arrendar", "codeudor", "ingresos"] },
      { text: "Para agendar visitas se pide el inmueble de interés o necesidad del cliente, horarios disponibles y datos de contacto para confirmación.", keywords: ["visita", "agendar", "cita", "horario", "inmueble", "ver"] },
    ],
    fallback: "Puedo ayudarte con búsqueda de inmuebles, requisitos o visitas.",
  },
  clinica: {
    label: "Clínica estética",
    badge: "Agenda y consultas",
    placeholder: "Ej: Clínica Aura",
    questions: ["¿Qué tratamientos tienen para rejuvenecimiento facial?", "¿Cuánto cuesta una valoración?", "Quiero agendar una cita para este sábado"],
    docs: [
      { text: "La clínica atiende preguntas sobre tratamientos faciales, corporales y valoración inicial. El sistema orienta sin diagnosticar y dirige hacia una valoración profesional.", keywords: ["tratamiento", "facial", "corporal", "rejuvenecimiento", "botox", "piel"] },
      { text: "Las valoraciones pueden tener costo según servicio, agenda y disponibilidad. Lo ideal es tomar datos del prospecto y confirmar el valor según el caso.", keywords: ["precio", "costo", "valoracion", "cuanto", "tarifa", "consulta"] },
      { text: "Para agendar cita se debe pedir nombre completo, número de contacto, tratamiento de interés y horario preferido para confirmar disponibilidad.", keywords: ["agendar", "cita", "sabado", "horario", "reserva", "valoracion"] },
    ],
    fallback: "Puedo ayudarte con tratamientos, valoraciones o agenda.",
  },
};

type ChatMessage = { role: "user" | "assistant"; text: string };

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ");
}

function retrieveAnswer(question: string, config: DemoConfig, name: string, business: string) {
  const normalizedQuestion = normalize(question);
  const scoredDocs = config.docs
    .map((doc) => {
      const keywordHits = doc.keywords.reduce((acc, keyword) => acc + (normalizedQuestion.includes(normalize(keyword)) ? 2 : 0), 0);
      const textHits = normalize(doc.text).split(/\s+/).filter((word) => word.length > 3 && normalizedQuestion.includes(word)).length;
      return { doc, score: keywordHits + textHits };
    })
    .sort((a, b) => b.score - a.score);

  const best = scoredDocs[0];
  const businessName = business || "tu negocio";
  const userName = name ? `${name}, ` : "";

  if (!best || best.score <= 0) return `Hola ${userName}soy el asistente de ${businessName}. ${config.fallback}`;
  return `Hola ${userName}soy el asistente de ${businessName}. ${best.doc.text}`;
}

function SectionRow({ index, title, description, right }: { index: string; title: string; description: string; right: React.ReactNode }) {
  return (
    <section className="border-t" style={{ borderColor: "var(--hontley-border)" }}>
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-[80px_1fr_240px] gap-8 items-center">
        <div className="text-sm" style={{ color: "var(--hontley-muted)" }}>{index}</div>
        <div>
          <h2 className="text-4xl sm:text-5xl tracking-tight mb-4">{title}</h2>
          <p className="max-w-2xl text-lg" style={{ color: "var(--hontley-muted)" }}>{description}</p>
        </div>
        <div className="flex justify-start lg:justify-end">{right}</div>
      </div>
    </section>
  );
}

export default function Home() {
  const [demoType, setDemoType] = useState<DemoKey>("restaurante");
  const [demoName, setDemoName] = useState("");
  const [demoBusiness, setDemoBusiness] = useState("");
  const [demoInput, setDemoInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const demoConfig = DEMOS[demoType];

  useEffect(() => {
    setChatMessages([]);
    setDemoInput("");
  }, [demoType]);

  const whatsappHref = useMemo(() => {
    const business = demoBusiness.trim() || "mi negocio";
    const label = DEMOS[demoType].label.toLowerCase();
    return `https://wa.me/573106460010?text=${encodeURIComponent(`Hola Pacho, acabo de probar el demo de ${label} para ${business} y quiero cotizar una automatización para mi negocio.`)}`;
  }, [demoBusiness, demoType]);

  const submitQuestion = (question: string) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    const answer = retrieveAnswer(cleanQuestion, demoConfig, demoName.trim(), demoBusiness.trim());
    setChatMessages((prev) => [...prev, { role: "user", text: cleanQuestion }, { role: "assistant", text: answer }]);
    setDemoInput("");
  };

  return (
    <main className="min-h-screen">
      <nav className="max-w-6xl mx-auto px-6 pt-6 pb-10">
        <div
          className="rounded-full px-6 py-4 flex items-center justify-between gap-6 border shadow-sm"
          style={{ background: "var(--hontley-panel-strong)", borderColor: "var(--hontley-border)", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}
        >
          <div className="text-xl font-medium">Hontley</div>
          <div className="hidden md:flex items-center gap-10 text-sm" style={{ color: "var(--hontley-muted)" }}>
            <a href="#demo">Demo</a>
            <a href="#benefits">Servicios</a>
            <a href="#cases">Casos</a>
            <a href="#pricing">Precios</a>
          </div>
          <a
            href={BOOKING_URL}
            className="px-5 py-3 rounded-full text-sm font-semibold"
            style={{ background: "#111", color: "#fff" }}
          >
            Hablar con Pacho
          </a>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-end">
          <div>
            <div className="text-sm mb-5" style={{ color: "var(--hontley-muted)" }}>01</div>
            <h1 className="text-6xl sm:text-7xl lg:text-[86px] tracking-tight leading-[0.95] mb-5">
              Chats que responden,
              <br />
              organizan y dan
              <br />
              seguimiento.
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mb-8" style={{ color: "var(--hontley-muted)" }}>
              Automatización para negocios que quieren atender mejor, mover más rápido cada solicitud y quitarle carga al equipo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#demo" className="px-6 py-3.5 rounded-full text-sm font-semibold" style={{ background: "#111", color: "#fff" }}>
                Probar demo
              </a>
              <a href={BOOKING_URL} className="px-6 py-3.5 rounded-full text-sm font-semibold border" style={{ borderColor: "var(--hontley-border)", color: "#111" }}>
                Ver si aplica a mi negocio
              </a>
            </div>
          </div>

          <div className="min-h-[280px] flex items-center justify-center">
            <div className="relative w-[180px] h-[180px]">
              <div className="absolute inset-[68px] rounded-full border-2" style={{ borderColor: "#111" }} />
              {[
                "top-0 left-1/2 -translate-x-1/2",
                "top-6 right-6",
                "top-1/2 right-0 -translate-y-1/2",
                "bottom-6 right-6",
                "bottom-0 left-1/2 -translate-x-1/2",
                "bottom-6 left-6",
                "top-1/2 left-0 -translate-y-1/2",
                "top-6 left-6",
              ].map((position, i) => (
                <div key={i} className={`absolute ${position}`}>
                  <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: "#111", background: "#f7f4ee" }} />
                </div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full" style={{ background: "#111" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits">
        <SectionRow
          index="02"
          title="Atención inmediata"
          description="Responde preguntas, pedidos, reservas o solicitudes sin dejar la operación colgada en WhatsApp o correo."
          right={<FiMessageSquare size={64} />}
        />
        <SectionRow
          index="03"
          title="Organiza el siguiente paso"
          description="Filtra cada conversación, toma datos útiles y mueve el caso a agenda, venta, soporte o seguimiento."
          right={<FiUserCheck size={64} />}
        />
        <SectionRow
          index="04"
          title="Menos carga operativa"
          description="Le quita trabajo repetitivo al equipo y deja más tiempo para vender, atender y cerrar mejor."
          right={<FiSettings size={64} />}
        />
      </section>

      <section id="demo" className="border-t" style={{ borderColor: "#222", background: "#000", color: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div>
            <div className="text-sm mb-5" style={{ color: "#aaa" }}>05</div>
            <h2 className="text-4xl sm:text-5xl tracking-tight mb-4">Demo en formato chat</h2>
            <p className="text-lg mb-8" style={{ color: "#bdbdbd" }}>
              Pruébalo como si fueras un cliente real. Elige un tipo de negocio y haz preguntas libres.
            </p>

            <div className="space-y-3 mb-5">
              {(Object.entries(DEMOS) as [DemoKey, DemoConfig][]).map(([key, demo]) => (
                <button
                  key={key}
                  onClick={() => setDemoType(key)}
                  className="w-full rounded-md px-4 py-4 text-left border transition font-mono"
                  style={{ background: demoType === key ? "#fff" : "#000", color: demoType === key ? "#000" : "#fff", borderColor: demoType === key ? "#fff" : "#444" }}
                >
                  {`> ${demo.label}`}
                </button>
              ))}
            </div>

            <div className="space-y-3 font-mono">
              <input
                value={demoName}
                onChange={(e) => setDemoName(e.target.value)}
                placeholder="> Tu nombre_"
                className="w-full rounded-md px-4 py-4 outline-none border"
                style={{ background: "#000", color: "#fff", borderColor: "#444" }}
              />
              <input
                value={demoBusiness}
                onChange={(e) => setDemoBusiness(e.target.value)}
                placeholder={`> ${demoConfig.placeholder}_`}
                className="w-full rounded-md px-4 py-4 outline-none border"
                style={{ background: "#000", color: "#fff", borderColor: "#444" }}
              />
              <div className="rounded-md px-4 py-4 border flex items-center gap-3 font-mono" style={{ background: "#000", color: "#fff", borderColor: "#444" }}>
                <FiSend size={16} />
                <span>{`> ${demoConfig.badge}`}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-md border p-5 sm:p-6 font-mono" style={{ background: "#000", borderColor: "#fff", boxShadow: "0 0 0 1px #fff inset" }}>
              <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
                <div>
                  <h3 className="text-xl font-medium">{demoBusiness.trim() || demoConfig.label} Assistant</h3>
                  <p className="text-sm" style={{ color: "#aaa" }}>_ Haz clic o escribe una pregunta</p>
                </div>
                <div className="text-xs" style={{ color: "#aaa" }}>● Demo en vivo</div>
              </div>

              <div className="grid grid-cols-1 gap-2 mb-4">
                {demoConfig.questions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => submitQuestion(question)}
                    className="w-full text-left rounded-md px-4 py-3 transition text-sm border"
                    style={{ background: "#111", color: "#fff", borderColor: "#444" }}
                  >
                    {`> ${question}`}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-5">
                <input
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitQuestion(demoInput);
                    }
                  }}
                  placeholder="> Escribe una pregunta como lo haría un cliente_"
                  className="flex-1 rounded-md px-4 py-3 outline-none border font-mono"
                  style={{ background: "#000", color: "#fff", borderColor: "#fff" }}
                />
                <button type="button" onClick={() => submitQuestion(demoInput)} className="px-4 py-3 rounded-md font-semibold" style={{ background: "#fff", color: "#000" }}>
                  Enviar
                </button>
              </div>

              <div className="space-y-4 min-h-[320px]">
                {chatMessages.length > 0 ? (
                  chatMessages.map((message, index) => (
                    <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className="max-w-[90%] rounded-md px-4 py-3 text-sm leading-relaxed border"
                        style={
                          message.role === "user"
                            ? { background: "#fff", color: "#000", borderColor: "#fff" }
                            : { background: "#111", color: "#fff", borderColor: "#444" }
                        }
                      >
                        {message.role === "assistant" ? `> ${message.text}` : message.text}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full rounded-md p-5 text-sm flex items-center justify-center text-center border" style={{ background: "#050505", color: "#aaa", borderColor: "#444" }}>
                    {"> Prueba una pregunta y mira cómo respondería el sistema."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cases" className="border-t" style={{ borderColor: "var(--hontley-border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
            <div>
              <div className="text-sm mb-3" style={{ color: "var(--hontley-muted)" }}>06</div>
              <h2 className="text-4xl tracking-tight">Casos reales</h2>
            </div>
            <a href={BOOKING_URL} className="text-sm font-medium hover:underline">Ver si aplica a mi negocio</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PORTFOLIO.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl p-4 border transition" style={{ background: "rgba(255,255,255,0.55)", borderColor: "var(--hontley-border)" }}>
                <div className="flex items-center gap-3">
                  <Image src={p.logo} alt={p.name} width={42} height={42} className="rounded-xl object-cover" />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs" style={{ color: "var(--hontley-muted)" }}>{p.industry}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t" style={{ borderColor: "var(--hontley-border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
            <div>
              <div className="text-sm mb-3" style={{ color: "var(--hontley-muted)" }}>07</div>
              <h2 className="text-4xl tracking-tight">Precios</h2>
              <p className="mt-3" style={{ color: "var(--hontley-muted)" }}>Implementación en COP. Infra y consumo aparte.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.name} className="rounded-2xl p-5 border" style={{ background: "rgba(255,255,255,0.55)", borderColor: "var(--hontley-border)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center border" style={{ borderColor: "var(--hontley-border)" }}>
                      <Icon size={18} />
                    </div>
                    <div className="text-lg font-medium">{p.name}</div>
                  </div>
                  <div className="text-3xl font-semibold">{p.price}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t" style={{ borderColor: "var(--hontley-border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-4xl sm:text-5xl tracking-tight mb-4">¿Quieres uno así para tu negocio?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: "var(--hontley-muted)" }}>
            Escríbele a Pacho y te mostramos qué se puede automatizar y cuánto costaría montarlo.
          </p>
          <a href={whatsappHref} className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold" style={{ background: "#111", color: "#fff" }}>
            Hablar por WhatsApp
          </a>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm flex-wrap gap-4" style={{ color: "var(--hontley-muted)" }}>
        <span className="font-medium" style={{ color: "var(--hontley-black)" }}>Hontley</span>
        <span>© {new Date().getFullYear()} Hontley. Todos los derechos reservados.</span>
        <a href={BOOKING_URL} className="hover:underline">{CONTACT_LABEL}</a>
      </footer>
    </main>
  );
}
