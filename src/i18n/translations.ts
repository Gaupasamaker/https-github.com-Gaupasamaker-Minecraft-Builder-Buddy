export type Language = 'en' | 'es';

export const translations = {
  en: {
    appTitle: "Builder Buddy",
    home: {
      title: "What shall we build today?",
      subtitle: "Select a tool to get started!",
      ideas: {
        title: "Idea Generator",
        desc: "Get inspired with cool building ideas by category!"
      },
      builder: {
        title: "Master Builder",
        desc: "Step-by-step guides for anything you can imagine."
      },
      scanner: {
        title: "Biome Scanner",
        desc: "Snap a photo of your game to get contextual ideas."
      }
    },
    ideas: {
      title: "Idea Generator",
      pickCategory: "Pick a Category:",
      mining: "Mining for ideas...",
      suggestions: "Suggestions",
      newIdeas: "New Ideas",
      error: "Sorry, I couldn't generate ideas right now. Try again!",
      viewDetails: "Click to see how to build!",
      generatingImage: "Painting a picture...",
      back: "Back to Ideas",
      buildGuide: "Building Guide",
      materials: "Materials Needed",
      steps: "Step-by-Step Instructions",
      loadingGuide: "Creating your blueprint...",
      realWorld: "Real World",
      needHelp: "Need help?",
      gotIt: "Got it!",
      save: "Save to Blueprints",
      saved: "Saved!",
      complete: "Complete Build!",
      completed: "Build Completed!",
      categories: {
        house: "Houses & Bases",
        vehicle: "Vehicles",
        monument: "Statues & Monuments",
        redstone: "Redstone Contraptions",
        garden: "Gardens & Nature",
        fantasy: "Fantasy Structures"
      }
    },
    favorites: {
      title: "My Blueprints",
      desc: "Your saved building plans.",
      empty: "No saved blueprints yet. Go find some cool ideas!",
      delete: "Delete"
    },
    achievements: {
      title: "Builder Profile",
      desc: "Your progress and badges.",
      xp: "XP",
      level: "Level",
      badges: "Badges",
      locked: "Locked",
      unlocked: "Unlocked!",
      list: {
        first_build: { title: "Novice Builder", desc: "Completed your first build!" },
        three_builds: { title: "Apprentice", desc: "Completed 3 builds." },
        master_builder: { title: "Master Builder", desc: "Completed 10 builds." },
        idea_collector: { title: "Idea Collector", desc: "Saved 5 blueprints." },
        
        // New Achievements
        wood_master: { title: "Wood Master", desc: "Built 3 Houses." },
        stone_mason: { title: "Stone Mason", desc: "Built 3 Monuments." },
        redstone_engineer: { title: "Redstone Engineer", desc: "Built 3 Redstone contraptions." },
        green_thumb: { title: "Green Thumb", desc: "Built 3 Gardens." },
        mechanic: { title: "Mechanic", desc: "Built 3 Vehicles." },
        dream_builder: { title: "Dream Builder", desc: "Built 3 Fantasy structures." },
        
        architect: { title: "Architect", desc: "Built 10 Houses." },
        sculptor: { title: "Sculptor", desc: "Built 10 Monuments." },
        tech_wizard: { title: "Tech Wizard", desc: "Built 10 Redstone contraptions." },
        nature_lover: { title: "Nature Lover", desc: "Built 10 Gardens." },
        pilot: { title: "Pilot", desc: "Built 10 Vehicles." },
        fantasy_lord: { title: "Fantasy Lord", desc: "Built 10 Fantasy structures." },
        
        idea_hoarder: { title: "Idea Hoarder", desc: "Saved 10 blueprints." },
        library_curator: { title: "Library Curator", desc: "Saved 20 blueprints." },
        
        dedicated: { title: "Dedicated", desc: "Reached Level 5." },
        expert: { title: "Expert", desc: "Reached Level 10." },
        elite: { title: "Elite", desc: "Reached Level 20." },
        legendary: { title: "Legendary", desc: "Reached Level 50." },
        
        marathon_runner: { title: "Marathon Runner", desc: "Completed 25 total builds." },
        centurion: { title: "Centurion", desc: "Completed 50 total builds." }
      }
    },
    chat: {
      title: "Master Builder Chat",
      placeholder: "Type your idea here...",
      clear: "Clear",
      initialMessage: "Hi! I'm your Master Builder assistant. Tell me what you want to build (like 'a giant treehouse' or 'a secret underwater base') and I'll help you plan it step-by-step!",
      systemPrompt: "You are a helpful, enthusiastic Minecraft expert guiding an 11-year-old. Help them build things step-by-step. Be clear, encouraging, and use simple materials where possible. If they ask for a complex build, break it down into small, manageable steps. Use bold text for materials. Respond in English.",
      error: "Oops! My connection to the server broke. Please try again.",
      thinking: "I'm having trouble thinking of a response. Can you say that again?"
    },
    scanner: {
      title: "Biome Scanner",
      introTitle: "Show me your world!",
      introDesc: "Take a photo of your screen or upload a screenshot.",
      useCamera: "Use Camera",
      uploadImage: "Upload Image",
      snapPhoto: "Snap Photo",
      cancel: "Cancel",
      scanNew: "Scan New Area",
      analyzing: "Analyzing terrain...",
      results: "Analysis Results",
      error: "Oops! I had trouble seeing that image. Please try again.",
      noAnalysis: "I couldn't analyze the image. Try taking another one!"
    }
  },
  es: {
    appTitle: "Compañero Constructor",
    home: {
      title: "¿Qué construiremos hoy?",
      subtitle: "¡Elige una herramienta para empezar!",
      ideas: {
        title: "Generador de Ideas",
        desc: "¡Inspírate con ideas geniales por categoría!"
      },
      builder: {
        title: "Maestro Constructor",
        desc: "Guías paso a paso para cualquier cosa que imagines."
      },
      scanner: {
        title: "Escáner de Biomas",
        desc: "Haz una foto de tu juego para obtener ideas."
      }
    },
    ideas: {
      title: "Generador de Ideas",
      pickCategory: "Elige una categoría:",
      mining: "Minando ideas...",
      suggestions: "Sugerencias",
      newIdeas: "Nuevas Ideas",
      error: "Lo siento, no pude generar ideas ahora. ¡Inténtalo de nuevo!",
      viewDetails: "¡Haz clic para ver cómo construirlo!",
      generatingImage: "Pintando un cuadro...",
      back: "Volver a Ideas",
      buildGuide: "Guía de Construcción",
      materials: "Materiales Necesarios",
      steps: "Instrucciones Paso a Paso",
      loadingGuide: "Creando tus planos...",
      realWorld: "Mundo Real",
      needHelp: "¿Necesitas ayuda?",
      gotIt: "¡Entendido!",
      save: "Guardar en Planos",
      saved: "¡Guardado!",
      complete: "¡Terminar Construcción!",
      completed: "¡Construcción Terminada!",
      categories: {
        house: "Casas y Bases",
        vehicle: "Vehículos",
        monument: "Estatuas y Monumentos",
        redstone: "Mecanismos Redstone",
        garden: "Jardines y Naturaleza",
        fantasy: "Estructuras de Fantasía"
      }
    },
    favorites: {
      title: "Mis Planos",
      desc: "Tus planes de construcción guardados.",
      empty: "Aún no hay planos guardados. ¡Ve a buscar ideas geniales!",
      delete: "Borrar"
    },
    achievements: {
      title: "Perfil de Constructor",
      desc: "Tu progreso y medallas.",
      xp: "XP",
      level: "Nivel",
      badges: "Medallas",
      locked: "Bloqueado",
      unlocked: "¡Desbloqueado!",
      list: {
        first_build: { title: "Constructor Novato", desc: "¡Completaste tu primera construcción!" },
        three_builds: { title: "Aprendiz", desc: "Completaste 3 construcciones." },
        master_builder: { title: "Maestro Constructor", desc: "Completaste 10 construcciones." },
        idea_collector: { title: "Coleccionista", desc: "Guardaste 5 planos." },

        // New Achievements
        wood_master: { title: "Maestro de la Madera", desc: "Construiste 3 Casas." },
        stone_mason: { title: "Cantero", desc: "Construiste 3 Monumentos." },
        redstone_engineer: { title: "Ingeniero de Redstone", desc: "Construiste 3 mecanismos." },
        green_thumb: { title: "Manos Verdes", desc: "Construiste 3 Jardines." },
        mechanic: { title: "Mecánico", desc: "Construiste 3 Vehículos." },
        dream_builder: { title: "Constructor de Sueños", desc: "Construiste 3 estructuras de Fantasía." },
        
        architect: { title: "Arquitecto", desc: "Construiste 10 Casas." },
        sculptor: { title: "Escultor", desc: "Construiste 10 Monumentos." },
        tech_wizard: { title: "Mago Tecnológico", desc: "Construiste 10 mecanismos." },
        nature_lover: { title: "Amante de la Naturaleza", desc: "Construiste 10 Jardines." },
        pilot: { title: "Piloto", desc: "Construiste 10 Vehículos." },
        fantasy_lord: { title: "Señor de la Fantasía", desc: "Construiste 10 estructuras de Fantasía." },
        
        idea_hoarder: { title: "Acaparador", desc: "Guardaste 10 planos." },
        library_curator: { title: "Bibliotecario", desc: "Guardaste 20 planos." },
        
        dedicated: { title: "Dedicado", desc: "Alcanzaste el Nivel 5." },
        expert: { title: "Experto", desc: "Alcanzaste el Nivel 10." },
        elite: { title: "Élite", desc: "Alcanzaste el Nivel 20." },
        legendary: { title: "Legendario", desc: "Alcanzaste el Nivel 50." },
        
        marathon_runner: { title: "Maratonista", desc: "Completaste 25 construcciones." },
        centurion: { title: "Centurión", desc: "Completaste 50 construcciones." }
      }
    },
    chat: {
      title: "Chat Maestro Constructor",
      placeholder: "Escribe tu idea aquí...",
      clear: "Borrar",
      initialMessage: "¡Hola! Soy tu asistente Maestro Constructor. Dime qué quieres construir (como 'una casa en el árbol gigante' o 'una base secreta submarina') y te ayudaré a planearlo paso a paso.",
      systemPrompt: "Eres un experto en Minecraft servicial y entusiasta que guía a un niño de 11 años. Ayúdale a construir cosas paso a paso. Sé claro, alentador y usa materiales simples cuando sea posible. Si piden una construcción compleja, divídela en pasos pequeños y manejables. Usa negrita para los materiales. Responde en Español.",
      error: "¡Uy! Se rompió mi conexión con el servidor. Por favor inténtalo de nuevo.",
      thinking: "Me cuesta pensar una respuesta. ¿Puedes repetirlo?"
    },
    scanner: {
      title: "Escáner de Biomas",
      introTitle: "¡Enséñame tu mundo!",
      introDesc: "Haz una foto de tu pantalla o sube una captura.",
      useCamera: "Usar Cámara",
      uploadImage: "Subir Imagen",
      snapPhoto: "Hacer Foto",
      cancel: "Cancelar",
      scanNew: "Escanear Nueva Zona",
      analyzing: "Analizando el terreno...",
      results: "Resultados del Análisis",
      error: "¡Uy! Tuve problemas para ver esa imagen. Inténtalo de nuevo.",
      noAnalysis: "No pude analizar la imagen. ¡Intenta tomar otra!"
    }
  }
};
