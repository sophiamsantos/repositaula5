// =============================================================
// CineList - Aplicação principal
// Estrutura JSON + renderização dinâmica de páginas
// =============================================================

// Pôsteres oficiais em português brasileiro (Wikipédia PT)
const POSTERS = {
    rapunzel:           "https://upload.wikimedia.org/wikipedia/pt/9/99/Tangled_Disney.jpg",
    divertidamente:     "https://upload.wikimedia.org/wikipedia/pt/f/f6/Inside_Out_%28filme%29.jpg",
    meuMalvadoFavorito: "https://upload.wikimedia.org/wikipedia/pt/7/7f/Despicable_Me_poster.jpg",
    zootopia:           "https://upload.wikimedia.org/wikipedia/pt/3/3b/ZootopiaOficialPoster.jpg",
    todosMenosVoce:     "https://upload.wikimedia.org/wikipedia/pt/5/56/Anyone_But_You_poster.jpg",
    amorComDataMarcada: "https://upload.wikimedia.org/wikipedia/pt/6/60/Marry_Me_%282022%29.jpg",
    oPlanoImperfeito:   "https://upload.wikimedia.org/wikipedia/en/d/d9/The_Hating_Game_film_poster.png",
    simplesmenteAcontece:"https://upload.wikimedia.org/wikipedia/pt/2/27/A_Walk_to_Remember_-_P%C3%B4ster.jpg",
    comoEuEraAntes:     "https://upload.wikimedia.org/wikipedia/pt/f/fd/Me_Before_You_%28film%29.jpg",
    aCulpaEDasEstrelas: "https://upload.wikimedia.org/wikipedia/pt/0/08/The_Fault_in_Our_Stars_%28filme%29.jpg",
    diarioDeUmaPaixao:  "https://upload.wikimedia.org/wikipedia/pt/3/32/The_Notebook_p%C3%B4ster.jpg",
    deRepente30:        "https://upload.wikimedia.org/wikipedia/pt/d/de/13_going_on_30.jpg",
    invocacaoDoMal:     "https://upload.wikimedia.org/wikipedia/pt/a/ac/The_Conjuring.jpg",
    aFreira:            "https://upload.wikimedia.org/wikipedia/pt/1/1b/The_Nun.jpg",
    sorria:             "https://upload.wikimedia.org/wikipedia/pt/4/41/Smile_2022.jpg",
    panico:             "https://upload.wikimedia.org/wikipedia/pt/0/0e/Scream-5.png"
};

// Fotos dos atores principais (Wikipedia / Wikimedia Commons)
const ACTORS = {
    mandyMoore:      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mandy_Moore_at_SXSW_2018_%2825904503147%29_%28cropped%29.jpg/960px-Mandy_Moore_at_SXSW_2018_%2825904503147%29_%28cropped%29.jpg",
    zacharyLevi:     "https://upload.wikimedia.org/wikipedia/commons/3/30/Zachary_Levi_%2854238375564%29.jpg",
    amyPoehler:      "https://upload.wikimedia.org/wikipedia/commons/d/df/Amy_Poehler_%2853671989427%29_cropped.jpg",
    steveCarell:     "https://upload.wikimedia.org/wikipedia/commons/e/e8/Steve_Carell_-_The_40-Year-Old-Virgin.jpg",
    ginniferGoodwin: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ginnifer_Goodwin_by_Gage_Skidmore_%28cropped%29.jpg",
    jasonBateman:    "https://upload.wikimedia.org/wikipedia/commons/8/87/Jason_Batement_at_the_Air_Premiere_%28cropped%29.jpg",
    sydneySweeney:   "https://upload.wikimedia.org/wikipedia/commons/2/2f/Sydney_Sweeney_at_the_2024_Toronto_International_Film_Festival_%28cropped%2C_rotated%29.jpg",
    glenPowell:      "https://upload.wikimedia.org/wikipedia/commons/9/9f/Glen_Powell_by_Gage_Skidmore.jpg",
    jenniferLopez:   "https://upload.wikimedia.org/wikipedia/commons/6/6e/Jennifer_Lopez_at_the_2025_Sundance_Film_Festival_%28cropped_3%29.jpg",
    owenWilson:      "https://upload.wikimedia.org/wikipedia/commons/4/49/Owen_Wilson_Cannes_2011.jpg",
    lucyHale:        "https://upload.wikimedia.org/wikipedia/commons/9/95/Lucy_Hale_in_2018.jpg",
    shaneWest:       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Shane_West_April_2015_%28cropped-J1%29.jpg/500px-Shane_West_April_2015_%28cropped-J1%29.jpg",
    emiliaClarke:    "https://upload.wikimedia.org/wikipedia/commons/8/8d/Emilia_Clarke_Cannes_2018_%28cropped%29.jpg",
    samClaflin:      "https://upload.wikimedia.org/wikipedia/commons/8/82/Sam_Claflin_2014.jpg",
    shaileneWoodley: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Shailene_Woodley_%E1%BA%A5t_the_82nd_Venice_Film_Festival_%28cropped%29.jpg",
    anselElgort:     "https://upload.wikimedia.org/wikipedia/commons/b/b1/Ansel_Elgort_in_2019.jpg",
    ryanGosling:     "https://upload.wikimedia.org/wikipedia/commons/6/62/GoslingBFI081223_%2822_of_30%29_%2853388157347%29_%28cropped%29.jpg",
    rachelMcAdams:   "https://upload.wikimedia.org/wikipedia/commons/9/96/Rachel_McAdams_-_Walk_of_Fame.jpg",
    jenniferGarner:  "https://upload.wikimedia.org/wikipedia/commons/3/3d/Jennifer_Garner_-_2024_%2854106107278%29_%28cropped%29.jpg",
    markRuffalo:     "https://upload.wikimedia.org/wikipedia/commons/1/11/Mark_Ruffalo_%2836201774756%29_%28cropped%29.jpg",
    patrickWilson:   "https://upload.wikimedia.org/wikipedia/commons/6/68/Patrick_Wilson_at_Sundance_Film_Festival_2026-3_%28cropped%29.jpg",
    veraFarmiga:     "https://upload.wikimedia.org/wikipedia/commons/5/5b/Vera_Farmiga_%2843676389342%29.jpg",
    taissaFarmiga:   "https://upload.wikimedia.org/wikipedia/commons/3/32/Taissa_Farmiga_%282016%29_%28cropped%29.jpg",
    sosieBacon:      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Scoot_McNairy%27s_partner_at_the_2024_Toronto_International_Film_Festival._01.jpg/3840px-Scoot_McNairy%27s_partner_at_the_2024_Toronto_International_Film_Festival._01.jpg",
    neveCampbell:    "https://upload.wikimedia.org/wikipedia/commons/2/2d/Neve_Campbell_04_%2821268333696%29.jpg",
    courteneyCox:    "https://upload.wikimedia.org/wikipedia/commons/8/83/Courteney_Cox_%2710_PaleyFest.jpg"
};

const dados = {
    categorias: [
        {
            id: "desenho",
            nome: "Desenho Animado",
            descricao: "Animações para todas as idades.",
            cor: "#f59e0b"
        },
        {
            id: "comedia-romantica",
            nome: "Comédia Romântica",
            descricao: "Histórias divertidas que aquecem o coração.",
            cor: "#ec4899"
        },
        {
            id: "romance",
            nome: "Romance",
            descricao: "Amores inesquecíveis e dramas marcantes.",
            cor: "#dc2626"
        },
        {
            id: "terror",
            nome: "Terror",
            descricao: "Sustos, suspense e arrepios garantidos.",
            cor: "#14152b"
        }
    ],

    titulos: [
        // ===================== DESENHO ANIMADO =====================
        {
            id: 1,
            categoria: "desenho",
            nome: "Enrolados (Rapunzel)",
            descricao: "Princesa de cabelos mágicos foge da torre em busca da liberdade.",
            conteudo: "Rapunzel é uma princesa de cabelos mágicos mantida em uma torre por uma vilã. Quando o ladrão Flynn Rider invade seu refúgio, ela parte em uma aventura cheia de descobertas, com a ajuda dele e do cavalo Maximus.",
            tipo: "Filme",
            genero: "Animação / Aventura",
            ano: 2010,
            duracao: "1h 40min",
            diretor: "Nathan Greno, Byron Howard",
            elenco: "Mandy Moore, Zachary Levi, Donna Murphy",
            idioma: "Inglês / Português",
            classificacao: "Livre",
            nota: 8.6,
            destaque: false,
            data: "2025-04-20",
            imagem_principal: POSTERS.rapunzel,
            fotos: [
                { id: 1, titulo: "Pôster oficial",                    imagem: POSTERS.rapunzel },
                { id: 2, titulo: "Mandy Moore (voz da Rapunzel)",     imagem: ACTORS.mandyMoore },
                { id: 3, titulo: "Zachary Levi (voz de Flynn Rider)", imagem: ACTORS.zacharyLevi }
            ]
        },
        {
            id: 2,
            categoria: "desenho",
            nome: "Divertida Mente",
            descricao: "Cinco emoções comandam a mente de uma garota em transição.",
            conteudo: "Riley acabou de se mudar com a família e suas emoções — Alegria, Tristeza, Medo, Raiva e Nojinho — precisam aprender a trabalhar juntas em meio a uma fase difícil. Uma jornada criativa pelos cantos da mente humana.",
            tipo: "Filme",
            genero: "Animação / Família",
            ano: 2015,
            duracao: "1h 35min",
            diretor: "Pete Docter, Ronnie Del Carmen",
            elenco: "Amy Poehler, Phyllis Smith, Bill Hader",
            idioma: "Inglês / Português",
            classificacao: "Livre",
            nota: 8.9,
            destaque: true,
            data: "2025-04-18",
            imagem_principal: POSTERS.divertidamente,
            fotos: [
                { id: 1, titulo: "Pôster oficial",               imagem: POSTERS.divertidamente },
                { id: 2, titulo: "Amy Poehler (voz da Alegria)", imagem: ACTORS.amyPoehler }
            ]
        },
        {
            id: 3,
            categoria: "desenho",
            nome: "Meu Malvado Favorito",
            descricao: "Vilão se transforma ao adotar três órfãs encantadoras.",
            conteudo: "Gru, um supervilão ranzinza, planeja roubar a Lua para entrar para a história, mas seus planos mudam quando adota Margo, Edith e Agnes. Com seus minions, descobre que ser pai pode ser a maior aventura.",
            tipo: "Filme",
            genero: "Animação / Comédia",
            ano: 2010,
            duracao: "1h 35min",
            diretor: "Pierre Coffin, Chris Renaud",
            elenco: "Steve Carell, Jason Segel, Russell Brand",
            idioma: "Inglês / Português",
            classificacao: "Livre",
            nota: 8.4,
            destaque: false,
            data: "2025-04-16",
            imagem_principal: POSTERS.meuMalvadoFavorito,
            fotos: [
                { id: 1, titulo: "Pôster oficial",            imagem: POSTERS.meuMalvadoFavorito },
                { id: 2, titulo: "Steve Carell (voz de Gru)", imagem: ACTORS.steveCarell }
            ]
        },
        {
            id: 4,
            categoria: "desenho",
            nome: "Zootopia: Essa Cidade é o Bicho",
            descricao: "Coelha policial e raposa trapaceira desvendam mistério em metrópole de animais.",
            conteudo: "Em Zootopia, uma cidade onde animais convivem como pessoas, a coelha Judy Hopps se torna a primeira da espécie a entrar na polícia. Ao investigar um caso, faz dupla improvável com a raposa Nick Wilde.",
            tipo: "Filme",
            genero: "Animação / Aventura",
            ano: 2016,
            duracao: "1h 48min",
            diretor: "Byron Howard, Rich Moore",
            elenco: "Ginnifer Goodwin, Jason Bateman, Idris Elba",
            idioma: "Inglês / Português",
            classificacao: "Livre",
            nota: 8.7,
            destaque: true,
            data: "2025-04-15",
            imagem_principal: POSTERS.zootopia,
            fotos: [
                { id: 1, titulo: "Pôster oficial",                       imagem: POSTERS.zootopia },
                { id: 2, titulo: "Ginnifer Goodwin (voz de Judy Hopps)", imagem: ACTORS.ginniferGoodwin },
                { id: 3, titulo: "Jason Bateman (voz de Nick Wilde)",    imagem: ACTORS.jasonBateman }
            ]
        },

        // ===================== COMÉDIA ROMÂNTICA =====================
        {
            id: 5,
            categoria: "comedia-romantica",
            nome: "Todos Menos Você",
            descricao: "Ex-paquera fingem namorar em casamento na Austrália.",
            conteudo: "Bea e Ben tiveram um encontro perfeito que terminou mal. Quando se reencontram em um casamento na Austrália, decidem fingir um relacionamento para acalmar familiares. Inspirado em Shakespeare.",
            tipo: "Filme",
            genero: "Comédia / Romance",
            ano: 2023,
            duracao: "1h 43min",
            diretor: "Will Gluck",
            elenco: "Sydney Sweeney, Glen Powell, Alexandra Shipp",
            idioma: "Inglês",
            classificacao: "14 anos",
            nota: 7.7,
            destaque: true,
            data: "2025-04-10",
            imagem_principal: POSTERS.todosMenosVoce,
            fotos: [
                { id: 1, titulo: "Pôster oficial",          imagem: POSTERS.todosMenosVoce },
                { id: 2, titulo: "Sydney Sweeney como Bea", imagem: ACTORS.sydneySweeney },
                { id: 3, titulo: "Glen Powell como Ben",    imagem: ACTORS.glenPowell }
            ]
        },
        {
            id: 6,
            categoria: "comedia-romantica",
            nome: "Amor com Data Marcada",
            descricao: "Estrela pop escolhe casar com fã desconhecido durante show.",
            conteudo: "Kat Valdez é uma cantora prestes a se casar ao vivo no palco. Ao descobrir uma traição minutos antes, ela escolhe um homem aleatório da plateia, Charlie, e se casa com ele em pleno show.",
            tipo: "Filme",
            genero: "Comédia / Romance / Musical",
            ano: 2022,
            duracao: "1h 52min",
            diretor: "Kat Coiro",
            elenco: "Jennifer Lopez, Owen Wilson, Maluma",
            idioma: "Inglês",
            classificacao: "Livre",
            nota: 7.0,
            destaque: false,
            data: "2025-04-08",
            imagem_principal: POSTERS.amorComDataMarcada,
            fotos: [
                { id: 1, titulo: "Pôster oficial",                 imagem: POSTERS.amorComDataMarcada },
                { id: 2, titulo: "Jennifer Lopez como Kat Valdez", imagem: ACTORS.jenniferLopez },
                { id: 3, titulo: "Owen Wilson como Charlie",       imagem: ACTORS.owenWilson }
            ]
        },
        {
            id: 7,
            categoria: "comedia-romantica",
            nome: "O Plano Imperfeito",
            descricao: "Colegas de trabalho rivais descobrem sentimentos durante briga por promoção.",
            conteudo: "Lucy e Joshua trabalham em uma editora e mal podem se ver. Quando concorrem à mesma promoção, sua disputa profissional se transforma em algo que nenhum dos dois esperava sentir.",
            tipo: "Filme",
            genero: "Comédia / Romance",
            ano: 2021,
            duracao: "1h 42min",
            diretor: "Peter Hutchings",
            elenco: "Lucy Hale, Austin Stowell, Damon Daunno",
            idioma: "Inglês",
            classificacao: "14 anos",
            nota: 6.5,
            destaque: false,
            data: "2025-04-05",
            imagem_principal: POSTERS.oPlanoImperfeito,
            fotos: [
                { id: 1, titulo: "Pôster oficial",             imagem: POSTERS.oPlanoImperfeito },
                { id: 2, titulo: "Lucy Hale como Lucy Hutton", imagem: ACTORS.lucyHale }
            ]
        },
        {
            id: 8,
            categoria: "comedia-romantica",
            nome: "Simplesmente Acontece",
            descricao: "Garoto popular se apaixona pela jovem religiosa que ele não esperava.",
            conteudo: "Landon Carter é forçado a participar da peça da escola e acaba conhecendo Jamie Sullivan, uma estudante simples que muda completamente sua visão sobre amor, fé e propósito.",
            tipo: "Filme",
            genero: "Comédia Romântica / Drama",
            ano: 2002,
            duracao: "1h 41min",
            diretor: "Adam Shankman",
            elenco: "Mandy Moore, Shane West, Peter Coyote",
            idioma: "Inglês",
            classificacao: "Livre",
            nota: 7.8,
            destaque: false,
            data: "2025-03-25",
            imagem_principal: POSTERS.simplesmenteAcontece,
            fotos: [
                { id: 1, titulo: "Pôster oficial",                  imagem: POSTERS.simplesmenteAcontece },
                { id: 2, titulo: "Mandy Moore como Jamie Sullivan", imagem: ACTORS.mandyMoore },
                { id: 3, titulo: "Shane West como Landon Carter",   imagem: ACTORS.shaneWest }
            ]
        },

        // ===================== ROMANCE =====================
        {
            id: 9,
            categoria: "romance",
            nome: "Como Eu Era Antes de Você",
            descricao: "Cuidadora ensina paciente tetraplégico a aproveitar a vida.",
            conteudo: "Louisa Clark, jovem alegre e desempregada, é contratada para cuidar de Will Traynor, um homem rico que ficou paraplégico após um acidente. Entre eles, nasce um amor que muda a forma como ambos enxergam a vida.",
            tipo: "Filme",
            genero: "Romance / Drama",
            ano: 2016,
            duracao: "1h 50min",
            diretor: "Thea Sharrock",
            elenco: "Emilia Clarke, Sam Claflin, Janet McTeer",
            idioma: "Inglês",
            classificacao: "12 anos",
            nota: 8.0,
            destaque: false,
            data: "2025-03-22",
            imagem_principal: POSTERS.comoEuEraAntes,
            fotos: [
                { id: 1, titulo: "Pôster oficial",                imagem: POSTERS.comoEuEraAntes },
                { id: 2, titulo: "Emilia Clarke como Lou Clark",  imagem: ACTORS.emiliaClarke },
                { id: 3, titulo: "Sam Claflin como Will Traynor", imagem: ACTORS.samClaflin }
            ]
        },
        {
            id: 10,
            categoria: "romance",
            nome: "A Culpa é das Estrelas",
            descricao: "Dois adolescentes com câncer vivem amor intenso e marcante.",
            conteudo: "Hazel e Gus se conhecem em um grupo de apoio para jovens com câncer. Apesar das circunstâncias difíceis, embarcam em uma jornada de descobertas, viagens e amor que muda a perspectiva de ambos sobre a vida.",
            tipo: "Filme",
            genero: "Romance / Drama",
            ano: 2014,
            duracao: "2h 06min",
            diretor: "Josh Boone",
            elenco: "Shailene Woodley, Ansel Elgort, Laura Dern",
            idioma: "Inglês",
            classificacao: "12 anos",
            nota: 8.2,
            destaque: false,
            data: "2025-03-20",
            imagem_principal: POSTERS.aCulpaEDasEstrelas,
            fotos: [
                { id: 1, titulo: "Pôster oficial",                    imagem: POSTERS.aCulpaEDasEstrelas },
                { id: 2, titulo: "Shailene Woodley como Hazel",       imagem: ACTORS.shaileneWoodley },
                { id: 3, titulo: "Ansel Elgort como Augustus Waters", imagem: ACTORS.anselElgort }
            ]
        },
        {
            id: 11,
            categoria: "romance",
            nome: "Diário de Uma Paixão",
            descricao: "Romance épico entre dois jovens de mundos diferentes que se reencontram.",
            conteudo: "Noah e Allie vivem um verão de paixão na década de 1940, mas são separados pela diferença social entre suas famílias. Anos mais tarde, com vidas distintas, o destino os reaproxima em uma das histórias de amor mais comoventes do cinema.",
            tipo: "Filme",
            genero: "Romance / Drama",
            ano: 2004,
            duracao: "2h 03min",
            diretor: "Nick Cassavetes",
            elenco: "Ryan Gosling, Rachel McAdams, James Garner",
            idioma: "Inglês",
            classificacao: "12 anos",
            nota: 8.5,
            destaque: true,
            data: "2025-03-18",
            imagem_principal: POSTERS.diarioDeUmaPaixao,
            fotos: [
                { id: 1, titulo: "Pôster oficial",            imagem: POSTERS.diarioDeUmaPaixao },
                { id: 2, titulo: "Ryan Gosling como Noah",    imagem: ACTORS.ryanGosling },
                { id: 3, titulo: "Rachel McAdams como Allie", imagem: ACTORS.rachelMcAdams }
            ]
        },
        {
            id: 12,
            categoria: "romance",
            nome: "De Repente 30",
            descricao: "Adolescente acorda aos 30 anos e descobre que a vida adulta é complicada.",
            conteudo: "Jenna Rink, prestes a completar 13 anos, faz um pedido mágico e amanhece transformada em uma mulher de 30. Editora bem-sucedida, ela percebe que perdeu coisas importantes pelo caminho — inclusive Matt, seu melhor amigo de infância.",
            tipo: "Filme",
            genero: "Romance / Comédia",
            ano: 2004,
            duracao: "1h 38min",
            diretor: "Gary Winick",
            elenco: "Jennifer Garner, Mark Ruffalo, Judy Greer",
            idioma: "Inglês",
            classificacao: "12 anos",
            nota: 7.9,
            destaque: false,
            data: "2025-03-15",
            imagem_principal: POSTERS.deRepente30,
            fotos: [
                { id: 1, titulo: "Pôster oficial",             imagem: POSTERS.deRepente30 },
                { id: 2, titulo: "Jennifer Garner como Jenna", imagem: ACTORS.jenniferGarner },
                { id: 3, titulo: "Mark Ruffalo como Matt",     imagem: ACTORS.markRuffalo }
            ]
        },

        // ===================== TERROR =====================
        {
            id: 13,
            categoria: "terror",
            nome: "Invocação do Mal",
            descricao: "Caçadores de demônios investigam fazenda assombrada por entidade.",
            conteudo: "Os investigadores paranormais Ed e Lorraine Warren são chamados para ajudar a família Perron, que vive em uma fazenda dominada por uma força sombria. Inspirado em fatos reais, o caso se torna um dos mais tenebrosos de suas carreiras.",
            tipo: "Filme",
            genero: "Terror / Suspense",
            ano: 2013,
            duracao: "1h 52min",
            diretor: "James Wan",
            elenco: "Patrick Wilson, Vera Farmiga, Lili Taylor",
            idioma: "Inglês",
            classificacao: "16 anos",
            nota: 8.6,
            destaque: true,
            data: "2025-03-12",
            imagem_principal: POSTERS.invocacaoDoMal,
            fotos: [
                { id: 1, titulo: "Pôster oficial",                    imagem: POSTERS.invocacaoDoMal },
                { id: 2, titulo: "Patrick Wilson como Ed Warren",     imagem: ACTORS.patrickWilson },
                { id: 3, titulo: "Vera Farmiga como Lorraine Warren", imagem: ACTORS.veraFarmiga }
            ]
        },
        {
            id: 14,
            categoria: "terror",
            nome: "A Freira",
            descricao: "Padre e noviça enfrentam entidade maligna em mosteiro romeno.",
            conteudo: "Quando uma freira tira a própria vida em um mosteiro isolado na Romênia, o Vaticano envia o padre Burke e a noviça Irene para investigar. Ali eles descobrem uma força demoníaca que ameaça destruir suas almas.",
            tipo: "Filme",
            genero: "Terror / Suspense",
            ano: 2018,
            duracao: "1h 36min",
            diretor: "Corin Hardy",
            elenco: "Demián Bichir, Taissa Farmiga, Jonas Bloquet",
            idioma: "Inglês",
            classificacao: "16 anos",
            nota: 7.5,
            destaque: false,
            data: "2025-03-10",
            imagem_principal: POSTERS.aFreira,
            fotos: [
                { id: 1, titulo: "Pôster oficial",                 imagem: POSTERS.aFreira },
                { id: 2, titulo: "Taissa Farmiga como Irmã Irene", imagem: ACTORS.taissaFarmiga }
            ]
        },
        {
            id: 15,
            categoria: "terror",
            nome: "Sorria",
            descricao: "Psiquiatra é assombrada por entidade que passa por sorrisos sinistros.",
            conteudo: "Após testemunhar o trauma de uma paciente, a psiquiatra Rose começa a presenciar eventos estranhos e ameaçadores. Para sobreviver, ela precisa enfrentar o passado e desvendar a entidade que se transmite de pessoa a pessoa.",
            tipo: "Filme",
            genero: "Terror / Suspense",
            ano: 2022,
            duracao: "1h 55min",
            diretor: "Parker Finn",
            elenco: "Sosie Bacon, Jessie T. Usher, Kyle Gallner",
            idioma: "Inglês",
            classificacao: "16 anos",
            nota: 7.4,
            destaque: false,
            data: "2025-03-08",
            imagem_principal: POSTERS.sorria,
            fotos: [
                { id: 1, titulo: "Pôster oficial",             imagem: POSTERS.sorria },
                { id: 2, titulo: "Sosie Bacon como Dra. Rose", imagem: ACTORS.sosieBacon }
            ]
        },
        {
            id: 16,
            categoria: "terror",
            nome: "Pânico",
            descricao: "Assassino mascarado aterroriza adolescentes em pequena cidade.",
            conteudo: "Vinte e cinco anos após os crimes originais em Woodsboro, um novo assassino veste a máscara Ghostface para atormentar uma nova geração. Sidney Prescott, Gale Weathers e Dewey retornam para enfrentar o terror.",
            tipo: "Filme",
            genero: "Terror / Slasher",
            ano: 2022,
            duracao: "1h 54min",
            diretor: "Matt Bettinelli-Olpin, Tyler Gillett",
            elenco: "Melissa Barrera, Courteney Cox, Neve Campbell",
            idioma: "Inglês",
            classificacao: "16 anos",
            nota: 7.2,
            destaque: false,
            data: "2025-03-05",
            imagem_principal: POSTERS.panico,
            fotos: [
                { id: 1, titulo: "Pôster oficial",                     imagem: POSTERS.panico },
                { id: 2, titulo: "Neve Campbell como Sidney Prescott", imagem: ACTORS.neveCampbell },
                { id: 3, titulo: "Courteney Cox como Gale Weathers",   imagem: ACTORS.courteneyCox }
            ]
        }
    ],

    aluno: {
        nome: "Sophia Emanuelle de Morais dos Santos",
        matricula: "925579",
        curso: "Sistema de Informação",
        turno: "Noite",
        sobre: "Estudante apaixonada por tecnologia e cinema. O CineList é meu projeto pessoal para organizar e compartilhar com outros fãs as melhores obras do cinema e da TV."
    }
};

// =============================================================
// Helpers
// =============================================================

function getQueryParam(nome) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nome);
}

function escapeHtml(texto) {
    if (texto === null || texto === undefined) return "";
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function getCategoriaNome(idCat) {
    const c = dados.categorias.find(c => c.id === idCat);
    return c ? c.nome : "";
}

// =============================================================
// HOME-PAGE: Carrossel de destaques
// =============================================================

function renderCarrossel() {
    const indicadores = document.getElementById("carrosselIndicadores");
    const slides = document.getElementById("carrosselSlides");
    if (!indicadores || !slides) return;

    const destaques = dados.titulos.filter(t => t.destaque);

    indicadores.innerHTML = destaques.map((item, index) => `
        <button type="button" data-bs-target="#carrosselDestaques" data-bs-slide-to="${index}"
                class="${index === 0 ? "active" : ""}" aria-label="Slide ${index + 1}"
                ${index === 0 ? 'aria-current="true"' : ""}></button>
    `).join("");

    slides.innerHTML = destaques.map((item, index) => `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
            <a href="detalhes.html?id=${item.id}" class="carrossel__link">
                <div class="carrossel__bg" style="background-image: url('${escapeHtml(item.imagem_principal)}');"></div>
                <img src="${escapeHtml(item.imagem_principal)}" class="carrossel__img"
                     alt="${escapeHtml(item.nome)}">
                <div class="carousel-caption carrossel__caption">
                    <span class="carrossel__tag">${escapeHtml(getCategoriaNome(item.categoria))} &middot; ${escapeHtml(item.tipo)}</span>
                    <h3 class="carrossel__titulo">${escapeHtml(item.nome)}</h3>
                    <p class="carrossel__descricao">${escapeHtml(item.descricao)}</p>
                    <span class="carrossel__nota">&#9733; ${item.nota.toFixed(1)}</span>
                </div>
            </a>
        </div>
    `).join("");
}

// =============================================================
// HOME-PAGE: Catálogo agrupado por categorias (estilo Globoplay)
// =============================================================

function cardHtml(item) {
    return `
        <a href="detalhes.html?id=${item.id}" class="card-link categoria__card">
            <div class="card h-100 catalogo__card">
                <div class="catalogo__card-img-wrap">
                    <img src="${escapeHtml(item.imagem_principal)}" class="card-img-top catalogo__card-img"
                         alt="${escapeHtml(item.nome)}">
                    <span class="catalogo__card-badge">&#9733; ${item.nota.toFixed(1)}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title catalogo__card-title">${escapeHtml(item.nome)}</h5>
                    <p class="card-text catalogo__card-genero">${escapeHtml(item.genero)} &middot; ${escapeHtml(item.ano)}</p>
                </div>
                <div class="card-footer">
                    <span class="catalogo__card-link">Ver detalhes &rarr;</span>
                </div>
            </div>
        </a>
    `;
}

function renderCategorias() {
    const container = document.getElementById("catalogoGrid");
    if (!container) return;

    container.innerHTML = dados.categorias.map(cat => {
        const filmes = dados.titulos.filter(t => t.categoria === cat.id);
        if (!filmes.length) return "";
        return `
            <section class="categoria" id="categoria-${cat.id}">
                <header class="categoria__header" style="--cat-cor: ${cat.cor};">
                    <h3 class="categoria__titulo">${escapeHtml(cat.nome)}</h3>
                    <p class="categoria__descricao">${escapeHtml(cat.descricao)} <span class="categoria__contagem">${filmes.length} títulos</span></p>
                </header>
                <div class="categoria__row">
                    ${filmes.map(cardHtml).join("")}
                </div>
            </section>
        `;
    }).join("");
}

// =============================================================
// HOME-PAGE: Informações do(a) aluno(a)
// =============================================================

function renderAluno() {
    const box = document.getElementById("alunoInfo");
    if (!box) return;

    const a = dados.aluno;
    box.innerHTML = `
        <div class="row g-4 align-items-center">
            <div class="col-md-7">
                <h6 class="aluno__subtitulo">Sobre o projeto</h6>
                <p class="aluno__texto">${escapeHtml(a.sobre)}</p>
            </div>
            <div class="col-md-5">
                <h6 class="aluno__subtitulo">Autoria</h6>
                <ul class="aluno__lista">
                    <li><span>Aluna</span><strong>${escapeHtml(a.nome)}</strong></li>
                    <li><span>Matrícula</span><strong>${escapeHtml(a.matricula)}</strong></li>
                    <li><span>Curso</span><strong>${escapeHtml(a.curso)}</strong></li>
                    <li><span>Turno</span><strong>${escapeHtml(a.turno)}</strong></li>
                </ul>
            </div>
        </div>
    `;
}

// =============================================================
// PÁGINA DE DETALHES
// =============================================================

function renderDetalhes() {
    const container = document.getElementById("detalheConteudo");
    if (!container) return;

    const id = parseInt(getQueryParam("id"), 10);
    const item = dados.titulos.find(t => t.id === id);

    if (!item) {
        container.innerHTML = `
            <div class="alert alert-warning text-center my-5">
                <h4>Título não encontrado</h4>
                <p>O item solicitado não existe no catálogo.</p>
                <a href="index.html" class="btn btn-danger">Voltar para a Home</a>
            </div>
        `;
        return;
    }

    document.title = item.nome + " - CineList";

    container.innerHTML = `
        <!-- Seção 1 - Informações Gerais (entidade principal) -->
        <section class="detalhe__info">
            <h2 class="detalhe__secao-titulo">Informações Gerais</h2>
            <div class="row g-4 detalhe__info-grid">
                <div class="col-12 col-md-5">
                    <div class="detalhe__poster">
                        <img src="${escapeHtml(item.imagem_principal)}" alt="${escapeHtml(item.nome)}">
                        <span class="detalhe__poster-nota">&#9733; ${item.nota.toFixed(1)}</span>
                    </div>
                </div>
                <div class="col-12 col-md-7">
                    <span class="detalhe__tag">${escapeHtml(getCategoriaNome(item.categoria))} &middot; ${escapeHtml(item.tipo)}</span>
                    <h1 class="detalhe__titulo">${escapeHtml(item.nome)}</h1>
                    <p class="detalhe__descricao">${escapeHtml(item.descricao)}</p>

                    <div class="detalhe__ficha">
                        <div class="detalhe__ficha-item">
                            <span class="detalhe__ficha-label">Gênero</span>
                            <span class="detalhe__ficha-valor">${escapeHtml(item.genero)}</span>
                        </div>
                        <div class="detalhe__ficha-item">
                            <span class="detalhe__ficha-label">Ano</span>
                            <span class="detalhe__ficha-valor">${escapeHtml(item.ano)}</span>
                        </div>
                        <div class="detalhe__ficha-item">
                            <span class="detalhe__ficha-label">Duração</span>
                            <span class="detalhe__ficha-valor">${escapeHtml(item.duracao)}</span>
                        </div>
                        <div class="detalhe__ficha-item">
                            <span class="detalhe__ficha-label">Direção</span>
                            <span class="detalhe__ficha-valor">${escapeHtml(item.diretor)}</span>
                        </div>
                        <div class="detalhe__ficha-item">
                            <span class="detalhe__ficha-label">Idioma</span>
                            <span class="detalhe__ficha-valor">${escapeHtml(item.idioma)}</span>
                        </div>
                        <div class="detalhe__ficha-item">
                            <span class="detalhe__ficha-label">Classificação</span>
                            <span class="detalhe__ficha-valor">${escapeHtml(item.classificacao)}</span>
                        </div>
                    </div>

                    <div class="detalhe__elenco">
                        <h6>Elenco principal</h6>
                        <p>${escapeHtml(item.elenco)}</p>
                    </div>

                    <div class="detalhe__sinopse">
                        <h6>Sinopse</h6>
                        <p>${escapeHtml(item.conteudo)}</p>
                    </div>

                    <a href="index.html" class="btn detalhe__voltar">&larr; Voltar para o catálogo</a>
                </div>
            </div>
        </section>

        <!-- Seção 2 - Fotos do Item (entidade secundária) -->
        <section class="detalhe__fotos">
            <h2 class="detalhe__secao-titulo">Fotos do Título</h2>
            <div class="row g-3">
                ${item.fotos.map(foto => `
                    <div class="col-6 col-md-4 col-lg-3">
                        <div class="card detalhe__foto-card h-100">
                            <img src="${escapeHtml(foto.imagem)}" class="card-img-top detalhe__foto-img"
                                 alt="${escapeHtml(foto.titulo)}">
                            <div class="card-body p-2 text-center">
                                <p class="card-text detalhe__foto-titulo">${escapeHtml(foto.titulo)}</p>
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
        </section>
    `;
}

// =============================================================
// Inicialização
// =============================================================

document.addEventListener("DOMContentLoaded", function () {
    renderCarrossel();
    renderCategorias();
    renderAluno();
    renderDetalhes();

    // Toggle do menu hambúrguer (somente quando o elemento existe)
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("headerNav");
    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            nav.classList.toggle("header__nav--open");
        });
    }
});
