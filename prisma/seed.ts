import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes (en orden inverso de dependencias)
  console.log('🧹 Limpiando datos existentes...')
  await prisma.agent_logs.deleteMany()
  await prisma.agent_messages.deleteMany()
  await prisma.agent_conversations.deleteMany()
  await prisma.proposals.deleteMany()
  await prisma.job_postings.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversationParticipant.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.device.deleteMany()
  await prisma.media.deleteMany()
  await prisma.promoCodeUsage.deleteMany()
  await prisma.promoCode.deleteMany()
  await prisma.adCampaign.deleteMany()
  await prisma.report.deleteMany()
  await prisma.review.deleteMany()
  await prisma.withdrawal.deleteMany()
  await prisma.userPaymentMethod.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.serviceTransaction.deleteMany()
  await prisma.offer.deleteMany()
  await prisma.professionalService.deleteMany()
  await prisma.servicePosting.deleteMany()
  await prisma.professionLink.deleteMany()
  await prisma.profession.deleteMany()
  await prisma.professionalProfile.deleteMany()
  await prisma.user.deleteMany()

  // Crear profesiones
  console.log('👷 Creando profesiones...')
  const professions = await Promise.all([
    prisma.profession.create({
      data: {
        name: 'Plomería',
        slug: 'plomeria',
        description: 'Servicios de instalación, reparación y mantenimiento de sistemas de plomería'
      }
    }),
    prisma.profession.create({
      data: {
        name: 'Electricidad',
        slug: 'electricidad',
        description: 'Instalaciones eléctricas, reparaciones y mantenimiento eléctrico'
      }
    }),
    prisma.profession.create({
      data: {
        name: 'Carpintería',
        slug: 'carpinteria',
        description: 'Trabajos en madera, muebles, estructuras y reparaciones'
      }
    }),
    prisma.profession.create({
      data: {
        name: 'Pintura',
        slug: 'pintura',
        description: 'Servicios de pintura residencial y comercial'
      }
    }),
    prisma.profession.create({
      data: {
        name: 'Jardinería',
        slug: 'jardineria',
        description: 'Mantenimiento de jardines, poda, diseño paisajístico'
      }
    }),
    prisma.profession.create({
      data: {
        name: 'Limpieza',
        slug: 'limpieza',
        description: 'Servicios de limpieza residencial y comercial'
      }
    }),
    prisma.profession.create({
      data: {
        name: 'Tecnología',
        slug: 'tecnologia',
        description: 'Reparación de computadoras, instalación de software, soporte técnico'
      }
    }),
    prisma.profession.create({
      data: {
        name: 'Construcción',
        slug: 'construccion',
        description: 'Obras menores, remodelaciones, reparaciones estructurales'
      }
    })
  ])

  // Crear usuarios
  console.log('👥 Creando usuarios...')
  const hashedPassword = await hash('password123', 12)

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@tigrito.com',
      phone: '+1234567890',
      password: hashedPassword,
      name: 'Administrador Tigrito',
      role: 'ADMIN',
      isVerified: true,
      isIDVerified: true,
      balance: 0,
      locationLat: 19.4326,
      locationLng: -99.1332,
      locationAddress: 'Ciudad de México, México'
    }
  })

  // Clientes
  const clients = await Promise.all([
    prisma.user.create({
      data: {
        email: 'cliente1@example.com',
        phone: '+1234567891',
        password: hashedPassword,
        name: 'María González',
        role: 'CLIENT',
        isVerified: true,
        isIDVerified: true,
        balance: 500.00,
        locationLat: 19.4326,
        locationLng: -99.1332,
        locationAddress: 'Roma Norte, CDMX'
      }
    }),
    prisma.user.create({
      data: {
        email: 'cliente2@example.com',
        phone: '+1234567892',
        password: hashedPassword,
        name: 'Carlos Rodríguez',
        role: 'CLIENT',
        isVerified: true,
        isIDVerified: false,
        balance: 250.00,
        locationLat: 19.4326,
        locationLng: -99.1332,
        locationAddress: 'Polanco, CDMX'
      }
    }),
    prisma.user.create({
      data: {
        email: 'cliente3@example.com',
        phone: '+1234567893',
        password: hashedPassword,
        name: 'Ana Martínez',
        role: 'CLIENT',
        isVerified: true,
        isIDVerified: true,
        balance: 1000.00,
        locationLat: 19.4326,
        locationLng: -99.1332,
        locationAddress: 'Coyoacán, CDMX'
      }
    })
  ])

  // Profesionales
  const professionals = await Promise.all([
    prisma.user.create({
      data: {
        email: 'plomero@example.com',
        phone: '+1234567894',
        password: hashedPassword,
        name: 'José Pérez',
        role: 'PROFESSIONAL',
        isVerified: true,
        isIDVerified: true,
        balance: 1200.50,
        locationLat: 19.4326,
        locationLng: -99.1332,
        locationAddress: 'Iztapalapa, CDMX'
      }
    }),
    prisma.user.create({
      data: {
        email: 'electricista@example.com',
        phone: '+1234567895',
        password: hashedPassword,
        name: 'Roberto Silva',
        role: 'PROFESSIONAL',
        isVerified: true,
        isIDVerified: true,
        balance: 800.25,
        locationLat: 19.4326,
        locationLng: -99.1332,
        locationAddress: 'Tlalpan, CDMX'
      }
    }),
    prisma.user.create({
      data: {
        email: 'carpintero@example.com',
        phone: '+1234567896',
        password: hashedPassword,
        name: 'Miguel Torres',
        role: 'PROFESSIONAL',
        isVerified: true,
        isIDVerified: true,
        balance: 1500.75,
        locationLat: 19.4326,
        locationLng: -99.1332,
        locationAddress: 'Xochimilco, CDMX'
      }
    }),
    prisma.user.create({
      data: {
        email: 'pintor@example.com',
        phone: '+1234567897',
        password: hashedPassword,
        name: 'Luis Mendoza',
        role: 'PROFESSIONAL',
        isVerified: true,
        isIDVerified: false,
        balance: 600.00,
        locationLat: 19.4326,
        locationLng: -99.1332,
        locationAddress: 'Álvaro Obregón, CDMX'
      }
    }),
    prisma.user.create({
      data: {
        email: 'jardinero@example.com',
        phone: '+1234567898',
        password: hashedPassword,
        name: 'Fernando López',
        role: 'PROFESSIONAL',
        isVerified: true,
        isIDVerified: true,
        balance: 400.00,
        locationLat: 19.4326,
        locationLng: -99.1332,
        locationAddress: 'Miguel Hidalgo, CDMX'
      }
    })
  ])

  // Crear perfiles profesionales
  console.log('👨‍💼 Creando perfiles profesionales...')
  const professionalProfiles = await Promise.all([
    prisma.professionalProfile.create({
      data: {
        userId: professionals[0].id,
        bio: 'Plomero con más de 10 años de experiencia en instalaciones residenciales y comerciales. Especializado en reparaciones de emergencia.',
        ratingAvg: 4.8,
        ratingCount: 45,
        hourlyRate: 150.00,
        isVerified: true,
        specialties: ['Reparaciones de emergencia', 'Instalaciones hidráulicas', 'Mantenimiento preventivo'],
        taxId: 'RFC123456789',
        yearsOfExperience: 10,
        completionRate: 95.5,
        responseTime: 30,
        earningsSummary: {
          totalEarnings: 45000,
          thisMonth: 3500,
          lastMonth: 4200
        },
        portfolio: {
          projects: [
            { name: 'Instalación completa baño', price: 5000, completed: true },
            { name: 'Reparación fuga principal', price: 800, completed: true }
          ]
        }
      }
    }),
    prisma.professionalProfile.create({
      data: {
        userId: professionals[1].id,
        bio: 'Electricista certificado con amplia experiencia en instalaciones industriales y residenciales.',
        ratingAvg: 4.9,
        ratingCount: 32,
        hourlyRate: 200.00,
        isVerified: true,
        specialties: ['Instalaciones eléctricas', 'Mantenimiento industrial', 'Sistemas de iluminación'],
        taxId: 'RFC987654321',
        yearsOfExperience: 8,
        completionRate: 98.2,
        responseTime: 45,
        earningsSummary: {
          totalEarnings: 32000,
          thisMonth: 2800,
          lastMonth: 3100
        }
      }
    }),
    prisma.professionalProfile.create({
      data: {
        userId: professionals[2].id,
        bio: 'Carpintero especializado en muebles personalizados y trabajos de restauración.',
        ratingAvg: 4.7,
        ratingCount: 28,
        hourlyRate: 180.00,
        isVerified: true,
        specialties: ['Muebles personalizados', 'Restauración', 'Estructuras de madera'],
        taxId: 'RFC456789123',
        yearsOfExperience: 12,
        completionRate: 92.8,
        responseTime: 60,
        earningsSummary: {
          totalEarnings: 28000,
          thisMonth: 2200,
          lastMonth: 2500
        }
      }
    }),
    prisma.professionalProfile.create({
      data: {
        userId: professionals[3].id,
        bio: 'Pintor profesional con experiencia en pintura residencial y comercial.',
        ratingAvg: 4.5,
        ratingCount: 15,
        hourlyRate: 120.00,
        isVerified: false,
        specialties: ['Pintura residencial', 'Pintura comercial', 'Preparación de superficies'],
        taxId: 'RFC789123456',
        yearsOfExperience: 5,
        completionRate: 88.5,
        responseTime: 90,
        earningsSummary: {
          totalEarnings: 15000,
          thisMonth: 1800,
          lastMonth: 2000
        }
      }
    }),
    prisma.professionalProfile.create({
      data: {
        userId: professionals[4].id,
        bio: 'Jardinero con experiencia en diseño paisajístico y mantenimiento de áreas verdes.',
        ratingAvg: 4.6,
        ratingCount: 22,
        hourlyRate: 100.00,
        isVerified: true,
        specialties: ['Diseño paisajístico', 'Mantenimiento de jardines', 'Poda de árboles'],
        taxId: 'RFC321654987',
        yearsOfExperience: 6,
        completionRate: 94.1,
        responseTime: 120,
        earningsSummary: {
          totalEarnings: 12000,
          thisMonth: 1500,
          lastMonth: 1800
        }
      }
    })
  ])

  // Crear enlaces de profesiones
  console.log('🔗 Creando enlaces de profesiones...')
  await Promise.all([
    prisma.professionLink.create({
      data: {
        userId: professionalProfiles[0].id,
        professionId: professions[0].id, // Plomería
        verified: true,
        documents: {
          certificates: ['Certificado de plomería 2023'],
          insurance: 'Seguro de responsabilidad civil'
        }
      }
    }),
    prisma.professionLink.create({
      data: {
        userId: professionalProfiles[1].id,
        professionId: professions[1].id, // Electricidad
        verified: true,
        documents: {
          certificates: ['Certificado de electricista', 'Licencia CFE'],
          insurance: 'Seguro de responsabilidad civil'
        }
      }
    }),
    prisma.professionLink.create({
      data: {
        userId: professionalProfiles[2].id,
        professionId: professions[2].id, // Carpintería
        verified: true,
        documents: {
          certificates: ['Certificado de carpintería'],
          portfolio: 'Portfolio de trabajos realizados'
        }
      }
    }),
    prisma.professionLink.create({
      data: {
        userId: professionalProfiles[3].id,
        professionId: professions[3].id, // Pintura
        verified: false,
        documents: {
          certificates: ['Certificado de pintura en proceso']
        }
      }
    }),
    prisma.professionLink.create({
      data: {
        userId: professionalProfiles[4].id,
        professionId: professions[4].id, // Jardinería
        verified: true,
        documents: {
          certificates: ['Certificado de jardinería'],
          insurance: 'Seguro de responsabilidad civil'
        }
      }
    })
  ])

  // Crear servicios profesionales
  console.log('🛠️ Creando servicios profesionales...')
  const professionalServices = await Promise.all([
    prisma.professionalService.create({
      data: {
        professionalId: professionals[0].id,
        professionalProfileId: professionalProfiles[0].id,
        title: 'Reparación de Fugas de Agua',
        slug: 'reparacion-fugas-agua',
        description: 'Servicio especializado en la detección y reparación de fugas de agua en sistemas hidráulicos residenciales y comerciales.',
        price: 300.00,
        categoryId: professions[0].id,
        serviceLocations: {
          areas: ['Roma Norte', 'Polanco', 'Coyoacán', 'Condesa'],
          coverage: 'CDMX y área metropolitana'
        },
        isActive: true
      }
    }),
    prisma.professionalService.create({
      data: {
        professionalId: professionals[0].id,
        professionalProfileId: professionalProfiles[0].id,
        title: 'Instalación de Baños Completos',
        slug: 'instalacion-banos-completos',
        description: 'Instalación completa de baños incluyendo sanitarios, lavabos, regaderas y sistemas de drenaje.',
        price: 2500.00,
        categoryId: professions[0].id,
        serviceLocations: {
          areas: ['Toda la CDMX'],
          coverage: 'CDMX y área metropolitana'
        },
        isActive: true
      }
    }),
    prisma.professionalService.create({
      data: {
        professionalId: professionals[1].id,
        professionalProfileId: professionalProfiles[1].id,
        title: 'Instalación Eléctrica Residencial',
        slug: 'instalacion-electrica-residencial',
        description: 'Instalación completa de sistemas eléctricos para viviendas nuevas o remodelaciones.',
        price: 800.00,
        categoryId: professions[1].id,
        serviceLocations: {
          areas: ['Toda la CDMX'],
          coverage: 'CDMX y área metropolitana'
        },
        isActive: true
      }
    }),
    prisma.professionalService.create({
      data: {
        professionalId: professionals[2].id,
        professionalProfileId: professionalProfiles[2].id,
        title: 'Fabricación de Muebles Personalizados',
        slug: 'fabricacion-muebles-personalizados',
        description: 'Diseño y fabricación de muebles a medida según las necesidades del cliente.',
        price: 1200.00,
        categoryId: professions[2].id,
        serviceLocations: {
          areas: ['Toda la CDMX'],
          coverage: 'CDMX y área metropolitana'
        },
        isActive: true
      }
    }),
    prisma.professionalService.create({
      data: {
        professionalId: professionals[4].id,
        professionalProfileId: professionalProfiles[4].id,
        title: 'Diseño y Mantenimiento de Jardines',
        slug: 'diseno-mantenimiento-jardines',
        description: 'Servicio completo de diseño paisajístico y mantenimiento regular de jardines.',
        price: 500.00,
        categoryId: professions[4].id,
        serviceLocations: {
          areas: ['Toda la CDMX'],
          coverage: 'CDMX y área metropolitana'
        },
        isActive: true
      }
    })
  ])

  // Crear postings de servicios
  console.log('📝 Creando postings de servicios...')
  const servicePostings = await Promise.all([
    prisma.servicePosting.create({
      data: {
        clientId: clients[0].id,
        title: 'Necesito reparar fuga en baño principal',
        description: 'Tengo una fuga de agua en el baño principal que está causando humedad en la pared. Necesito que alguien la revise y repare urgentemente.',
        categoryId: professions[0].id, // Plomería
        lat: 19.4326,
        lng: -99.1332,
        address: 'Roma Norte, CDMX',
        priceMin: 200.00,
        priceMax: 500.00,
        status: 'OPEN',
        budget: 400.00
      }
    }),
    prisma.servicePosting.create({
      data: {
        clientId: clients[1].id,
        title: 'Instalación de sistema eléctrico en oficina',
        description: 'Necesito instalar un sistema eléctrico completo en mi nueva oficina. Incluye iluminación, tomas de corriente y sistema de seguridad.',
        categoryId: professions[1].id, // Electricidad
        lat: 19.4326,
        lng: -99.1332,
        address: 'Polanco, CDMX',
        priceMin: 1500.00,
        priceMax: 3000.00,
        status: 'OPEN',
        budget: 2500.00
      }
    }),
    prisma.servicePosting.create({
      data: {
        clientId: clients[2].id,
        title: 'Fabricar librero personalizado',
        description: 'Necesito un librero personalizado para mi sala de estar. Debe ser de madera de buena calidad y con diseño moderno.',
        categoryId: professions[2].id, // Carpintería
        lat: 19.4326,
        lng: -99.1332,
        address: 'Coyoacán, CDMX',
        priceMin: 800.00,
        priceMax: 1500.00,
        status: 'OPEN',
        budget: 1200.00
      }
    }),
    prisma.servicePosting.create({
      data: {
        clientId: clients[0].id,
        title: 'Pintar casa completa',
        description: 'Necesito pintar toda mi casa de 3 habitaciones. Incluye preparación de superficies y aplicación de pintura de calidad.',
        categoryId: professions[3].id, // Pintura
        lat: 19.4326,
        lng: -99.1332,
        address: 'Roma Norte, CDMX',
        priceMin: 2000.00,
        priceMax: 4000.00,
        status: 'CLOSED',
        budget: 3500.00
      }
    })
  ])

  // Crear ofertas
  console.log('💰 Creando ofertas...')
  const offers = await Promise.all([
    prisma.offer.create({
      data: {
        postingId: servicePostings[0].id,
        professionalId: professionals[0].id,
        price: 350.00,
        message: 'Hola, puedo ayudarte con la reparación de la fuga. Tengo experiencia en este tipo de problemas y puedo hacer el trabajo hoy mismo.',
        status: 'PENDING'
      }
    }),
    prisma.offer.create({
      data: {
        postingId: servicePostings[0].id,
        professionalId: professionals[1].id,
        price: 400.00,
        message: 'Aunque soy electricista, también tengo conocimientos de plomería. Puedo revisar el problema y darte una solución.',
        status: 'PENDING'
      }
    }),
    prisma.offer.create({
      data: {
        postingId: servicePostings[1].id,
        professionalId: professionals[1].id,
        price: 2200.00,
        message: 'Perfecto para mi especialidad. Puedo hacer una instalación eléctrica completa y profesional para tu oficina.',
        status: 'ACCEPTED'
      }
    }),
    prisma.offer.create({
      data: {
        postingId: servicePostings[2].id,
        professionalId: professionals[2].id,
        price: 1100.00,
        message: 'Me encanta hacer muebles personalizados. Podemos diseñar algo único para tu sala de estar.',
        status: 'PENDING'
      }
    })
  ])

  // Crear transacciones de servicios
  console.log('🔄 Creando transacciones de servicios...')
  const serviceTransactions = await Promise.all([
    prisma.serviceTransaction.create({
      data: {
        clientId: clients[1].id,
        professionalId: professionals[1].id,
        priceAgreed: 2200.00,
        platformFee: 110.00,
        escrowAmount: 2200.00,
        currentStatus: 'SCHEDULED',
        status: 'SCHEDULED',
        scheduledDate: new Date('2024-02-15T10:00:00Z'),
        postingId: servicePostings[1].id,
        offerId: offers[2].id,
        notes: 'Instalación eléctrica completa en oficina de Polanco'
      }
    }),
    prisma.serviceTransaction.create({
      data: {
        clientId: clients[0].id,
        professionalId: professionals[0].id,
        priceAgreed: 300.00,
        platformFee: 15.00,
        escrowAmount: 300.00,
        currentStatus: 'COMPLETED',
        status: 'COMPLETED',
        completedAt: new Date('2024-01-20T16:30:00Z'),
        proServiceId: professionalServices[0].id,
        notes: 'Reparación de fuga de agua completada exitosamente'
      }
    })
  ])

  // Crear métodos de pago
  console.log('💳 Creando métodos de pago...')
  const paymentMethods = await Promise.all([
    prisma.userPaymentMethod.create({
      data: {
        userId: clients[0].id,
        method: 'BALANCE',
        accountAlias: 'Saldo Tigrito',
        isVerified: true,
        isDefault: true
      }
    }),
    prisma.userPaymentMethod.create({
      data: {
        userId: clients[1].id,
        method: 'TRANSFER',
        accountNumber: '1234567890',
        accountAlias: 'Cuenta Principal',
        isVerified: true,
        isDefault: true
      }
    }),
    prisma.userPaymentMethod.create({
      data: {
        userId: professionals[0].id,
        method: 'TRANSFER',
        accountNumber: '0987654321',
        accountAlias: 'Cuenta Profesional',
        isVerified: true,
        isDefault: true
      }
    })
  ])

  // Crear pagos
  console.log('💸 Creando pagos...')
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        userId: clients[1].id,
        transactionId: serviceTransactions[0].id,
        amount: 2200.00,
        fee: 110.00,
        method: 'TRANSFER',
        status: 'COMPLETED',
        details: {
          transactionId: 'TXN123456789',
          bankReference: 'BANK789123456'
        }
      }
    }),
    prisma.payment.create({
      data: {
        userId: clients[0].id,
        transactionId: serviceTransactions[1].id,
        amount: 300.00,
        fee: 15.00,
        method: 'BALANCE',
        status: 'COMPLETED',
        details: {
          transactionId: 'TXN987654321'
        }
      }
    })
  ])

  // Crear retiros
  console.log('🏦 Creando retiros...')
  const withdrawals = await Promise.all([
    prisma.withdrawal.create({
      data: {
        userId: professionals[0].id,
        paymentMethodId: paymentMethods[2].id,
        amount: 500.00,
        status: 'PENDING',
        adminNotes: 'Retiro pendiente de revisión'
      }
    }),
    prisma.withdrawal.create({
      data: {
        userId: professionals[1].id,
        paymentMethodId: paymentMethods[2].id,
        amount: 1000.00,
        status: 'COMPLETED',
        completedAt: new Date('2024-01-15T14:30:00Z'),
        adminNotes: 'Retiro procesado exitosamente'
      }
    })
  ])

  // Crear reviews
  console.log('⭐ Creando reviews...')
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        transactionId: serviceTransactions[1].id,
        reviewerId: clients[0].id,
        reviewedId: professionals[0].id,
        rating: 5,
        comment: 'Excelente trabajo, muy profesional y puntual. Definitivamente lo recomiendo.',
        isProReview: true,
        professionalProfileId: professionalProfiles[0].id
      }
    }),
    prisma.review.create({
      data: {
        transactionId: serviceTransactions[0].id,
        reviewerId: clients[1].id,
        reviewedId: professionals[1].id,
        rating: 4,
        comment: 'Muy buen trabajo, aunque tardó un poco más de lo esperado.',
        isProReview: true,
        professionalProfileId: professionalProfiles[1].id
      }
    })
  ])

  // Crear códigos promocionales
  console.log('🎟️ Creando códigos promocionales...')
  const promoCodes = await Promise.all([
    prisma.promoCode.create({
      data: {
        code: 'BIENVENIDO20',
        discountType: 'PERCENTAGE',
        discountValue: 20.00,
        maxUses: 100,
        usesCount: 5,
        maxUsesPerUser: 1,
        validFrom: new Date('2024-01-01T00:00:00Z'),
        validUntil: new Date('2024-12-31T23:59:59Z'),
        targetCategory: 'TODOS',
        isActive: true
      }
    }),
    prisma.promoCode.create({
      data: {
        code: 'PLOMERIA50',
        discountType: 'FIXED_AMOUNT',
        discountValue: 50.00,
        maxUses: 50,
        usesCount: 2,
        maxUsesPerUser: 1,
        validFrom: new Date('2024-01-01T00:00:00Z'),
        validUntil: new Date('2024-06-30T23:59:59Z'),
        targetCategory: 'plomeria',
        isActive: true
      }
    })
  ])

  // Crear uso de códigos promocionales
  console.log('🎫 Creando uso de códigos promocionales...')
  await Promise.all([
    prisma.promoCodeUsage.create({
      data: {
        codeId: promoCodes[0].id,
        userId: clients[0].id,
        usedAt: new Date('2024-01-15T10:30:00Z')
      }
    }),
    prisma.promoCodeUsage.create({
      data: {
        codeId: promoCodes[1].id,
        userId: clients[1].id,
        usedAt: new Date('2024-01-20T14:15:00Z')
      }
    })
  ])

  // Crear notificaciones
  console.log('🔔 Creando notificaciones...')
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: clients[0].id,
        title: 'Nueva oferta recibida',
        body: 'Has recibido una nueva oferta para tu solicitud de reparación de fuga',
        data: {
          type: 'OFFER_RECEIVED',
          postingId: servicePostings[0].id
        },
        read: false
      }
    }),
    prisma.notification.create({
      data: {
        userId: professionals[0].id,
        title: 'Pago recibido',
        body: 'Has recibido un pago de $300.00 por el servicio completado',
        data: {
          type: 'PAYMENT_RECEIVED',
          amount: 300.00
        },
        read: true
      }
    }),
    prisma.notification.create({
      data: {
        userId: clients[1].id,
        title: 'Servicio programado',
        body: 'Tu instalación eléctrica ha sido programada para el 15 de febrero',
        data: {
          type: 'SERVICE_SCHEDULED',
          scheduledDate: '2024-02-15T10:00:00Z'
        },
        read: false
      }
    })
  ])

  // Crear conversaciones
  console.log('💬 Creando conversaciones...')
  const conversations = await Promise.all([
    prisma.conversation.create({
      data: {
        createdById: clients[0].id,
        title: 'Consulta sobre reparación de fuga',
        type: 'CLIENT_PROFESSIONAL',
        updatedAt: new Date()
      }
    }),
    prisma.conversation.create({
      data: {
        createdById: clients[1].id,
        title: 'Instalación eléctrica oficina',
        type: 'CLIENT_PROFESSIONAL',
        updatedAt: new Date()
      }
    })
  ])

  // Crear participantes de conversaciones
  console.log('👥 Creando participantes de conversaciones...')
  await Promise.all([
    prisma.conversationParticipant.create({
      data: {
        conversationId: conversations[0].id,
        userId: clients[0].id
      }
    }),
    prisma.conversationParticipant.create({
      data: {
        conversationId: conversations[0].id,
        userId: professionals[0].id
      }
    }),
    prisma.conversationParticipant.create({
      data: {
        conversationId: conversations[1].id,
        userId: clients[1].id
      }
    }),
    prisma.conversationParticipant.create({
      data: {
        conversationId: conversations[1].id,
        userId: professionals[1].id
      }
    })
  ])

  // Crear mensajes
  console.log('📨 Creando mensajes...')
  await Promise.all([
    prisma.message.create({
      data: {
        conversationId: conversations[0].id,
        senderId: clients[0].id,
        content: 'Hola, necesito ayuda con una fuga de agua en mi baño',
        messageType: 'TEXT'
      }
    }),
    prisma.message.create({
      data: {
        conversationId: conversations[0].id,
        senderId: professionals[0].id,
        content: 'Hola! Puedo ayudarte con eso. ¿Podrías enviarme una foto del problema?',
        messageType: 'TEXT'
      }
    }),
    prisma.message.create({
      data: {
        conversationId: conversations[1].id,
        senderId: clients[1].id,
        content: 'Necesito una instalación eléctrica completa para mi oficina',
        messageType: 'TEXT'
      }
    }),
    prisma.message.create({
      data: {
        conversationId: conversations[1].id,
        senderId: professionals[1].id,
        content: 'Perfecto, puedo hacer esa instalación. ¿Cuál es el tamaño de la oficina?',
        messageType: 'TEXT'
      }
    })
  ])

  // Crear dispositivos
  console.log('📱 Creando dispositivos...')
  await Promise.all([
    prisma.device.create({
      data: {
        userId: clients[0].id,
        deviceId: 'device_123',
        pushToken: 'push_token_123',
        lastSeen: new Date()
      }
    }),
    prisma.device.create({
      data: {
        userId: professionals[0].id,
        deviceId: 'device_456',
        pushToken: 'push_token_456',
        lastSeen: new Date()
      }
    })
  ])

  // Crear logs de auditoría
  console.log('📋 Creando logs de auditoría...')
  await Promise.all([
    prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'USER_CREATED',
        meta: {
          userId: clients[0].id,
          userEmail: clients[0].email
        }
      }
    }),
    prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'PROFESSIONAL_VERIFIED',
        meta: {
          professionalId: professionals[0].id,
          verificationType: 'ID_VERIFICATION'
        }
      }
    }),
    prisma.auditLog.create({
      data: {
        actorId: professionals[0].id,
        action: 'SERVICE_COMPLETED',
        meta: {
          transactionId: serviceTransactions[1].id,
          completionTime: new Date()
        }
      }
    })
  ])

  // Crear campañas publicitarias
  console.log('📢 Creando campañas publicitarias...')
  await Promise.all([
    prisma.adCampaign.create({
      data: {
        title: 'Campaña Plomería Q1 2024',
        targetSegment: 'CLIENT',
        location: 'CDMX',
        imageUrl: 'https://example.com/plomeria-ad.jpg',
        targetUrl: 'https://tigrito.com/services/plomeria',
        startDate: new Date('2024-01-01T00:00:00Z'),
        endDate: new Date('2024-03-31T23:59:59Z'),
        isActive: true,
        impressions: 15000,
        clicks: 450
      }
    }),
    prisma.adCampaign.create({
      data: {
        title: 'Campaña Profesionales Q1 2024',
        targetSegment: 'PROFESSIONAL',
        location: 'CDMX',
        imageUrl: 'https://example.com/professionals-ad.jpg',
        targetUrl: 'https://tigrito.com/join-professionals',
        startDate: new Date('2024-01-01T00:00:00Z'),
        endDate: new Date('2024-03-31T23:59:59Z'),
        isActive: true,
        impressions: 8000,
        clicks: 200
      }
    })
  ])

  // Crear job postings (sistema de trabajos)
  console.log('💼 Creando job postings...')
  const jobPostings = await Promise.all([
    prisma.job_postings.create({
      data: {
        id: 'job_001',
        title: 'Desarrollo de App Móvil',
        description: 'Necesito desarrollar una aplicación móvil para iOS y Android para mi negocio de restaurantes.',
        category: 'Tecnología',
        location: 'CDMX',
        budget: 50000.00,
        budgetMin: 30000.00,
        budgetMax: 70000.00,
        clientId: clients[0].id,
        status: 'OPEN',
        updatedAt: new Date()
      }
    }),
    prisma.job_postings.create({
      data: {
        id: 'job_002',
        title: 'Diseño de Logo y Branding',
        description: 'Necesito diseñar un logo profesional y crear la identidad visual completa para mi nueva empresa.',
        category: 'Diseño',
        location: 'CDMX',
        budget: 15000.00,
        budgetMin: 8000.00,
        budgetMax: 25000.00,
        clientId: clients[1].id,
        status: 'OPEN',
        updatedAt: new Date()
      }
    })
  ])

  // Crear propuestas para job postings
  console.log('📝 Creando propuestas...')
  await Promise.all([
    prisma.proposals.create({
      data: {
        id: 'prop_001',
        jobId: jobPostings[0].id,
        professionalId: professionals[2].id,
        professionalProfileId: professionalProfiles[2].id,
        amount: 45000.00,
        description: 'Tengo experiencia desarrollando apps móviles para restaurantes. Puedo crear una app completa con sistema de pedidos, pagos y gestión de menú.',
        includesMaterials: false,
        offersWarranty: true,
        warrantyDuration: 6,
        termsAndConditions: 'Desarrollo en 3 meses con 2 revisiones incluidas',
        status: 'PENDING',
        updatedAt: new Date()
      }
    }),
    prisma.proposals.create({
      data: {
        id: 'prop_002',
        jobId: jobPostings[1].id,
        professionalId: professionals[3].id,
        professionalProfileId: professionalProfiles[3].id,
        amount: 12000.00,
        description: 'Soy diseñador gráfico especializado en branding corporativo. Crearé una identidad visual completa y profesional.',
        includesMaterials: true,
        offersWarranty: true,
        warrantyDuration: 3,
        termsAndConditions: 'Entrega en 2 semanas con 3 revisiones incluidas',
        status: 'PENDING',
        updatedAt: new Date()
      }
    })
  ])

  // Crear conversaciones de agentes
  console.log('🤖 Creando conversaciones de agentes...')
  const agentConversations = await Promise.all([
    prisma.agent_conversations.create({
      data: {
        id: 'agent_conv_001',
        userId: clients[0].id,
        sessionId: 'session_001',
        title: 'Consulta sobre servicios de plomería',
        updatedAt: new Date()
      }
    }),
    prisma.agent_conversations.create({
      data: {
        id: 'agent_conv_002',
        userId: professionals[0].id,
        sessionId: 'session_002',
        title: 'Optimización de perfil profesional',
        updatedAt: new Date()
      }
    })
  ])

  // Crear mensajes de agentes
  console.log('💬 Creando mensajes de agentes...')
  await Promise.all([
    prisma.agent_messages.create({
      data: {
        id: 'agent_msg_001',
        conversationId: agentConversations[0].id,
        role: 'USER',
        content: 'Necesito ayuda con una fuga de agua en mi casa'
      }
    }),
    prisma.agent_messages.create({
      data: {
        id: 'agent_msg_002',
        conversationId: agentConversations[0].id,
        role: 'ASSISTANT',
        content: 'Te puedo ayudar a encontrar un plomero profesional. ¿En qué zona de la ciudad te encuentras?'
      }
    }),
    prisma.agent_messages.create({
      data: {
        id: 'agent_msg_003',
        conversationId: agentConversations[1].id,
        role: 'USER',
        content: '¿Cómo puedo mejorar mi perfil para conseguir más clientes?'
      }
    }),
    prisma.agent_messages.create({
      data: {
        id: 'agent_msg_004',
        conversationId: agentConversations[1].id,
        role: 'ASSISTANT',
        content: 'Para mejorar tu perfil te recomiendo: 1) Completar tu biografía con detalles específicos, 2) Subir fotos de trabajos anteriores, 3) Mantener un rating alto, 4) Responder rápido a las consultas'
      }
    })
  ])

  // Crear logs de agentes
  console.log('📊 Creando logs de agentes...')
  await Promise.all([
    prisma.agent_logs.create({
      data: {
        id: 'agent_log_001',
        conversationId: agentConversations[0].id,
        userId: clients[0].id,
        toolName: 'search_professionals',
        action: 'SEARCH_EXECUTED',
        input: { category: 'plomeria', location: 'CDMX' },
        output: { results: 5, professionals: ['prof_001', 'prof_002'] },
        duration: 1200,
        success: true
      }
    }),
    prisma.agent_logs.create({
      data: {
        id: 'agent_log_002',
        conversationId: agentConversations[1].id,
        userId: professionals[0].id,
        toolName: 'profile_analyzer',
        action: 'ANALYSIS_COMPLETED',
        input: { profileId: professionalProfiles[0].id },
        output: { suggestions: ['Add more photos', 'Update bio', 'Add certifications'] },
        duration: 800,
        success: true
      }
    })
  ])

  // Crear configuraciones de agentes
  console.log('⚙️ Creando configuraciones de agentes...')
  await Promise.all([
    prisma.agent_configs.create({
      data: {
        id: 'config_001',
        name: 'Customer Support Agent',
        description: 'Agente especializado en atención al cliente',
        systemPrompt: 'Eres un asistente virtual especializado en ayudar a clientes con consultas sobre servicios profesionales. Siempre sé amable, profesional y útil.',
        temperature: 0.7,
        maxTokens: 1000,
        topP: 0.9,
        personality: 'Amigable y profesional',
        tools: ['search_professionals', 'create_service_request', 'check_booking_status'],
        isActive: true,
        updatedAt: new Date()
      }
    }),
    prisma.agent_configs.create({
      data: {
        id: 'config_002',
        name: 'Professional Advisor Agent',
        description: 'Agente para asesorar a profesionales',
        systemPrompt: 'Eres un consultor especializado en ayudar a profesionales a optimizar su presencia en la plataforma y mejorar su rendimiento.',
        temperature: 0.6,
        maxTokens: 1200,
        topP: 0.8,
        personality: 'Analítico y constructivo',
        tools: ['profile_analyzer', 'market_insights', 'performance_tracker'],
        isActive: true,
        updatedAt: new Date()
      }
    })
  ])

  // Crear métricas de agentes
  console.log('📈 Creando métricas de agentes...')
  await Promise.all([
    prisma.agent_metrics.create({
      data: {
        id: 'metric_001',
        date: new Date('2024-01-15T00:00:00Z'),
        metric: 'conversations_started',
        value: 25,
        metadata: { agent_type: 'customer_support' }
      }
    }),
    prisma.agent_metrics.create({
      data: {
        id: 'metric_002',
        date: new Date('2024-01-15T00:00:00Z'),
        metric: 'successful_resolutions',
        value: 22,
        metadata: { agent_type: 'customer_support' }
      }
    }),
    prisma.agent_metrics.create({
      data: {
        id: 'metric_003',
        date: new Date('2024-01-15T00:00:00Z'),
        metric: 'average_response_time',
        value: 2.5,
        metadata: { agent_type: 'customer_support', unit: 'seconds' }
      }
    })
  ])

  // Crear personalidades de agentes
  console.log('🎭 Creando personalidades de agentes...')
  await Promise.all([
    prisma.agent_personalities.create({
      data: {
        id: 'personality_001',
        name: 'Support Helper',
        description: 'Personalidad amigable y servicial para atención al cliente',
        prompt: 'Eres un asistente virtual muy amigable y servicial. Siempre mantienes un tono positivo y te esfuerzas por resolver los problemas de los usuarios de manera efectiva.',
        tools: ['search_professionals', 'create_ticket', 'check_status'],
        isActive: true,
        updatedAt: new Date()
      }
    }),
    prisma.agent_personalities.create({
      data: {
        id: 'personality_002',
        name: 'Business Advisor',
        description: 'Personalidad analítica para asesorar profesionales',
        prompt: 'Eres un consultor de negocios experto. Proporcionas consejos estratégicos y análisis detallados para ayudar a los profesionales a crecer en la plataforma.',
        tools: ['analyze_performance', 'market_analysis', 'strategy_recommendations'],
        isActive: true,
        updatedAt: new Date()
      }
    })
  ])

  console.log('✅ Seed completado exitosamente!')
  console.log(`
📊 Resumen de datos creados:
- 👥 Usuarios: ${1 + clients.length + professionals.length} (1 admin, ${clients.length} clientes, ${professionals.length} profesionales)
- 👷 Profesiones: ${professions.length}
- 👨‍💼 Perfiles profesionales: ${professionalProfiles.length}
- 🛠️ Servicios profesionales: ${professionalServices.length}
- 📝 Postings de servicios: ${servicePostings.length}
- 💰 Ofertas: ${offers.length}
- 🔄 Transacciones: ${serviceTransactions.length}
- 💳 Métodos de pago: ${paymentMethods.length}
- 💸 Pagos: ${payments.length}
- 🏦 Retiros: ${withdrawals.length}
- ⭐ Reviews: ${reviews.length}
- 🎟️ Códigos promocionales: ${promoCodes.length}
- 🔔 Notificaciones: 3
- 💬 Conversaciones: ${conversations.length}
- 📨 Mensajes: 4
- 📱 Dispositivos: 2
- 📋 Logs de auditoría: 3
- 📢 Campañas publicitarias: 2
- 💼 Job postings: ${jobPostings.length}
- 📝 Propuestas: 2
- 🤖 Conversaciones de agentes: ${agentConversations.length}
- 💬 Mensajes de agentes: 4
- 📊 Logs de agentes: 2
- ⚙️ Configuraciones de agentes: 2
- 📈 Métricas de agentes: 3
- 🎭 Personalidades de agentes: 2
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
