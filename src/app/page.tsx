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
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div>
            <div className="text-sm mb-5" style={{ color: "var(--hontley-muted)" }}>01</div>
            <h1 className="text-6xl sm:text-7xl lg:text-[86px] tracking-tight leading-[0.95] mb-5 font-bold">
              Chats que responden,
              <br />
              organizan y dan
              <br />
              seguimiento.
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mb-8" style={{ color: "var(--hontley-muted)" }}>
              Agentes coordinados para atender clientes, mover tareas y hacer follow-up sin que el negocio se frene.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="#demo" className="px-6 py-3.5 rounded-full text-sm font-semibold" style={{ background: "#111", color: "#fff" }}>
                Probar demo
              </a>
              <a href={BOOKING_URL} className="px-6 py-3.5 rounded-full text-sm font-semibold border" style={{ borderColor: "var(--hontley-border)", color: "#111" }}>
                Ver si aplica a mi negocio
              </a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              {[
                "Responde",
                "Organiza",
                "Da seguimiento",
              ].map((item) => (
                <span key={item} className="px-4 py-2 rounded-full border" style={{ borderColor: "var(--hontley-border)", background: "rgba(255,255,255,0.65)" }}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border p-5 sm:p-6 overflow-hidden hero-office" style={{ borderColor: "#d8d0c4", background: "linear-gradient(180deg, #f8f4ec 0%, #efe7d9 100%)", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs uppercase tracking-[0.22em]" style={{ color: "#7e7468" }}>AI Office</div>
                <div className="text-lg font-semibold">Agentes ejecutando tareas</div>
              </div>
              <div className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: "#d8d0c4", background: "rgba(255,255,255,0.7)", color: "#5a5247" }}>
                En vivo
              </div>
            </div>

            <div className="relative rounded-[24px] border p-4 sm:p-5 min-h-[360px] hero-office-scene" style={{ borderColor: "#ddd2c3", background: "radial-gradient(circle at top, rgba(255,255,255,0.95), rgba(241,233,220,0.95))" }}>
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] sm:text-xs" style={{ color: "#746a5e" }}>
                <span>Subagentes coordinados</span>
                <span>Lead → Agenda → Seguimiento</span>
              </div>

              <div className="absolute inset-x-10 top-20 bottom-14 hidden sm:block">
                <div className="absolute left-[18%] top-[26%] h-px w-[28%] border-t border-dashed" style={{ borderColor: "#cdbda7" }} />
                <div className="absolute left-[46%] top-[26%] h-[30%] w-px border-l border-dashed" style={{ borderColor: "#cdbda7" }} />
                <div className="absolute left-[46%] top-[56%] h-px w-[28%] border-t border-dashed" style={{ borderColor: "#cdbda7" }} />
              </div>

              {[
                { title: "Leads", note: "Nuevo lead", className: "left-[6%] top-[18%]", accent: "#7c3aed" },
                { title: "Agenda", note: "Reserva agendada", className: "left-[38%] top-[18%]", accent: "#2563eb" },
                { title: "Soporte", note: "Seguimiento enviado", className: "left-[70%] top-[48%]", accent: "#f97316" },
              ].map((station) => (
                <div
                  key={station.title}
                  className={`absolute ${station.className} w-[110px] sm:w-[128px] rounded-2xl border p-3 sm:p-4 hero-station`}
                  style={{ borderColor: "#d8d0c4", background: "rgba(255,255,255,0.78)", boxShadow: `0 0 0 1px ${station.accent}22, 0 16px 30px rgba(0,0,0,0.05)`, animationDelay: station.title === "Leads" ? "0s" : station.title === "Agenda" ? "1.2s" : "2.4s" }}
                >
                  <div className="w-3 h-3 rounded-full mb-3 hero-station-dot" style={{ background: station.accent, boxShadow: `0 0 18px ${station.accent}66`, animationDelay: station.title === "Leads" ? "0s" : station.title === "Agenda" ? "1.2s" : "2.4s" }} />
                  <div className="text-sm font-semibold">{station.title}</div>
                  <div className="text-[11px] sm:text-xs mt-1" style={{ color: "#746a5e" }}>{station.note}</div>
                </div>
              ))}

              {[
                { className: "left-[30%] top-[26%]", delay: "0s" },
                { className: "left-[52%] top-[42%]", delay: "1.2s" },
                { className: "left-[62%] top-[70%]", delay: "2.2s" },
              ].map((agent, index) => (
                <div key={index} className={`absolute ${agent.className} flex flex-col items-center hero-agent hero-agent-${index + 1}`}>
                  <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: "#111", background: "#fff" }} />
                  <div className="w-px h-6" style={{ background: "#111" }} />
                  <div className="w-6 h-3 rounded-full" style={{ background: "#111" }} />
                </div>
              ))}

              <div className="absolute left-[8%] bottom-5 right-[8%] grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  "Lead calificado",
                  "Reserva confirmada",
                  "Follow-up enviado",
                ].map((task) => (
                  <div key={task} className="rounded-2xl border px-3 py-3 text-xs sm:text-sm hero-task-card" style={{ borderColor: "#d8d0c4", background: "rgba(17,17,17,0.92)", color: "#fff", animationDelay: task === "Lead calificado" ? "0s" : task === "Reserva confirmada" ? "1.4s" : "2.8s" }}>
                    {task}
                  </div>
                ))}
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

              <div className="flex flex-col sm:flex-row gap-2 mb-5">
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
                  className="flex-1 min-w-0 rounded-md px-4 py-3 outline-none border font-mono"
                  style={{ background: "#000", color: "#fff", borderColor: "#fff" }}
                />
                <button
                  type="button"
                  onClick={() => submitQuestion(demoInput)}
                  className="w-full sm:w-auto shrink-0 px-4 py-3 rounded-md font-semibold"
                  style={{ background: "#fff", color: "#000" }}
                >
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

      <style jsx>{`
        .hero-office-scene::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14), transparent 35%, transparent 65%, rgba(255,255,255,0.08));
          pointer-events: none;
        }
        .hero-agent {
          animation: officeAgentFloat 6s ease-in-out infinite;
        }
        .hero-agent-1 {
          animation-delay: 0s;
        }
        .hero-agent-2 {
          animation-delay: 1.3s;
        }
        .hero-agent-3 {
          animation-delay: 2.6s;
        }
        .hero-station {
          animation: stationPulse 4.8s ease-in-out infinite;
        }
        .hero-station-dot {
          animation: stationGlow 2.4s ease-in-out infinite;
        }
        .hero-task-card {
          animation: taskBlink 4.2s ease-in-out infinite;
        }
        @keyframes officeAgentFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          25% { transform: translate3d(10px, -6px, 0); }
          50% { transform: translate3d(18px, 4px, 0); }
          75% { transform: translate3d(6px, 10px, 0); }
        }
        @keyframes stationPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 1px rgba(0,0,0,0.04), 0 16px 30px rgba(0,0,0,0.05); }
          50% { transform: scale(1.025); box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 20px 36px rgba(0,0,0,0.08); }
        }
        @keyframes stationGlow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.35); }
        }
        @keyframes taskBlink {
          0%, 100% { transform: translateY(0); opacity: 0.72; }
          20% { opacity: 1; }
          50% { transform: translateY(-4px); opacity: 1; }
          80% { opacity: 0.8; }
        }
      `}</style>

      <footer className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm flex-wrap gap-4" style={{ color: "var(--hontley-muted)" }}>
        <span className="font-medium" style={{ color: "var(--hontley-black)" }}>Hontley</span>
        <span>© {new Date().getFullYear()} Hontley. Todos los derechos reservados.</span>
        <a href={BOOKING_URL} className="hover:underline">{CONTACT_LABEL}</a>
      </footer>
    </main>
  );
}
