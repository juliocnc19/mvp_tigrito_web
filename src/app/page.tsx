import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Shield, Users, CreditCard, MessageSquare, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-white">
                UnTigrito®
              </Link>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Conecta con los mejores{" "}
            <span className="text-blue-400">profesionales</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            La plataforma de servicios que une a clientes con profesionales verificados. 
            Encuentra el servicio que necesitas o haz crecer tu negocio de manera segura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Comenzar Ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Por qué elegir Tigrito?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Ofrecemos las herramientas y la seguridad que necesitas para una experiencia excepcional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-slate-800/80 border-slate-700 hover:bg-slate-800 transition-colors">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-white">Confianza y Seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300 text-center">
                  Sistema de verificación completo con pagos protegidos y resolución de disputas
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700 hover:bg-slate-800 transition-colors">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <CardTitle className="text-white">Profesionales Verificados</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300 text-center">
                  Todos nuestros profesionales pasan por un proceso de verificación riguroso
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700 hover:bg-slate-800 transition-colors">
              <CardHeader className="text-center">
                <CreditCard className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-white">Pagos Seguros</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300 text-center">
                  Sistema de pagos protegido con múltiples métodos de pago locales
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700 hover:bg-slate-800 transition-colors">
              <CardHeader className="text-center">
                <MessageSquare className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <CardTitle className="text-white">Comunicación Fácil</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300 text-center">
                  Herramientas de comunicación integradas para una mejor coordinación
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Clients Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Para <span className="text-blue-400">Clientes</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Encuentra el profesional perfecto para tus necesidades con total confianza y transparencia.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Profesionales Verificados</h3>
                    <p className="text-slate-300">Accede a una red de profesionales certificados y con experiencia comprobada</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Precios Transparentes</h3>
                    <p className="text-slate-300">Conoce el costo exacto antes de contratar, sin sorpresas ni costos ocultos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Pagos Protegidos</h3>
                    <p className="text-slate-300">Tu dinero está seguro hasta que el servicio se complete satisfactoriamente</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <div className="text-center">
                <Users className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">¿Necesitas un servicio?</h3>
                <p className="text-slate-300 mb-6">
                  Desde servicios del hogar hasta consultoría profesional, encuentra el experto que necesitas
                </p>
                <Link href="/register">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Buscar Servicios
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Professionals Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 order-2 lg:order-1">
              <div className="text-center">
                <Star className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">¿Eres un profesional?</h3>
                <p className="text-slate-300 mb-6">
                  Únete a nuestra plataforma y haz crecer tu negocio con clientes de calidad
                </p>
                <Link href="/register">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Ofrecer Servicios
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Para <span className="text-green-400">Profesionales</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Haz crecer tu negocio con una plataforma diseñada para profesionales como tú.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Flujo Constante de Clientes</h3>
                    <p className="text-slate-300">Conecta con clientes que buscan exactamente tus servicios</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Pagos Garantizados</h3>
                    <p className="text-slate-300">Recibe tus pagos de forma segura y puntual, sin preocuparte por cobros</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Herramientas de Crecimiento</h3>
                    <p className="text-slate-300">Accede a herramientas profesionales para gestionar y hacer crecer tu negocio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Únete a miles de usuarios que ya confían en Tigrito para sus necesidades de servicios
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold text-white mb-4">UnTigrito®</div>
          <p className="text-slate-400">
            Conectando profesionales con clientes desde 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
