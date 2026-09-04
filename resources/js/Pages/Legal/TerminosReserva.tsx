import RootLayout from '@/Layouts/RootLayout';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

export default function TerminosReserva({ meta }: Props) {
  return (
    <RootLayout meta={meta}>
      
      {/* ── Header Oscuro ── */}
      <div className="pt-32 pb-24 px-6 md:px-10 bg-void text-bone">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="font-display font-black text-4xl md:text-5xl tracking-tighter">Términos de Reserva</h1>
          <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full" />
          <p className="text-ash text-sm md:text-base">Condiciones generales aplicables a las citas en Luni Styles.</p>
        </div>
      </div>

      {/* ── Contenido Claro ── */}
      <div className="py-16 md:py-24 px-6 md:px-10 bg-[#f8fafc] text-slate-800 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-10">
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">1. Confirmación de cita</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Al solicitar una reserva a través de nuestra web, usted recibirá un correo electrónico de confirmación. La cita no se considerará formalizada hasta recibir dicho correo. Es responsabilidad del cliente revisar la fecha y hora.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">2. Política de Cancelación</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Entendemos que pueden surgir imprevistos. Le rogamos que cancele o modifique su cita con al menos 24 horas de antelación. Las cancelaciones repetidas en un plazo inferior a 24 horas podrán conllevar el requerimiento de un pago anticipado para futuras reservas.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">3. Puntualidad</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Rogamos máxima puntualidad para no retrasar el servicio de los clientes posteriores. Si se retrasa más de 10 minutos, Luni Styles se reserva el derecho de cancelar la cita o adaptar el servicio al tiempo restante disponible.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">4. Pagos y Bizum</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                El pago de los servicios se realiza en el local una vez finalizado el mismo. Aceptamos pagos en efectivo, tarjeta de crédito/débito y a través de Bizum a los números facilitados en recepción.
              </p>
            </section>

          </div>
        </div>
      </div>

    </RootLayout>
  );
}
