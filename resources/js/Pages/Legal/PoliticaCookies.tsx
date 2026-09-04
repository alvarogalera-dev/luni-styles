import RootLayout from '@/Layouts/RootLayout';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

export default function PoliticaCookies({ meta }: Props) {
  return (
    <RootLayout meta={meta}>
      
      {/* ── Header Oscuro ── */}
      <div className="pt-32 pb-24 px-6 md:px-10 bg-void text-bone">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="font-display font-black text-4xl md:text-5xl tracking-tighter">Política de Cookies</h1>
          <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full" />
          <p className="text-ash text-sm md:text-base">Cómo utilizamos las cookies para mejorar tu experiencia.</p>
        </div>
      </div>

      {/* ── Contenido Claro ── */}
      <div className="py-16 md:py-24 px-6 md:px-10 bg-[#f8fafc] text-slate-800 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-10">
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">1. ¿Qué son las cookies?</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que contengan y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">2. Tipos de cookies que utilizamos</h2>
              <ul className="list-disc list-inside text-slate-600 space-y-2 text-sm md:text-base">
                <li><strong>Cookies técnicas:</strong> Son aquellas que permiten al usuario la navegación a través de la web.</li>
                <li><strong>Cookies de personalización:</strong> Permiten al usuario acceder al servicio con algunas características de carácter general predefinidas (ej: banner cerrado).</li>
                <li><strong>Cookies de análisis:</strong> Son aquellas que nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">3. Cómo desactivar las cookies</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Usted puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador. Si rechaza las cookies podrá seguir usando nuestro sitio web, aunque el uso de algunos de sus servicios podrá ser limitado.
              </p>
            </section>
            
          </div>
        </div>
      </div>

    </RootLayout>
  );
}
