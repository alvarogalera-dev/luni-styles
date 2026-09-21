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

const CookieRow = ({ name, type, purpose, duration }: { name: string; type: string; purpose: string; duration: string }) => (
  <tr className="even:bg-slate-50">
    <td className="border border-slate-200 px-3 py-2 font-mono text-xs font-semibold text-amber-700">{name}</td>
    <td className="border border-slate-200 px-3 py-2 text-xs">{type}</td>
    <td className="border border-slate-200 px-3 py-2 text-xs">{purpose}</td>
    <td className="border border-slate-200 px-3 py-2 text-xs">{duration}</td>
  </tr>
);

export default function PoliticaCookies({ meta }: Props) {
  return (
    <RootLayout meta={meta}>

      {/* ── Header ── */}
      <div className="pt-28 md:pt-36 pb-16 md:pb-24 px-6 md:px-10 bg-void text-bone">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-amber-400 text-[10px] tracking-[0.3em] uppercase font-bold">Luni Styles</p>
          <h1 className="font-display font-black text-4xl md:text-6xl tracking-tighter">Política de Cookies</h1>
          <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full" />
          <p className="text-ash text-sm md:text-base max-w-xl mx-auto">
            En cumplimiento del artículo 22.2 de la Ley 34/2002 (LSSI) y el artículo 5 de la Directiva ePrivacy (2002/58/CE).
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
              <strong>Importante:</strong> Al acceder a nuestra web, mostramos un aviso de cookies. Si pulsa "Aceptar", consiente el uso de las cookies descritas a continuación. Puede revocar su consentimiento o cambiar su configuración en cualquier momento.
            </div>

            <Section number="1" title="¿Qué son las cookies?">
              <p>Las cookies son pequeños ficheros de datos que se instalan en el equipo terminal del usuario (ordenador, smartphone, tablet, etc.) cuando accede a determinadas páginas web. Su finalidad principal es reconocer al usuario entre distintas visitas, facilitar la navegación y mejorar la experiencia del usuario.</p>
              <p>Las cookies son absolutamente seguras: no pueden ejecutar código malicioso, no introducen virus en el equipo del usuario y no acceden a datos personales del dispositivo más allá de lo que el usuario facilite voluntariamente al navegar.</p>
            </Section>

            <Section number="2" title="Tipos de cookies según su finalidad">
              <ul className="space-y-4 mt-2">
                <li>
                  <strong className="block text-slate-900">🔒 Cookies técnicas o estrictamente necesarias</strong>
                  <p>Imprescindibles para el correcto funcionamiento del sitio web. Sin ellas, servicios como el formulario de reserva o la navegación segura no funcionarían. No requieren consentimiento del usuario.</p>
                </li>
                <li>
                  <strong className="block text-slate-900">⚙️ Cookies de preferencias o personalización</strong>
                  <p>Permiten recordar información que cambia el aspecto o comportamiento de la web según las preferencias del usuario (p. ej., si ha aceptado o rechazado el banner de cookies).</p>
                </li>
                <li>
                  <strong className="block text-slate-900">📊 Cookies analíticas o de medición</strong>
                  <p>Permiten cuantificar el número de visitantes y analizar estadísticamente el uso de la web para mejorar los servicios ofrecidos. <strong>Actualmente, Luni Styles NO utiliza este tipo de cookies.</strong></p>
                </li>
                <li>
                  <strong className="block text-slate-900">📣 Cookies publicitarias o de marketing</strong>
                  <p>Gestionan los espacios publicitarios según el perfil del usuario. <strong>Actualmente, Luni Styles NO utiliza este tipo de cookies.</strong></p>
                </li>
                <li>
                  <strong className="block text-slate-900">🌐 Cookies de redes sociales</strong>
                  <p>Permiten integrar funcionalidades de redes sociales. En el caso de que el usuario acceda a nuestras redes sociales (Instagram, TikTok) desde nuestra web, esas plataformas podrán instalar sus propias cookies según sus políticas de privacidad, ajenas a Luni Styles.</p>
                </li>
              </ul>
            </Section>

            <Section number="3" title="Cookies utilizadas en este sitio web">
              <p>A continuación se detallan todas las cookies que se instalan en el dispositivo del usuario al navegar por el Sitio Web de Luni Styles:</p>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-xs md:text-sm border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="border border-slate-600 px-3 py-2 text-left font-semibold">Nombre</th>
                      <th className="border border-slate-600 px-3 py-2 text-left font-semibold">Tipo</th>
                      <th className="border border-slate-600 px-3 py-2 text-left font-semibold">Finalidad</th>
                      <th className="border border-slate-600 px-3 py-2 text-left font-semibold">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CookieRow
                      name="laravel_session"
                      type="Técnica / Propia"
                      purpose="Mantiene la sesión del usuario activa y segura durante la navegación. Es imprescindible para el funcionamiento del sitio web."
                      duration="Sesión del navegador (se elimina al cerrar)"
                    />
                    <CookieRow
                      name="XSRF-TOKEN"
                      type="Técnica / Seguridad"
                      purpose="Protege contra ataques CSRF (Cross-Site Request Forgery). Verifica que las peticiones al servidor provienen del propio sitio web y no de fuentes externas maliciosas."
                      duration="Sesión del navegador (se elimina al cerrar)"
                    />
                    <CookieRow
                      name="luni_cookie_consent"
                      type="Preferencias / Propia"
                      purpose="Almacena la decisión del usuario respecto al banner de cookies (aceptado o rechazado) para no volver a mostrárselo en visitas sucesivas."
                      duration="12 meses"
                    />
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                <strong>Nota:</strong> Las cookies marcadas como "Técnica" son estrictamente necesarias para el funcionamiento de la web y no requieren consentimiento del usuario conforme al artículo 22.2 de la LSSI. La cookie de preferencias se instala únicamente para recordar su elección respecto al consentimiento.
              </p>
            </Section>

            <Section number="4" title="Cookies de terceros">
              <p>Actualmente, el Sitio Web de Luni Styles <strong>no instala cookies de terceros</strong> (Google Analytics, Facebook Pixel, plataformas publicitarias, etc.).</p>
              <p>No obstante, al hacer clic en los iconos de redes sociales (Instagram, TikTok), el usuario será redirigido a los dominios de dichas plataformas, que disponen de sus propias políticas de cookies y privacidad, totalmente ajenas a Luni Styles:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><a href="https://privacycenter.instagram.com/policies/cookies/" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">Política de cookies de Instagram / Meta</a></li>
                <li><a href="https://www.tiktok.com/legal/page/eea/cookie-policy/es" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">Política de cookies de TikTok</a></li>
              </ul>
            </Section>

            <Section number="5" title="¿Cómo gestionar o desactivar las cookies?">
              <p>El usuario puede en todo momento aceptar, rechazar o revocar su consentimiento sobre las cookies a través del banner de cookies que aparece al acceder a nuestra web por primera vez.</p>
              <p>Adicionalmente, todos los navegadores modernos permiten configurar el almacenamiento de cookies. A continuación indicamos cómo hacerlo en los principales navegadores:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">Google Chrome</a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">Mozilla Firefox</a>
                </li>
                <li>
                  <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">Apple Safari</a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">Microsoft Edge</a>
                </li>
              </ul>
              <p className="mt-3">
                <strong>Importante:</strong> Si el usuario decide bloquear o desactivar las cookies técnicas, algunas partes del Sitio Web podrían no funcionar correctamente (como el formulario de reserva).
              </p>
            </Section>

            <Section number="6" title="Consentimiento y revocación">
              <p>El usuario otorga su consentimiento al uso de cookies (excepto las técnicas, que no lo requieren) al pulsar el botón "Aceptar" del banner de cookies. Dicha decisión se almacena en el equipo del usuario y tiene validez durante 12 meses.</p>
              <p>El usuario puede revocar su consentimiento o cambiar su decisión en cualquier momento:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Borrando las cookies desde la configuración del navegador.</li>
                <li>Eliminando la entrada <code className="bg-slate-100 px-1 rounded text-xs">luni_cookie_consent</code> del almacenamiento local de su navegador (en las herramientas de desarrollador).</li>
                <li>Enviando un correo a <strong>contacto@lunistyles.com</strong> si desea más información.</li>
              </ul>
              <p>La revocación del consentimiento no afectará a la licitud del tratamiento basado en el consentimiento previo a su retirada.</p>
            </Section>

            <Section number="7" title="Transferencias internacionales">
              <p>Las cookies propias de Luni Styles (<code className="bg-slate-100 px-1 rounded text-xs">laravel_session</code>, <code className="bg-slate-100 px-1 rounded text-xs">XSRF-TOKEN</code>, <code className="bg-slate-100 px-1 rounded text-xs">luni_cookie_consent</code>) se almacenan en el dispositivo del usuario y, en el caso de las cookies de sesión, en los servidores de Railway (proveedor de hosting). Railway puede estar sujeto a la legislación de EEUU, si bien se aplican las garantías adecuadas conforme al marco legal RGPD-EEUU vigente.</p>
              <p>No se realizan transferencias de datos de cookies a países sin un nivel adecuado de protección.</p>
            </Section>

            <Section number="8" title="Actualizaciones de la Política de Cookies">
              <p>Luni Styles se reserva el derecho de actualizar esta Política de Cookies cuando sea necesario, ya sea por cambios normativos, cambios tecnológicos en el Sitio Web o modificaciones en el uso de cookies. Cualquier cambio se publicará en esta misma página con indicación de la fecha de actualización.</p>
              <p>En caso de modificaciones significativas, se informará al usuario mediante un nuevo aviso de cookies en el Sitio Web.</p>
            </Section>

            <Section number="9" title="Contacto">
              <p>Para cualquier consulta relativa a esta Política de Cookies o al ejercicio de sus derechos en materia de privacidad, puede contactar con nosotros en:</p>
              <ul className="list-none space-y-1 mt-2 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <li><strong>Correo electrónico:</strong> contacto@lunistyles.com</li>
                <li><strong>Teléfono:</strong> +34 623 59 98 90</li>
                <li><strong>Domicilio:</strong> C. Pedro Hernández Guillamón "El Peseta", 5, 30820 Alcantarilla, Murcia</li>
              </ul>
            </Section>

            <div className="border-t border-slate-100 pt-6 text-xs text-slate-400 text-center">
              Política de Cookies de Luni Styles · C. Pedro Hernández Guillamón "El Peseta", 5, 30820 Alcantarilla, Murcia · contacto@lunistyles.com
            </div>

          </div>
        </div>
      </div>

    </RootLayout>
  );
}
