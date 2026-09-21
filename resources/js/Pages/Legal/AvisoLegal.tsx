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

export default function AvisoLegal({ meta }: Props) {
  return (
    <RootLayout meta={meta}>

      {/* ── Header ── */}
      <div className="pt-28 md:pt-36 pb-16 md:pb-24 px-6 md:px-10 bg-void text-bone">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-amber-400 text-[10px] tracking-[0.3em] uppercase font-bold">Luni Styles</p>
          <h1 className="font-display font-black text-4xl md:text-6xl tracking-tighter">Aviso Legal</h1>
          <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full" />
          <p className="text-ash text-sm md:text-base max-w-xl mx-auto">
            Información general en cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE).
          </p>
          <p className="text-steel text-xs">Última actualización: septiembre de 2026</p>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div className="py-12 md:py-20 px-4 md:px-10 bg-[#f8fafc] text-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-10">

            <Section number="1" title="Datos Identificativos del Titular">
              <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se informa al usuario de los siguientes datos identificativos del titular de la presente página web:</p>
              <ul className="list-none space-y-2 mt-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <li><strong>Titular / Responsable:</strong> Mariely Ericeida Farías Velasquez</li>
                <li><strong>NIF:</strong> Z2550383X</li>
                <li><strong>Nombre comercial:</strong> Luni Styles</li>
                <li><strong>Actividad:</strong> Peluquería y Barbería (CNAE 9602)</li>
                <li><strong>Domicilio social:</strong> C. Pedro Hernández Guillamón "El Peseta", 5, 30820 Alcantarilla, Murcia, España</li>
                <li><strong>Correo electrónico de contacto:</strong> contacto@lunistyles.com</li>
                <li><strong>Teléfono Barbería:</strong> +34 623 59 98 90</li>
                <li><strong>Teléfono Peluquería Infantil:</strong> +34 675 37 28 13</li>
                <li><strong>Instagram:</strong> @luni_styles</li>
                <li><strong>TikTok:</strong> @luni_styles</li>
                <li><strong>Web:</strong> https://luni-styles-production.up.railway.app</li>
              </ul>
            </Section>

            <Section number="2" title="Objeto y Ámbito de Aplicación">
              <p>El presente Aviso Legal regula el acceso y uso del sitio web de Luni Styles (en adelante, "el Sitio Web"), así como los servicios y contenidos puestos a disposición del usuario.</p>
              <p>El acceso y/o uso del Sitio Web implica la aceptación plena y sin reservas de todas y cada una de las condiciones establecidas en el presente Aviso Legal. Si el usuario no está de acuerdo con las condiciones establecidas, deberá abstenerse de acceder y/o utilizar el Sitio Web.</p>
              <p>Luni Styles se reserva el derecho a modificar el presente Aviso Legal en cualquier momento, siendo responsabilidad del usuario consultarlo periódicamente. Los cambios entrarán en vigor desde el momento de su publicación en el Sitio Web.</p>
            </Section>

            <Section number="3" title="Propiedad Intelectual e Industrial">
              <p>Todos los contenidos del Sitio Web, incluidos pero no limitados a textos, fotografías, gráficos, imágenes, iconos, tecnología, software, links y demás contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente, son propiedad intelectual de Luni Styles o de terceros, y están protegidos por la normativa española e internacional de Propiedad Intelectual e Industrial.</p>
              <p>Queda expresamente prohibida la reproducción, distribución, comunicación pública, transformación y, en general, cualquier otra forma de explotación del contenido del Sitio Web sin la autorización expresa y por escrito de Luni Styles.</p>
              <p>El usuario se compromete a respetar los derechos de Propiedad Intelectual e Industrial de Luni Styles. La visualización y descarga de los contenidos del Sitio Web está autorizada exclusivamente para uso personal y privado, sin ánimo de lucro.</p>
            </Section>

            <Section number="4" title="Condiciones de Uso del Sitio Web">
              <p>El usuario se compromete a usar el Sitio Web y sus contenidos de conformidad con la ley, el presente Aviso Legal, las buenas costumbres y el orden público. Con carácter enunciativo y no limitativo, el usuario se compromete a:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>No utilizar el Sitio Web con fines ilícitos, ilegales o contrarios a lo establecido en el presente Aviso Legal.</li>
                <li>No difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico, de apología del terrorismo o atentatorio contra los derechos humanos.</li>
                <li>No introducir o difundir virus informáticos o cualesquiera otros sistemas físicos o lógicos que sean susceptibles de provocar daños en los sistemas informáticos de Luni Styles, sus proveedores o terceros.</li>
                <li>No intentar acceder, utilizar y/o manipular los datos de Luni Styles, terceros proveedores y otros usuarios.</li>
                <li>No reproducir, copiar, distribuir, transformar o modificar los contenidos, a menos que se cuente con la autorización del titular de los correspondientes derechos.</li>
              </ul>
            </Section>

            <Section number="5" title="Exclusión de Garantías y Responsabilidad">
              <p>Luni Styles no garantiza la disponibilidad y continuidad del funcionamiento del Sitio Web. Cuando ello sea razonablemente posible, Luni Styles advertirá previamente de las interrupciones en el funcionamiento del mismo.</p>
              <p>Luni Styles tampoco garantiza la utilidad del Sitio Web o de sus contenidos para la realización de ninguna actividad en concreto, ni su infalibilidad. Luni Styles excluye, hasta donde permite el ordenamiento jurídico, cualquier responsabilidad por los daños y perjuicios de cualquier naturaleza derivados de:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>La falta de disponibilidad o accesibilidad al Sitio Web.</li>
                <li>La interrupción en el funcionamiento del Sitio Web o fallos informáticos, averías telefónicas, desconexiones, retrasos o bloqueos causados por deficiencias o sobrecargas en las líneas telefónicas, Internet o en otros sistemas electrónicos.</li>
                <li>Otros daños que puedan ser causados por terceros mediante intromisiones no autorizadas ajenas al control de Luni Styles.</li>
                <li>La inexactitud o falta de actualización de los contenidos del Sitio Web.</li>
              </ul>
            </Section>

            <Section number="6" title="Hiperenlaces y Sitios Web de Terceros">
              <p>El Sitio Web puede contener hiperenlaces a otras páginas web (redes sociales, plataformas de pago, etc.) que son gestionadas por terceros y están fuera del control de Luni Styles. Dichos enlaces se facilitan exclusivamente a efectos informativos.</p>
              <p>Luni Styles no asume responsabilidad alguna derivada de la conexión o los contenidos de dichas páginas de terceros, ni garantiza la disponibilidad técnica, calidad, fiabilidad, exactitud, amplitud, veracidad, validez y constitucionalidad de cualquier material o información contenida en dichos sitios.</p>
              <p>La inclusión de estas conexiones externas no implica ningún tipo de asociación, fusión o participación con las entidades conectadas.</p>
            </Section>

            <Section number="7" title="Política de Privacidad y Cookies">
              <p>El tratamiento de los datos personales de los usuarios del Sitio Web se rige por lo establecido en la <a href="/politica-privacidad" className="text-amber-600 underline">Política de Privacidad</a> y en la <a href="/politica-cookies" className="text-amber-600 underline">Política de Cookies</a>, que forman parte integrante del presente Aviso Legal.</p>
            </Section>

            <Section number="8" title="Legislación Aplicable y Jurisdicción">
              <p>Las relaciones entre Luni Styles y el usuario se rigen en todo momento por la legislación española vigente y, en particular, por:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).</li>
                <li>Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD).</li>
                <li>Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</li>
                <li>Real Decreto Legislativo 1/2007, de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios (TRLGDCU).</li>
                <li>Ley 7/1998, de 13 de abril, sobre Condiciones Generales de la Contratación.</li>
              </ul>
              <p>Para la resolución de cualquier controversia derivada del acceso o uso del Sitio Web, Luni Styles y el usuario acuerdan someterse, con renuncia expresa a cualquier otro fuero que pudiera corresponderles, a la jurisdicción de los Juzgados y Tribunales de Murcia (España), salvo que la normativa aplicable establezca otro fuero de competencia obligatorio.</p>
            </Section>

            <Section number="9" title="Nulidad e Ineficacia de las Cláusulas">
              <p>Si cualquier cláusula incluida en el presente Aviso Legal fuese declarada, total o parcialmente, nula o ineficaz, dicha nulidad o ineficacia afectará tan solo a dicha disposición o la parte de la misma que resulte nula o ineficaz, subsistiendo el presente Aviso Legal en todo lo demás.</p>
            </Section>

            <div className="border-t border-slate-100 pt-6 text-xs text-slate-400 text-center">
              Aviso Legal de Luni Styles · C. Pedro Hernández Guillamón "El Peseta", 5, 30820 Alcantarilla, Murcia · contacto@lunistyles.com
            </div>

          </div>
        </div>
      </div>

    </RootLayout>
  );
}
