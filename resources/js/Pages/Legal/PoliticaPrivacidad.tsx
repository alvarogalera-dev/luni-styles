import RootLayout from '@/Layouts/RootLayout';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

const Section = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <section className="space-y-4">
    <h2 className="text-xl md:text-2xl font-bold text-slate-900 border-l-4 border-amber-400 pl-4">
      {number}. {title}
    </h2>
    <div className="text-slate-600 leading-relaxed text-sm md:text-base space-y-3 pl-0 md:pl-2">
      {children}
    </div>
  </section>
);

export default function PoliticaPrivacidad({ meta }: Props) {
  return (
    <RootLayout meta={meta}>

      {/* ── Header ── */}
      <div className="pt-28 md:pt-36 pb-16 md:pb-24 px-6 md:px-10 bg-void text-bone">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-amber-400 text-[10px] tracking-[0.3em] uppercase font-bold">Luni Styles</p>
          <h1 className="font-display font-black text-4xl md:text-6xl tracking-tighter">Política de Privacidad</h1>
          <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full" />
          <p className="text-ash text-sm md:text-base max-w-xl mx-auto">
            En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
          </p>
          <p className="text-steel text-xs">Última actualización: septiembre de 2026</p>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div className="py-12 md:py-20 px-4 md:px-10 bg-[#f8fafc] text-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-10">

            {/* Intro */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900">
              <strong>Aviso importante:</strong> Al utilizar nuestra web y/o formalizar una reserva a través de los formularios habilitados, el usuario consiente expresamente el tratamiento de sus datos personales conforme a la presente Política de Privacidad.
            </div>

            <Section number="1" title="Responsable del Tratamiento">
              <p>En cumplimiento del artículo 13 del RGPD, se facilitan los datos del responsable del tratamiento:</p>
              <ul className="list-none space-y-1 mt-2">
                <li><strong>Titular:</strong> Mariely Ericeida Farías Velasquez</li>
                <li><strong>Actividad:</strong> Peluquería y Barbería · Luni Styles</li>
                <li><strong>Domicilio:</strong> C. Pedro Hernández Guillamón "El Peseta", 5, 30820 Alcantarilla, Murcia</li>
                <li><strong>Correo electrónico:</strong> contacto@lunistyles.com</li>
                <li><strong>Teléfono Barbería:</strong> +34 623 59 98 90</li>
                <li><strong>Teléfono Peluquería Infantil:</strong> +34 675 37 28 13</li>
                <li><strong>Web:</strong> https://luni-styles-production.up.railway.app</li>
              </ul>
            </Section>

            <Section number="2" title="Datos que recopilamos y cómo los obtenemos">
              <p>Luni Styles recaba únicamente los datos estrictamente necesarios para prestar el servicio solicitado. Los datos se obtienen a través de:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Formulario de reserva (Booking Modal):</strong> nombre, número de teléfono, servicio solicitado, fecha y hora de la cita, y método de pago seleccionado.</li>
                <li><strong>Formulario de contacto:</strong> nombre, número de teléfono y mensaje.</li>
                <li><strong>Navegación en la web:</strong> datos de sesión a través de cookies técnicas (ver Política de Cookies).</li>
              </ul>
              <p className="mt-2">No se recaban datos especiales (salud, religión, origen étnico, etc.) ni datos de menores de 14 años sin consentimiento de sus tutores legales.</p>
            </Section>

            <Section number="3" title="Finalidad y base jurídica del tratamiento">
              <p>Los datos personales facilitados serán tratados con las siguientes finalidades y bases legales:</p>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-xs md:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="border border-slate-200 px-3 py-2 text-left font-semibold">Finalidad</th>
                      <th className="border border-slate-200 px-3 py-2 text-left font-semibold">Base jurídica</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 px-3 py-2">Gestión y confirmación de reservas de citas</td>
                      <td className="border border-slate-200 px-3 py-2">Ejecución de una relación precontractual / contractual (Art. 6.1.b RGPD)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="border border-slate-200 px-3 py-2">Envío de recordatorio de cita y comunicaciones relativas al servicio reservado</td>
                      <td className="border border-slate-200 px-3 py-2">Interés legítimo del responsable (Art. 6.1.f RGPD)</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-3 py-2">Atención de consultas y solicitudes recibidas por el formulario de contacto</td>
                      <td className="border border-slate-200 px-3 py-2">Consentimiento del interesado (Art. 6.1.a RGPD)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="border border-slate-200 px-3 py-2">Cumplimiento de obligaciones legales y fiscales</td>
                      <td className="border border-slate-200 px-3 py-2">Obligación legal (Art. 6.1.c RGPD)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section number="4" title="Plazo de conservación de los datos">
              <p>Los datos personales serán conservados durante los siguientes plazos:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Datos de reserva:</strong> durante el tiempo necesario para gestionar la cita y, posteriormente, durante el plazo de prescripción de las acciones legales aplicables (mínimo 5 años), en cumplimiento del artículo 30 del Código de Comercio y la normativa fiscal.</li>
                <li><strong>Datos de contacto:</strong> hasta que el usuario solicite su supresión o hayan transcurrido 12 meses desde el último contacto.</li>
                <li><strong>Datos de navegación (cookies técnicas):</strong> según se detalla en la Política de Cookies.</li>
              </ul>
              <p>Transcurridos los plazos indicados, los datos serán eliminados de forma segura o anonimizados.</p>
            </Section>

            <Section number="5" title="Destinatarios y cesiones a terceros">
              <p>Con carácter general, Luni Styles <strong>no cede ni comunica datos personales a terceros</strong> sin consentimiento previo, salvo en los siguientes supuestos:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Obligación legal:</strong> cuando sea requerido por las autoridades competentes, administraciones públicas o juzgados.</li>
                <li><strong>Encargados del tratamiento:</strong> proveedores tecnológicos que prestan servicios necesarios para el funcionamiento de la web (hosting, servidor de correo), que están obligados contractualmente a mantener la confidencialidad y actuar solo según instrucciones del responsable. Actualmente:
                  <ul className="list-disc list-inside ml-4 space-y-1 mt-1">
                    <li>Railway (hosting): ubicado en EEUU, con garantías adecuadas conforme al marco RGPD.</li>
                  </ul>
                </li>
              </ul>
              <p>No se realizan transferencias internacionales de datos personales fuera del Espacio Económico Europeo salvo las indicadas anteriormente, que cuentan con las garantías adecuadas.</p>
            </Section>

            <Section number="6" title="Derechos de los interesados">
              <p>De conformidad con el RGPD y la LOPDGDD, usted puede ejercer en cualquier momento los siguientes derechos:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Acceso:</strong> conocer qué datos tenemos sobre usted.</li>
                <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                <li><strong>Supresión ("derecho al olvido"):</strong> solicitar que eliminemos sus datos cuando ya no sean necesarios.</li>
                <li><strong>Limitación del tratamiento:</strong> solicitar que suspendamos el tratamiento de sus datos en determinadas circunstancias.</li>
                <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado y legible por máquina.</li>
                <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos basado en interés legítimo.</li>
                <li><strong>Retirada del consentimiento:</strong> en los casos en que el tratamiento se base en el consentimiento, podrá retirarlo en cualquier momento sin que ello afecte a la licitud del tratamiento previo.</li>
              </ul>
              <p className="mt-3">Para ejercer cualquiera de estos derechos, envíe un correo a <strong>contacto@lunistyles.com</strong> indicando su nombre, el derecho que desea ejercer y, si es posible, una copia de su documento identificativo. Atenderemos su solicitud en el plazo máximo de un mes desde su recepción.</p>
              <p>Si considera que sus derechos no han sido debidamente atendidos, tiene derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong>, calle Jorge Juan, 6, 28001 Madrid, o a través de su sede electrónica: <a href="https://www.aepd.es" className="text-amber-600 underline" target="_blank" rel="noopener noreferrer">www.aepd.es</a>.</p>
            </Section>

            <Section number="7" title="Medidas de seguridad">
              <p>Luni Styles adopta las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado. Entre otras:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Conexión cifrada mediante protocolo HTTPS (TLS).</li>
                <li>Acceso restringido a los datos mediante credenciales seguras.</li>
                <li>Entornos de alojamiento web con medidas de seguridad certificadas.</li>
                <li>Política de actualización periódica de contraseñas y sistemas.</li>
              </ul>
              <p>No obstante, el usuario debe ser consciente de que las medidas de seguridad en Internet no son inexpugnables.</p>
            </Section>

            <Section number="8" title="Datos de menores de edad">
              <p>Nuestros servicios de peluquería infantil están dirigidos a menores de edad como clientes del servicio, pero el tratamiento de datos personales a través de la web (reservas, contacto) es realizado por sus padres, madres o tutores legales, quienes asumen la responsabilidad de haber facilitado datos verídicos y de contar con la capacidad legal necesaria para hacerlo.</p>
              <p>Luni Styles no recopila conscientemente datos personales directamente de menores de 14 años. Si un menor hubiera facilitado datos sin el consentimiento de sus tutores legales, rogamos lo notifiquen a contacto@lunistyles.com para proceder a su eliminación.</p>
            </Section>

            <Section number="9" title="Cambios en la Política de Privacidad">
              <p>Luni Styles se reserva el derecho de modificar la presente Política de Privacidad para adaptarla a novedades legislativas o jurisprudenciales, así como a cambios en su actividad empresarial. Cualquier modificación será publicada en esta misma página con indicación de la fecha de actualización.</p>
              <p>Se recomienda al usuario revisar periódicamente esta política. El uso continuado de la web o de los servicios tras la publicación de cambios implica la aceptación de los mismos.</p>
            </Section>

            <div className="border-t border-slate-100 pt-6 text-xs text-slate-400 text-center">
              Política de Privacidad de Luni Styles · C. Pedro Hernández Guillamón "El Peseta", 5, 30820 Alcantarilla, Murcia · contacto@lunistyles.com
            </div>

          </div>
        </div>
      </div>

    </RootLayout>
  );
}
