import { ref, computed } from 'vue'

// Traduções completas para todos os idiomas
const translations = {
  pt: {
    // Navegação
    'nav.inicio': 'Início',
    'nav.quem_somos': 'Quem Somos',
    'nav.galeria': 'Galeria',
    'nav.eventos': 'Eventos',
    'nav.noticias': 'Notícias',
    'nav.classificados': 'Classificados',
    'nav.parceiros': 'Parceiros',
    'nav.contato': 'Contato',
    
    // Geral
    'geral.logo_alt': 'Logo AMAJAC',
    'geral.nome_site': 'AMAJAC',
    'geral.associado': 'Área do Associado',
    'geral.area_restrita': 'Área Restrita',
    'geral.banner_alt': 'Banner AMAJAC',
    'geral.titulo_portal': 'PORTAL DO MORADOR',
    'geral.descricao_site': 'Associação de Moradores e Amigos do Jardim Atlântico Central',
    'geral.localizacao': 'ITAIPUAÇU - MARICÁ',
    'geral.descricao_hero': 'Trabalhamos juntos para transformar nosso bairro através de ações coletivas.',
    'geral.slogan': 'Unidos por um bairro melhor!',
    'geral.erro_banner': 'Erro ao carregar banner',
    'geral.erro_imagem': 'Erro ao carregar imagem',
    'geral.enviando': 'Enviando...',
    'geral.alternar_idioma': 'Alternar idioma',
    
    // Quem Somos
    'quem_somos.titulo': 'Quem Somos',
    'quem_somos.subtitulo': 'Conheça a história da Associação de Moradores e Amigos do Bairro Jardim Atlântico Central',
    'quem_somos.historia_titulo': 'Nossa História',
    'quem_somos.historia': 'A AMAJAC foi fundada com o objetivo de unir a comunidade e trabalhar em prol das melhorias necessárias para nosso bairro. Nossa trajetória começou com um grupo de moradores preocupados com o desenvolvimento e qualidade de vida no Jardim Atlântico Central.',
    'quem_somos.missao_titulo': 'Nossa Missão',
    'quem_somos.missao': 'Representar e unir os moradores do Jardim Atlântico Central, promovendo ações que elevem a qualidade de vida, defendendo os interesses da comunidade e fomentando o desenvolvimento sustentável do bairro.',
    'quem_somos.valores_titulo': 'Nossos Valores',
    'quem_somos.imagem_alt': 'Imagem sobre a AMAJAC',
    'quem_somos.familias_atendidas': 'Famílias Atendidas',
    'quem_somos.ano_fundacao': 'Ano de Fundação',
    
    // Galeria
    'galeria.titulo': 'Galeria',
    'galeria.descricao': 'Conheça nossos momentos e eventos através das imagens',
    'galeria.imagem_alt': 'Imagem da galeria',
    'galeria.anterior': 'Anterior',
    'galeria.proxima': 'Próxima',
    'galeria.pagina_info': 'Página {atual} de {total}',
    'galeria.vazia_titulo': 'Galeria Vazia',
    'galeria.vazia_descricao': 'Ainda não há imagens na galeria',
    'galeria.carregando_imagem': 'Carregando imagem...',
    'galeria.erro_carregamento': 'Erro ao carregar imagem',
    'galeria.imagem_sem_titulo': 'Imagem sem título',
    'galeria.sem_titulo': 'Sem título',
    
    // Eventos
    'eventos.titulo': 'Eventos',
    'eventos.descricao': 'Fique por dentro dos próximos eventos da comunidade',
    'eventos.ver_detalhes': 'Ver Detalhes',
    'eventos.vazia_titulo': 'Nenhum Evento',
    'eventos.vazia_descricao': 'Não há eventos programados no momento',
    
    // Notícias
    'noticias.titulo': 'Notícias',
    'noticias.descricao': 'Acompanhe as últimas notícias da comunidade',
    'noticias.ler_mais': 'Ler mais',
    'noticias.sem_descricao': 'Sem descrição disponível',
    'noticias.vazia_titulo': 'Nenhuma Notícia',
    'noticias.vazia_descricao': 'Não há notícias publicadas no momento',
    
    // Classificados
    'classificados.titulo': 'Classificados',
    'classificados.descricao': 'Encontre serviços e profissionais da nossa comunidade',
    'classificados.contatar': 'Contatar',
    'classificados.avaliar': 'Avaliar',
    'classificados.limpar_filtro': 'Limpar Filtro',
    'classificados.tornar_associado': 'Tornar-se Associado',
    'classificados.ver_todos': 'Ver Todos',
    'classificados.vazia_titulo': 'Nenhum Classificado',
    'classificados.vazia_descricao': 'Ainda não há serviços cadastrados nos classificados',
    'classificados.vazia_categoria': 'Nenhum serviço nesta categoria',
    'classificados.vazia_categoria_descricao': 'Não encontramos serviços nesta categoria no momento',
    
    // Categorias
    'categorias.construcao': 'Construção',
    'categorias.eletrica': 'Elétrica',
    'categorias.encanamento': 'Encanamento',
    'categorias.limpeza': 'Limpeza',
    'categorias.jardinagem': 'Jardinagem',
    'categorias.outros': 'Outros',
    
    // Parceiros
    'parceiros.titulo': 'Parceiros Comerciais',
    'parceiros.descricao': 'Conheça nossos parceiros e apoiadores',
    'parceiros.logo_alt': 'Logo {nome}',
    'parceiros.vazia_titulo': 'Nenhum Parceiro',
    'parceiros.vazia_descricao': 'Ainda não há parceiros comerciais cadastrados',
    
    // Footer
    'footer.navegacao': 'Navegação',
    'footer.contato_rapido': 'Contato Rápido',
    'footer.direitos_reservados': 'Todos os direitos reservados.',
    'footer.desenvolvido_por': 'Desenvolvido por',
    'footer.cargo_desenvolvedor': 'Desenvolvedora Full Stack',
    
    // Contato
    'contato.endereco': 'Rua Izabel Cristina Ouvina, 112 - Jardim Atlântico Central, Maricá - RJ, 24934-405',
    'contato.telefone': '(21) 97897-9840',
    'contato.email': 'comunicacao@amajac.org.br',
    'contato.enviar_mensagem': 'Enviar Mensagem',
    'contato.titulo': 'Entre em Contato',
    'contato.subtitulo': 'Envie sua mensagem para a AMAJAC',
    
    // Formulários
    'form.nome': 'Nome',
    'form.email': 'Email',
    'form.assunto': 'Assunto',
    'form.mensagem': 'Mensagem',
    'form.placeholder_nome': 'Seu nome completo',
    'form.placeholder_email': 'seu@email.com',
    'form.placeholder_mensagem': 'Digite sua mensagem...',
    'form.selecionar_assunto': 'Selecione um assunto',
    'form.opcoes_assunto.duvida': 'Dúvida',
    'form.opcoes_assunto.sugestao': 'Sugestão',
    'form.opcoes_assunto.reclamacao': 'Reclamação',
    'form.opcoes_assunto.classificado': 'Classificado',
    'form.opcoes_assunto.associacao': 'Associação',
    'form.opcoes_assunto.evento': 'Evento',
    'form.opcoes_assunto.outro': 'Outro',
    'form.erro_campos_obrigatorios': 'Por favor, preencha todos os campos obrigatórios.',
    
    // Avaliação
    'avaliacao.titulo': 'Avaliar Serviço',
    'avaliacao.subtitulo': 'Avalie o serviço: {servico}',
    'avaliacao.nota_label': 'Nota',
    'avaliacao.nome_label': 'Seu Nome',
    'avaliacao.comentario_label': 'Comentário',
    'avaliacao.nome_placeholder': 'Digite seu nome',
    'avaliacao.comentario_placeholder': 'Deixe um comentário sobre o serviço...',
    'avaliacao.nota_selecionada': 'Nota selecionada: {nota} estrela{nota > 1 ? "s" : ""}',
    'avaliacao.enviar': 'Enviar Avaliação',
    'avaliacao.erro_selecionar_nota': 'Por favor, selecione uma nota para avaliar o serviço.',
    'avaliacao.sucesso': 'Avaliação enviada com sucesso! Obrigado pelo seu feedback.'
  },

  en: {
    'nav.inicio': 'Home',
    'nav.quem_somos': 'About Us',
    'nav.galeria': 'Gallery',
    'nav.eventos': 'Events',
    'nav.noticias': 'News',
    'nav.classificados': 'Classifieds',
    'nav.parceiros': 'Partners',
    'nav.contato': 'Contact',
    
    'geral.logo_alt': 'AMAJAC Logo',
    'geral.nome_site': 'AMAJAC',
    'geral.associado': 'Member Area',
    'geral.area_restrita': 'Restricted Area',
    'geral.banner_alt': 'AMAJAC Banner',
    'geral.titulo_portal': 'RESIDENT PORTAL',
    'geral.descricao_site': 'Residents and Friends Association of Jardim Atlântico Central',
    'geral.localizacao': 'ITAIPUAÇU - MARICÁ',
    'geral.descricao_hero': 'We work together to transform our neighborhood through collective actions.',
    'geral.slogan': 'United for a better neighborhood!',
    'geral.erro_banner': 'Error loading banner',
    'geral.erro_imagem': 'Error loading image',
    'geral.enviando': 'Sending...',
    'geral.alternar_idioma': 'Toggle language',
    
    'quem_somos.titulo': 'About Us',
    'quem_somos.subtitulo': 'Learn about the history of the Residents and Friends Association of Jardim Atlântico Central',
    'quem_somos.historia_titulo': 'Our History',
    'quem_somos.historia': 'AMAJAC was founded with the objective of uniting the community and working towards necessary improvements for our neighborhood. Our journey began with a group of residents concerned with the development and quality of life in Jardim Atlântico Central.',
    'quem_somos.missao_titulo': 'Our Mission',
    'quem_somos.missao': 'To represent and unite the residents of Jardim Atlântico Central, promoting actions that enhance quality of life, defending community interests, and fostering sustainable neighborhood development.',
    'quem_somos.valores_titulo': 'Our Values',
    'quem_somos.imagem_alt': 'Image about AMAJAC',
    'quem_somos.familias_atendidas': 'Families Served',
    'quem_somos.ano_fundacao': 'Foundation Year',
    
    'galeria.titulo': 'Gallery',
    'galeria.descricao': 'Get to know our moments and events through images',
    'galeria.imagem_alt': 'Gallery image',
    'galeria.anterior': 'Previous',
    'galeria.proxima': 'Next',
    'galeria.pagina_info': 'Page {atual} of {total}',
    'galeria.vazia_titulo': 'Empty Gallery',
    'galeria.vazia_descricao': 'There are no images in the gallery yet',
    'galeria.carregando_imagem': 'Loading image...',
    'galeria.erro_carregamento': 'Error loading image',
    'galeria.imagem_sem_titulo': 'Image without title',
    'galeria.sem_titulo': 'No title',
    
    'eventos.titulo': 'Events',
    'eventos.descricao': 'Stay tuned for upcoming community events',
    'eventos.ver_detalhes': 'View Details',
    'eventos.vazia_titulo': 'No Events',
    'eventos.vazia_descricao': 'There are no events scheduled at the moment',
    
    'noticias.titulo': 'News',
    'noticias.descricao': 'Follow the latest community news',
    'noticias.ler_mais': 'Read more',
    'noticias.sem_descricao': 'No description available',
    'noticias.vazia_titulo': 'No News',
    'noticias.vazia_descricao': 'There are no news published at the moment',
    
    'classificados.titulo': 'Classifieds',
    'classificados.descricao': 'Find services and professionals in our community',
    'classificados.contatar': 'Contact',
    'classificados.avaliar': 'Rate',
    'classificados.limpar_filtro': 'Clear Filter',
    'classificados.tornar_associado': 'Become a Member',
    'classificados.ver_todos': 'View All',
    'classificados.vazia_titulo': 'No Classifieds',
    'classificados.vazia_descricao': 'There are no services registered in the classifieds yet',
    'classificados.vazia_categoria': 'No services in this category',
    'classificados.vazia_categoria_descricao': 'We found no services in this category at the moment',
    
    'categorias.construcao': 'Construction',
    'categorias.eletrica': 'Electrical',
    'categorias.encanamento': 'Plumbing',
    'categorias.limpeza': 'Cleaning',
    'categorias.jardinagem': 'Gardening',
    'categorias.outros': 'Others',
    
    'parceiros.titulo': 'Commercial Partners',
    'parceiros.descricao': 'Meet our partners and supporters',
    'parceiros.logo_alt': '{name} logo',
    'parceiros.vazia_titulo': 'No Partners',
    'parceiros.vazia_descricao': 'There are no commercial partners registered yet',
    
    'footer.navegacao': 'Navigation',
    'footer.contato_rapido': 'Quick Contact',
    'footer.direitos_reservados': 'All rights reserved.',
    'footer.desenvolvido_por': 'Developed by',
    'footer.cargo_desenvolvedor': 'Full Stack Developer',
    
    'contato.endereco': 'Rua Izabel Cristina Ouvina, 112 - Jardim Atlântico Central, Maricá - RJ, 24934-405',
    'contato.telefone': '(21) 97897-9840',
    'contato.email': 'comunicacao@amajac.org.br',
    'contato.enviar_mensagem': 'Send Message',
    'contato.titulo': 'Contact Us',
    'contato.subtitulo': 'Send your message to AMAJAC',
    
    'form.nome': 'Name',
    'form.email': 'Email',
    'form.assunto': 'Subject',
    'form.mensagem': 'Message',
    'form.placeholder_nome': 'Your full name',
    'form.placeholder_email': 'your@email.com',
    'form.placeholder_mensagem': 'Type your message...',
    'form.selecionar_assunto': 'Select a subject',
    'form.opcoes_assunto.duvida': 'Question',
    'form.opcoes_assunto.sugestao': 'Suggestion',
    'form.opcoes_assunto.reclamacao': 'Complaint',
    'form.opcoes_assunto.classificado': 'Classified',
    'form.opcoes_assunto.associacao': 'Association',
    'form.opcoes_assunto.evento': 'Event',
    'form.opcoes_assunto.outro': 'Other',
    'form.erro_campos_obrigatorios': 'Please fill in all required fields.',
    
    'avaliacao.titulo': 'Rate Service',
    'avaliacao.subtitulo': 'Rate the service: {servico}',
    'avaliacao.nota_label': 'Rating',
    'avaliacao.nome_label': 'Your Name',
    'avaliacao.comentario_label': 'Comment',
    'avaliacao.nome_placeholder': 'Enter your name',
    'avaliacao.comentario_placeholder': 'Leave a comment about the service...',
    'avaliacao.nota_selecionada': 'Selected rating: {nota} star{nota > 1 ? "s" : ""}',
    'avaliacao.enviar': 'Send Rating',
    'avaliacao.erro_selecionar_nota': 'Please select a rating to evaluate the service.',
    'avaliacao.sucesso': 'Rating sent successfully! Thank you for your feedback.'
  },

  es: {
    'nav.inicio': 'Inicio',
    'nav.quem_somos': 'Quiénes Somos',
    'nav.galeria': 'Galería',
    'nav.eventos': 'Eventos',
    'nav.noticias': 'Noticias',
    'nav.classificados': 'Clasificados',
    'nav.parceiros': 'Socios',
    'nav.contato': 'Contacto',
    
    'geral.logo_alt': 'Logo AMAJAC',
    'geral.nome_site': 'AMAJAC',
    'geral.associado': 'Área del Socio',
    'geral.area_restrita': 'Área Restringida',
    'geral.banner_alt': 'Banner AMAJAC',
    'geral.titulo_portal': 'PORTAL DEL RESIDENTE',
    'geral.descricao_site': 'Asociación de Residentes y Amigos del Jardín Atlántico Central',
    'geral.localizacao': 'ITAIPUAÇU - MARICÁ',
    'geral.descricao_hero': 'Trabajamos juntos para transformar nuestro barrio a través de acciones colectivas.',
    'geral.slogan': '¡Unidos por un barrio mejor!',
    'geral.erro_banner': 'Error al cargar el banner',
    'geral.erro_imagem': 'Error al cargar la imagen',
    'geral.enviando': 'Enviando...',
    'geral.alternar_idioma': 'Cambiar idioma',
    
    'quem_somos.titulo': 'Quiénes Somos',
    'quem_somos.subtitulo': 'Conozca la historia de la Asociación de Residentes y Amigos del Barrio Jardín Atlántico Central',
    'quem_somos.historia_titulo': 'Nuestra Historia',
    'quem_somos.historia': 'AMAJAC fue fundada con el objetivo de unir a la comunidad y trabajar en pro de las mejoras necesarias para nuestro barrio. Nuestra trayectoria comenzó con un grupo de residentes preocupados por el desarrollo y la calidad de vida en el Jardín Atlántico Central.',
    'quem_somos.missao_titulo': 'Nuestra Misión',
    'quem_somos.missao': 'Representar y unir a los residentes del Jardín Atlántico Central, promoviendo acciones que mejoren la calidad de vida, defendiendo los intereses de la comunidad y fomentando el desarrollo sostenible del barrio.',
    'quem_somos.valores_titulo': 'Nuestros Valores',
    'quem_somos.imagem_alt': 'Imagen sobre AMAJAC',
    'quem_somos.familias_atendidas': 'Familias Atendidas',
    'quem_somos.ano_fundacao': 'Año de Fundación',
    
    'galeria.titulo': 'Galería',
    'galeria.descricao': 'Conozca nuestros momentos y eventos a través de las imágenes',
    'galeria.imagem_alt': 'Imagen de la galería',
    'galeria.anterior': 'Anterior',
    'galeria.proxima': 'Siguiente',
    'galeria.pagina_info': 'Página {atual} de {total}',
    'galeria.vazia_titulo': 'Galería Vacía',
    'galeria.vazia_descricao': 'Aún no hay imágenes en la galería',
    'galeria.carregando_imagem': 'Cargando imagen...',
    'galeria.erro_carregamento': 'Error al cargar la imagen',
    'galeria.imagem_sem_titulo': 'Imagen sin título',
    'galeria.sem_titulo': 'Sin título',
    
    'eventos.titulo': 'Eventos',
    'eventos.descricao': 'Manténgase informado sobre los próximos eventos de la comunidad',
    'eventos.ver_detalhes': 'Ver Detalles',
    'eventos.vazia_titulo': 'Ningún Evento',
    'eventos.vazia_descricao': 'No hay eventos programados en este momento',
    
    'noticias.titulo': 'Noticias',
    'noticias.descricao': 'Siga las últimas noticias de la comunidad',
    'noticias.ler_mais': 'Leer más',
    'noticias.sem_descricao': 'Sin descripción disponible',
    'noticias.vazia_titulo': 'Ninguna Noticia',
    'noticias.vazia_descricao': 'No hay noticias publicadas en este momento',
    
    'classificados.titulo': 'Clasificados',
    'classificados.descricao': 'Encuentre servicios y profesionales de nuestra comunidad',
    'classificados.contatar': 'Contactar',
    'classificados.avaliar': 'Evaluar',
    'classificados.limpar_filtro': 'Limpiar Filtro',
    'classificados.tornar_associado': 'Hacerse Socio',
    'classificados.ver_todos': 'Ver Todos',
    'classificados.vazia_titulo': 'Ningún Clasificado',
    'classificados.vazia_descricao': 'Aún no hay servicios registrados en los clasificados',
    'classificados.vazia_categoria': 'Ningún servicio en esta categoría',
    'classificados.vazia_categoria_descricao': 'No encontramos servicios en esta categoría en este momento',
    
    'categorias.construcao': 'Construcción',
    'categorias.eletrica': 'Eléctrica',
    'categorias.encanamento': 'Fontanería',
    'categorias.limpeza': 'Limpieza',
    'categorias.jardinagem': 'Jardinería',
    'categorias.outros': 'Otros',
    
    'parceiros.titulo': 'Socios Comerciales',
    'parceiros.descricao': 'Conozca nuestros socios y colaboradores',
    'parceiros.logo_alt': 'Logo {nombre}',
    'parceiros.vazia_titulo': 'Ningún Socio',
    'parceiros.vazia_descricao': 'Aún no hay socios comerciales registrados',
    
    'footer.navegacao': 'Navegación',
    'footer.contato_rapido': 'Contacto Rápido',
    'footer.direitos_reservados': 'Todos los derechos reservados.',
    'footer.desenvolvido_por': 'Desarrollado por',
    'footer.cargo_desenvolvedor': 'Desarrolladora Full Stack',
    
    'contato.endereco': 'Rua Izabel Cristina Ouvina, 112 - Jardim Atlântico Central, Maricá - RJ, 24934-405',
    'contato.telefone': '(21) 97897-9840',
    'contato.email': 'comunicacao@amajac.org.br',
    'contato.enviar_mensagem': 'Enviar Mensaje',
    'contato.titulo': 'Contáctenos',
    'contato.subtitulo': 'Envíe su mensaje a AMAJAC',
    
    'form.nome': 'Nombre',
    'form.email': 'Correo Electrónico',
    'form.assunto': 'Asunto',
    'form.mensagem': 'Mensaje',
    'form.placeholder_nome': 'Su nombre completo',
    'form.placeholder_email': 'su@email.com',
    'form.placeholder_mensagem': 'Escriba su mensaje...',
    'form.selecionar_assunto': 'Seleccione un asunto',
    'form.opcoes_assunto.duvida': 'Duda',
    'form.opcoes_assunto.sugestao': 'Sugerencia',
    'form.opcoes_assunto.reclamacao': 'Reclamación',
    'form.opcoes_assunto.classificado': 'Clasificado',
    'form.opcoes_assunto.associacao': 'Asociación',
    'form.opcoes_assunto.evento': 'Evento',
    'form.opcoes_assunto.outro': 'Otro',
    'form.erro_campos_obrigatorios': 'Por favor, complete todos los campos obligatorios.',
    
    'avaliacao.titulo': 'Evaluar Servicio',
    'avaliacao.subtitulo': 'Evalúe el servicio: {servico}',
    'avaliacao.nota_label': 'Calificación',
    'avaliacao.nome_label': 'Su Nombre',
    'avaliacao.comentario_label': 'Comentario',
    'avaliacao.nome_placeholder': 'Ingrese su nombre',
    'avaliacao.comentario_placeholder': 'Deje un comentario sobre el servicio...',
    'avaliacao.nota_selecionada': 'Calificación seleccionada: {nota} estrella{nota > 1 ? "s" : ""}',
    'avaliacao.enviar': 'Enviar Evaluación',
    'avaliacao.erro_selecionar_nota': 'Por favor, seleccione una calificación para evaluar el servicio.',
    'avaliacao.sucesso': '¡Evaluación enviada con éxito! Gracias por sus comentarios.'
  },

  fr: {
    'nav.inicio': 'Accueil',
    'nav.quem_somos': 'Qui Sommes-Nous',
    'nav.galeria': 'Galerie',
    'nav.eventos': 'Événements',
    'nav.noticias': 'Actualités',
    'nav.classificados': 'Annonces',
    'nav.parceiros': 'Partenaires',
    'nav.contato': 'Contact',
    
    'geral.logo_alt': 'Logo AMAJAC',
    'geral.nome_site': 'AMAJAC',
    'geral.associado': 'Espace Membre',
    'geral.area_restrita': 'Zone Restreinte',
    'geral.banner_alt': 'Bannière AMAJAC',
    'geral.titulo_portal': 'PORTAL DU RÉSIDENT',
    'geral.descricao_site': 'Association des Résidents et Amis du Jardim Atlântico Central',
    'geral.localizacao': 'ITAIPUAÇU - MARICÁ',
    'geral.descricao_hero': 'Nous travaillons ensemble pour transformer notre quartier à travers des actions collectives.',
    'geral.slogan': 'Unis pour un meilleur quartier !',
    'geral.erro_banner': 'Erreur de chargement de la bannière',
    'geral.erro_imagem': 'Erreur de chargement de l\'image',
    'geral.enviando': 'Envoi en cours...',
    'geral.alternar_idioma': 'Changer de langue',
    
    'quem_somos.titulo': 'Qui Sommes-Nous',
    'quem_somos.subtitulo': 'Découvrez l\'histoire de l\'Association des Résidents et Amis du Quartier Jardim Atlântico Central',
    'quem_somos.historia_titulo': 'Notre Histoire',
    'quem_somos.historia': 'AMAJAC a été fondée dans le but d\'unir la communauté et de travailler pour les améliorations nécessaires de notre quartier. Notre parcours a commencé avec un groupe de résidents préoccupés par le développement et la qualité de vie dans le Jardim Atlântico Central.',
    'quem_somos.missao_titulo': 'Notre Mission',
    'quem_somos.missao': 'Représenter et unir les résidents du Jardim Atlântico Central, en promouvant des actions qui améliorent la qualité de vie, en défendant les intérêts de la communauté et en favorisant le développement durable du quartier.',
    'quem_somos.valores_titulo': 'Nos Valeurs',
    'quem_somos.imagem_alt': 'Image sur AMAJAC',
    'quem_somos.familias_atendidas': 'Familles Desservies',
    'quem_somos.ano_fundacao': 'Année de Fondation',
    
    'galeria.titulo': 'Galerie',
    'galeria.descricao': 'Découvrez nos moments et événements à travers les images',
    'galeria.imagem_alt': 'Image de la galerie',
    'galeria.anterior': 'Précédent',
    'galeria.proxima': 'Suivant',
    'galeria.pagina_info': 'Page {atual} sur {total}',
    'galeria.vazia_titulo': 'Galerie Vide',
    'galeria.vazia_descricao': 'Il n\'y a pas encore d\'images dans la galerie',
    'galeria.carregando_imagem': 'Chargement de l\'image...',
    'galeria.erro_carregamento': 'Erreur de chargement de l\'image',
    'galeria.imagem_sem_titulo': 'Image sans titre',
    'galeria.sem_titulo': 'Sans titre',
    
    'eventos.titulo': 'Événements',
    'eventos.descricao': 'Restez informé des prochains événements de la communauté',
    'eventos.ver_detalhes': 'Voir les Détails',
    'eventos.vazia_titulo': 'Aucun Événement',
    'eventos.vazia_descricao': 'Il n\'y a pas d\'événements programmés pour le moment',
    
    'noticias.titulo': 'Actualités',
    'noticias.descricao': 'Suivez les dernières actualités de la communauté',
    'noticias.ler_mais': 'Lire plus',
    'noticias.sem_descricao': 'Aucune description disponible',
    'noticias.vazia_titulo': 'Aucune Actualité',
    'noticias.vazia_descricao': 'Il n\'y a pas d\'actualités publiées pour le moment',
    
    'classificados.titulo': 'Annonces',
    'classificados.descricao': 'Trouvez des services et des professionnels dans notre communauté',
    'classificados.contatar': 'Contacter',
    'classificados.avaliar': 'Évaluer',
    'classificados.limpar_filtro': 'Effacer le Filtre',
    'classificados.tornar_associado': 'Devenir Membre',
    'classificados.ver_todos': 'Voir Tous',
    'classificados.vazia_titulo': 'Aucune Annonce',
    'classificados.vazia_descricao': 'Il n\'y a pas encore de services enregistrés dans les annonces',
    'classificados.vazia_categoria': 'Aucun service dans cette catégorie',
    'classificados.vazia_categoria_descricao': 'Nous n\'avons trouvé aucun service dans cette catégorie pour le moment',
    
    'categorias.construcao': 'Construction',
    'categorias.eletrica': 'Électricité',
    'categorias.encanamento': 'Plomberie',
    'categorias.limpeza': 'Nettoyage',
    'categorias.jardinagem': 'Jardinage',
    'categorias.outros': 'Autres',
    
    'parceiros.titulo': 'Partenaires Commerciaux',
    'parceiros.descricao': 'Rencontrez nos partenaires et soutiens',
    'parceiros.logo_alt': 'Logo {nom}',
    'parceiros.vazia_titulo': 'Aucun Partenaire',
    'parceiros.vazia_descricao': 'Il n\'y a pas encore de partenaires commerciaux enregistrés',
    
    'footer.navegacao': 'Navigation',
    'footer.contato_rapido': 'Contact Rapide',
    'footer.direitos_reservados': 'Tous droits réservés.',
    'footer.desenvolvido_por': 'Développé par',
    'footer.cargo_desenvolvedor': 'Développeuse Full Stack',
    
    'contato.endereco': 'Rua Izabel Cristina Ouvina, 112 - Jardim Atlântico Central, Maricá - RJ, 24934-405',
    'contato.telefone': '(21) 97897-9840',
    'contato.email': 'comunicacao@amajac.org.br',
    'contato.enviar_mensagem': 'Envoyer le Message',
    'contato.titulo': 'Contactez-Nous',
    'contato.subtitulo': 'Envoyez votre message à AMAJAC',
    
    'form.nome': 'Nom',
    'form.email': 'Email',
    'form.assunto': 'Sujet',
    'form.mensagem': 'Message',
    'form.placeholder_nome': 'Votre nom complet',
    'form.placeholder_email': 'votre@email.com',
    'form.placeholder_mensagem': 'Tapez votre message...',
    'form.selecionar_assunto': 'Sélectionnez un sujet',
    'form.opcoes_assunto.duvida': 'Question',
    'form.opcoes_assunto.sugestao': 'Suggestion',
    'form.opcoes_assunto.reclamacao': 'Réclamation',
    'form.opcoes_assunto.classificado': 'Annonce',
    'form.opcoes_assunto.associacao': 'Association',
    'form.opcoes_assunto.evento': 'Événement',
    'form.opcoes_assunto.outro': 'Autre',
    'form.erro_campos_obrigatorios': 'Veuillez remplir tous les champs obligatoires.',
    
    'avaliacao.titulo': 'Évaluer le Service',
    'avaliacao.subtitulo': 'Évaluez le service: {servico}',
    'avaliacao.nota_label': 'Note',
    'avaliacao.nome_label': 'Votre Nom',
    'avaliacao.comentario_label': 'Commentaire',
    'avaliacao.nome_placeholder': 'Entrez votre nom',
    'avaliacao.comentario_placeholder': 'Laissez un commentaire sur le service...',
    'avaliacao.nota_selecionada': 'Note sélectionnée: {nota} étoile{nota > 1 ? "s" : ""}',
    'avaliacao.enviar': 'Envoyer l\'Évaluation',
    'avaliacao.erro_selecionar_nota': 'Veuillez sélectionner une note pour évaluer le service.',
    'avaliacao.sucesso': 'Évaluation envoyée avec succès ! Merci pour vos commentaires.'
  }
}

// Estado global do locale
const currentLocale = ref('pt')

// Idiomas disponíveis
const availableLocales = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
]

export function useI18n() {
  const t = (key, params = {}) => {
    let message = translations[currentLocale.value]?.[key] || translations.pt[key] || key
    
    // Substitui parâmetros na mensagem
    Object.keys(params).forEach(param => {
      const regex = new RegExp(`\\{${param}\\}`, 'g')
      message = message.replace(regex, params[param])
    })
    
    return message
  }

  const locale = computed(() => currentLocale.value)

  const setLocale = (newLocale) => {
    if (translations[newLocale]) {
      currentLocale.value = newLocale
      localStorage.setItem('user-locale', newLocale)
      document.documentElement.lang = newLocale
      
      // Dispara evento customizado para notificar mudanças de idioma
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLocale }))
    }
  }

  // Inicializar locale
  const initLocale = () => {
    const savedLocale = localStorage.getItem('user-locale')
    const browserLocale = navigator.language.split('-')[0]
    
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale)
    } else if (translations[browserLocale]) {
      setLocale(browserLocale)
    } else {
      setLocale('pt')
    }
  }

  // Inicializar quando o composable for usado
  initLocale()

  return {
    t,
    locale,
    setLocale,
    availableLocales
  }
}