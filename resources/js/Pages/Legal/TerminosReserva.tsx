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

export default function TerminosReserva({ meta }: Props) {
  return (
    <RootLayout meta={meta}>

      {/* ── Header ── */}
      <div className="pt-28 md:pt-36 pb-16 md:pb-24 px-6 md:px-10 bg-void text-bone">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-amber-400 text-[10px] tracking-[0.3em] uppercase font-bold">Luni Styles</p>
          <h1 className="font-display font-black text-4xl md:text-6xl tracking-tighter">Términos y Condiciones de Reserva</h1>
          <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full" />
          <p className="text-ash text-sm md:text-base max-w-xl mx-auto">
            Condiciones aplicables a las reservas de cita realizadas a través de este sitio web.
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
              <strong>Aviso:</strong> Al formalizar una reserva de cita a través de este sitio web, el usuario declara haber leído, entendido y aceptado las presentes condiciones en su totalidad.
            </div>

            <Section number="1" title="Identificación del Prestador del Servicio">
              <p>Los presentes Términos y Condiciones de Reserva son aplicables a las reservas de cita realizadas a través del sitio web de <strong>Luni Styles</strong>, cuya titular es Mariely Ericeida Farías Velasquez, con domicilio en C. Pedro Hernández Guillamón "El Peseta", 5, 30820 Alcantarilla, Murcia (España), y correo electrónico de contacto: contacto@lunistyles.com.</p>
            </Section>

            <Section number="2" title="Objeto">
              <p>Luni Styles ofrece un servicio de reserva de cita previa a través del formulario habilitado en este sitio web. Dicho formulario permite al usuario seleccionar el servicio deseado, la fecha y hora disponibles, así como facilitar sus datos de contacto para la confirmación de la cita.</p>
              <p>Los servicios actualmente disponibles para reserva son:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="font-bold text-slate-900 mb-2">✂️ Barbería</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Corte Normal (lavado + cejas) – 30 min – 12€</li>
                    <li>Corte + Barba – 45–60 min – 15€</li>
                    <li>Solo Barba – 15–30 min – 4€</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="font-bold text-slate-900 mb-2">👶 Peluquería Infantil</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Corte Infantil – 30–60 min – Precio a consultar</li>
                    <li>Peinados – 30–60 min – Precio a consultar</li>
                    <li>Accesorios – 15–30 min – Precio a consultar</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Los precios indicados pueden estar sujetos a modificaciones. El precio definitivo se confirmará en el establecimiento en el momento de la prestación del servicio.</p>
            </Section>

            <Section number="3" title="Proceso de Reserva y Confirmación">
              <p>El proceso de reserva se realiza exclusivamente a través del formulario habilitado en el sitio web y consta de los siguientes pasos:</p>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Selección del tipo de servicio:</strong> el usuario elige entre Barbería o Peluquería Infantil.</li>
                <li><strong>Elección del servicio concreto:</strong> el usuario selecciona el tratamiento deseado.</li>
                <li><strong>Selección de fecha y hora:</strong> el usuario elige la franja horaria disponible de su preferencia.</li>
                <li><strong>Datos personales de contacto:</strong> el usuario facilita su nombre completo y número de teléfono.</li>
                <li><strong>Selección del método de pago:</strong> el usuario elige entre efectivo (Peluquería Infantil) o efectivo/Bizum (Barbería) en el establecimiento.</li>
                <li><strong>Confirmación:</strong> el usuario revisa los datos de la reserva y la confirma.</li>
              </ol>
              <p>Una vez enviado el formulario, Luni Styles procederá a contactar con el usuario a través del número de teléfono facilitado para confirmar la disponibilidad y la cita. La reserva <strong>no se considerará definitivamente confirmada</strong> hasta que el usuario reciba comunicación expresa de confirmación por parte de Luni Styles.</p>
            </Section>

            <Section number="4" title="Política de Cancelación y Modificación">
              <p>El usuario tiene derecho a cancelar o modificar su reserva en las siguientes condiciones:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Cancelación con más de 24 horas de antelación:</strong> cancelación completamente gratuita y sin ningún cargo.</li>
                <li><strong>Cancelación con menos de 24 horas de antelación:</strong> Luni Styles se reserva el derecho de aplicar un cargo por el tiempo reservado o, alternativamente, requerir el pago anticipado en futuras reservas, especialmente en caso de cancelaciones repetidas. No obstante, se valorará cada situación individualmente.</li>
                <li><strong>No presentación a la cita (no-show):</strong> en caso de no acudir a la cita sin previo aviso, Luni Styles podrá condicionar futuras reservas al pago anticipado o denegarse a tramitar nuevas reservas online.</li>
              </ul>
              <p>Para cancelar o modificar una reserva, el usuario debe ponerse en contacto con Luni Styles con la mayor antelación posible a través de:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Teléfono Barbería: <strong>+34 623 59 98 90</strong></li>
                <li>Teléfono Peluquería Infantil: <strong>+34 675 37 28 13</strong></li>
                <li>Correo: <strong>contacto@lunistyles.com</strong></li>
                <li>Redes sociales: <strong>@luni_styles</strong></li>
              </ul>
            </Section>

            <Section number="5" title="Pago de los Servicios">
              <p>El pago de los servicios de Luni Styles se realiza <strong>en el momento de la prestación del servicio en el establecimiento físico</strong>, no se realizan cobros anticipados a través de la web (salvo indicación expresa en contrario por parte de Luni Styles). Los métodos de pago aceptados actualmente son:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Efectivo</strong> (para todos los servicios)</li>
                <li><strong>Bizum</strong> (actualmente solo para Barbería, próximamente en Peluquería Infantil)</li>
              </ul>
              <p>Los precios indicados en el sitio web incluyen el IVA correspondiente según la legislación vigente. Luni Styles se reserva el derecho de modificar los precios de sus servicios en cualquier momento, sin perjuicio de lo acordado para reservas ya confirmadas.</p>
              <p>En el futuro podrá habilitarse el pago online con tarjeta de crédito o débito. Cualquier nuevo método de pago será comunicado a través del sitio web.</p>
            </Section>

            <Section number="6" title="Menores de Edad">
              <p>Los servicios de Peluquería Infantil están destinados a menores de edad. En estos casos, la reserva deberá ser realizada por un padre, madre o tutor legal del menor, quien asumirá la responsabilidad plena sobre la solicitud y los datos facilitados.</p>
              <p>Luni Styles no podrá prestar servicios a menores de edad que acudan al establecimiento sin la compañía o autorización expresa de un adulto responsable.</p>
            </Section>

            <Section number="7" title="Responsabilidad de Luni Styles">
              <p>Luni Styles se compromete a prestar los servicios reservados con la máxima diligencia y profesionalidad. No obstante, Luni Styles no será responsable de los daños derivados de:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Información incorrecta o incompleta facilitada por el usuario en el formulario de reserva.</li>
                <li>Causas de fuerza mayor o circunstancias imprevisibles que impidan la prestación del servicio en la fecha acordada (en cuyo caso, Luni Styles ofrecerá una fecha alternativa).</li>
                <li>Reacciones o alergias del cliente a productos o técnicas utilizadas, siempre que el cliente no haya informado previamente de dichas condiciones al equipo de Luni Styles.</li>
              </ul>
              <p>Luni Styles adoptará todas las medidas de higiene y seguridad exigidas por la normativa aplicable a los establecimientos de peluquería y barbería.</p>
            </Section>

            <Section number="8" title="Tratamiento de Datos Personales">
              <p>Los datos personales facilitados durante el proceso de reserva serán tratados por Luni Styles de conformidad con lo establecido en la <a href="/politica-privacidad" className="text-amber-600 underline">Política de Privacidad</a>. El usuario consiente expresamente dicho tratamiento al formalizar la reserva.</p>
              <p>Los datos recabados serán utilizados exclusivamente para la gestión de la cita reservada y para comunicaciones relacionadas con la misma. No serán cedidos a terceros salvo los supuestos previstos en la Política de Privacidad.</p>
            </Section>

            <Section number="9" title="Disponibilidad del Servicio y Fuerza Mayor">
              <p>Luni Styles se reserva el derecho de cancelar o reprogramar una cita por causas justificadas, incluyendo:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Enfermedad o incapacidad sobrevenida del profesional asignado.</li>
                <li>Festivos locales, nacionales o autonómicos no previstos.</li>
                <li>Causas de fuerza mayor (inundaciones, cortes de suministro, etc.).</li>
                <li>Otras circunstancias excepcionales debidamente justificadas.</li>
              </ul>
              <p>En estos casos, Luni Styles contactará con el usuario con la máxima antelación posible para reprogramar la cita, sin cargo alguno para el usuario.</p>
            </Section>

            <Section number="10" title="Modificaciones de los Términos">
              <p>Luni Styles se reserva el derecho de modificar los presentes Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el sitio web. Se recomienda al usuario revisar periódicamente los presentes Términos. Las reservas realizadas antes de una modificación se regirán por los Términos vigentes en el momento de su formalización.</p>
            </Section>

            <Section number="11" title="Reclamaciones">
              <p>El usuario puede presentar cualquier reclamación relacionada con los servicios prestados por Luni Styles a través de los siguientes canales:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Correo electrónico:</strong> contacto@lunistyles.com</li>
                <li><strong>Presencialmente</strong> en el establecimiento: C. Pedro Hernández Guillamón "El Peseta", 5, 30820 Alcantarilla, Murcia.</li>
              </ul>
              <p>El establecimiento dispone de hojas de reclamaciones a disposición de los consumidores, conforme a la normativa autonómica de la Región de Murcia.</p>
              <p>El usuario también puede dirigirse a las Oficinas de Información al Consumidor (OMIC) de su municipio o a la Plataforma Europea de Resolución de Litigios en Línea (ODR): <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">https://ec.europa.eu/consumers/odr/</a>.</p>
            </Section>

            <Section number="12" title="Legislación Aplicable y Jurisdicción">
              <p>Los presentes Términos y Condiciones se rigen por la legislación española vigente, incluyendo, entre otras:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Real Decreto Legislativo 1/2007 (Ley General para la Defensa de los Consumidores y Usuarios).</li>
                <li>Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI-CE).</li>
                <li>Reglamento (UE) 2016/679 de Protección de Datos (RGPD).</li>
                <li>Ley Orgánica 3/2018 (LOPDGDD).</li>
              </ul>
              <p>Para la resolución de cualquier controversia, las partes se someten a la jurisdicción de los Juzgados y Tribunales de Murcia (España), sin perjuicio del fuero que pudiera corresponder al consumidor conforme a la normativa de protección al consumidor.</p>
            </Section>

            <div className="border-t border-slate-100 pt-6 text-xs text-slate-400 text-center">
              Términos de Reserva de Luni Styles · C. Pedro Hernández Guillamón "El Peseta", 5, 30820 Alcantarilla, Murcia · contacto@lunistyles.com
            </div>

          </div>
        </div>
      </div>

    </RootLayout>
  );
}
