import RootLayout from '@/Layouts/RootLayout';

interface Meta { title: string; description: string; }
interface Props { meta: Meta; }

export default function AvisoLegal({ meta }: Props) {
  return (
    <RootLayout meta={meta}>
      
      {/* ── Header Oscuro ── */}
      <div className="pt-32 pb-24 px-6 md:px-10 bg-void text-bone">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="font-display font-black text-4xl md:text-5xl tracking-tighter">Aviso Legal</h1>
          <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full" />
          <p className="text-ash text-sm md:text-base">Información general en cumplimiento de la LSSI.</p>
        </div>
      </div>

      {/* ── Contenido Claro ── */}
      <div className="py-16 md:py-24 px-6 md:px-10 bg-[#f8fafc] text-slate-800 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-10">
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">1. Información del Titular</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                En cumplimiento con lo dispuesto en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico, se informa que la presente página web es propiedad de Luni Styles S.L., con domicilio en Calle Mayor 12, 30820 Alcantarilla, Murcia, y NIF B-12345678.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">2. Propiedad Intelectual e Industrial</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                El diseño del portal y sus códigos fuente, así como los logos, marcas y demás signos distintivos que aparecen en el mismo pertenecen a Luni Styles y están protegidos por los correspondientes derechos de propiedad intelectual e industrial.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 border-l-4 border-amber-400 pl-4">3. Responsabilidad de los contenidos</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Luni Styles no se hace responsable de la legalidad de otros sitios web de terceros desde los que pueda accederse al portal. Luni Styles tampoco responde por la legalidad de otros sitios web de terceros, que pudieran estar vinculados o enlazados desde este portal.
              </p>
            </section>
            
          </div>
        </div>
      </div>

    </RootLayout>
  );
}
