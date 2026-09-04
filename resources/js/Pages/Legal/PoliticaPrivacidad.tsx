import RootLayout from '@/Layouts/RootLayout';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

export default function PoliticaPrivacidad({ meta }: Props) {
  return (
    <RootLayout meta={meta}>
      
      {/* ── Header Oscuro ── */}
      <div className="pt-32 pb-24 px-6 md:px-10 bg-void text-bone">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="font-display font-black text-4xl md:text-5xl tracking-tighter">Política de Privacidad</h1>
          <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full" />
          <p className="text-ash text-sm md:text-base">Tratamiento y protección de sus datos personales (RGPD).</p>
        </div>
      </div>

      {/* ── Contenido Claro ── */}
      <div className="py-16 md:py-24 px-6 md:px-10 bg-[#f8fafc] text-slate-800 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-10">
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">1. Responsable del Tratamiento</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                El responsable del tratamiento de los datos recabados por medio de este sitio web es Luni Styles S.L. Puede contactarnos en cualquier momento enviando un correo a privacidad@lunistyles.com.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">2. Finalidad del Tratamiento</h2>
              <ul className="list-disc list-inside text-slate-600 space-y-2 text-sm md:text-base">
                <li>Gestionar las reservas solicitadas a través del formulario (Booking Modal).</li>
                <li>Atender dudas y consultas recibidas en el formulario de contacto.</li>
                <li>Enviar confirmaciones y recordatorios de citas por email o SMS.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">3. Legitimación y Conservación</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                La base legal para el tratamiento de sus datos es el consentimiento explícito que otorga al aceptar esta política en los formularios de reserva y contacto. Los datos se conservarán mientras exista un interés mutuo o durante los años necesarios para cumplir con las obligaciones legales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">4. Derechos del Usuario</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Usted tiene derecho a obtener confirmación sobre si estamos tratando sus datos personales. Tiene derecho a acceder a sus datos personales, rectificar los datos inexactos o solicitar su supresión cuando los datos ya no sean necesarios. Podrá ejercer sus derechos dirigiendo un escrito a la dirección de correo electrónico facilitada.
              </p>
            </section>

          </div>
        </div>
      </div>

    </RootLayout>
  );
}
