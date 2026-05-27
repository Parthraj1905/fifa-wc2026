/**
 * WC 2026 Squad Data
 * Each squad has exactly 23 players.
 * Positions: "GK" | "DEF" | "MID" | "FWD"
 */

const squads = {
  Brazil: [
    // Goalkeepers
    { number: 1, name: "Alisson", position: "GK", club: "Liverpool" },
    { number: 12, name: "Weverton", position: "GK", club: "Grêmio" },
    { number: 23, name: "Ederson", position: "GK", club: "Fenerbahçe" },

    // Defenders
    { number: 2, name: "Wesley", position: "RB", club: "Roma" },
    { number: 3, name: "Gabriel Magalhães", position: "CB", club: "Arsenal" },
    { number: 4, name: "Marquinhos", position: "CB", club: "PSG" },
    { number: 6, name: "Douglas Santos", position: "LB", club: "Zenit" },
    { number: 13, name: "Danilo", position: "RB", club: "Flamengo" },
    { number: 14, name: "Bremer", position: "CB", club: "Juventus" },
    { number: 15, name: "Léo Pereira", position: "CB", club: "Flamengo" },
    { number: 16, name: "Alex Sandro", position: "LB", club: "Flamengo" },
    { number: 24, name: "Roger Ibañez", position: "CB", club: "Al-Ahli" },

    // Midfielders
    { number: 5, name: "Casemiro", position: "CDM", club: "Manchester United" },
    { number: 8, name: "Bruno Guimarães", position: "CM", club: "Newcastle United" },
    { number: 17, name: "Fabinho", position: "CDM", club: "Al-Ittihad" },
    { number: 18, name: "Danilo Santos", position: "CM", club: "Botafogo" },
    { number: 25, name: "Lucas Paquetá", position: "CAM", club: "Flamengo" },

    // Forwards
    { number: 7, name: "Vinícius Júnior", position: "LW", club: "Real Madrid" },
    { number: 9, name: "Matheus Cunha", position: "CAM", club: "Manchester United" },
    { number: 10, name: "Neymar", position: "LW", club: "Santos" },
    { number: 11, name: "Raphinha", position: "RW", club: "Barcelona" },
    { number: 19, name: "Endrick", position: "ST", club: "Real Madrid" },
    { number: 20, name: "Luiz Henrique", position: "RW", club: "Zenit" },
    { number: 21, name: "Igor Thiago", position: "ST", club: "Brentford" },
    { number: 22, name: "Gabriel Martinelli", position: "LW", club: "Arsenal" },
    { number: 26, name: "Rayan", position: "RW", club: "Bournemouth" }
  ],

  Spain: [
    // Goalkeepers
    { number: 1, name: "David Raya", position: "GK", club: "Arsenal" },
    { number: 13, name: "Joan Garcia", position: "GK", club: "Barcelona" },
    { number: 23, name: "Unai Simon", position: "GK", club: "Athletic Club" },

    // Defenders
    { number: 2, name: "Pedro Porro", position: "RB", club: "Tottenham Hotspur" },
    { number: 3, name: "Alex Grimaldo", position: "LB", club: "Bayer Leverkusen" },
    { number: 4, name: "Pau Cubarsi", position: "CB", club: "Barcelona" },
    { number: 5, name: "Marcos Llorente", position: "RB", club: "Atletico Madrid" },
    { number: 12, name: "Marc Pubill", position: "RB", club: "Atletico Madrid" },
    { number: 14, name: "Aymeric Laporte", position: "CB", club: "Athletic Club" },
    { number: 24, name: "Marc Cucurella", position: "LB", club: "Chelsea" },
    { number: 25, name: "Eric Garcia", position: "CB", club: "Barcelona" },

    // Midfielders
    { number: 6, name: "Gavi", position: "CM", club: "Barcelona" },
    { number: 8, name: "Fabian Ruiz", position: "CM", club: "PSG" },
    { number: 15, name: "Alex Baena", position: "CAM", club: "Atletico Madrid" },
    { number: 16, name: "Rodri", position: "CDM", club: "Manchester City" },
    { number: 18, name: "Mikel Merino", position: "CM", club: "Arsenal" },
    { number: 20, name: "Pedri", position: "CM", club: "Barcelona" },
    { number: 26, name: "Martin Zubimendi", position: "CDM", club: "Arsenal" },

    // Forwards
    { number: 7, name: "Ferran Torres", position: "LW", club: "Barcelona" },
    { number: 9, name: "Borja Iglesias", position: "ST", club: "Celta Vigo" },
    { number: 10, name: "Dani Olmo", position: "CAM", club: "Barcelona" },
    { number: 11, name: "Yeremy Pino", position: "RW", club: "Crystal Palace" },
    { number: 17, name: "Nico Williams", position: "LW", club: "Athletic Club" },
    { number: 19, name: "Lamine Yamal", position: "RW", club: "Barcelona" },
    { number: 21, name: "Mikel Oyarzabal", position: "ST", club: "Real Sociedad" },
    { number: 22, name: "Victor Munoz", position: "LW", club: "Osasuna" }
  ],

  France: [
    // Goalkeepers
    { number: 1, name: "Brice Samba", position: "GK", club: "Rennes" },
    { number: 16, name: "Mike Maignan", position: "GK", club: "AC Milan" },
    { number: 23, name: "Robin Risser", position: "GK", club: "Lens" },

    // Defenders
    { number: 2, name: "Malo Gusto", position: "RB", club: "Chelsea" },
    { number: 3, name: "Lucas Digne", position: "LB", club: "Aston Villa" },
    { number: 4, name: "Dayot Upamecano", position: "CB", club: "Bayern Munich" },
    { number: 5, name: "Jules Koundé", position: "RB", club: "Barcelona" },
    { number: 15, name: "Ibrahima Konaté", position: "CB", club: "Liverpool" },
    { number: 17, name: "William Saliba", position: "CB", club: "Arsenal" },
    { number: 21, name: "Lucas Hernández", position: "LB", club: "PSG" },
    { number: 22, name: "Theo Hernández", position: "LB", club: "Al Hilal" },
    { number: 24, name: "Maxence Lacroix", position: "CB", club: "Crystal Palace" },

    // Midfielders
    { number: 6, name: "Warren Zaïre-Emery", position: "CM", club: "PSG" },
    { number: 8, name: "Aurélien Tchouaméni", position: "CDM", club: "Real Madrid" },
    { number: 13, name: "N'Golo Kanté", position: "CDM", club: "Fenerbahçe" },
    { number: 14, name: "Adrien Rabiot", position: "CM", club: "AC Milan" },
    { number: 18, name: "Manu Koné", position: "CM", club: "Roma" },
    { number: 25, name: "Rayan Cherki", position: "CAM", club: "Manchester City" },

    // Forwards
    { number: 7, name: "Ousmane Dembélé", position: "RW", club: "PSG" },
    { number: 9, name: "Marcus Thuram", position: "ST", club: "Inter Milan" },
    { number: 10, name: "Kylian Mbappé", position: "LW", club: "Real Madrid" },
    { number: 11, name: "Michael Olise", position: "RW", club: "Bayern Munich" },
    { number: 12, name: "Maghnes Akliouche", position: "LW", club: "Monaco" },
    { number: 19, name: "Jean-Philippe Mateta", position: "ST", club: "Crystal Palace" },
    { number: 20, name: "Bradley Barcola", position: "LW", club: "PSG" },
    { number: 26, name: "Désiré Doué", position: "LW", club: "PSG" }
  ],

  Argentina: [
    // Goalkeepers
    { number: 1, name: "Emiliano Martínez", position: "GK", club: "Aston Villa" },
    { number: 12, name: "Geronimo Rulli", position: "GK", club: "Atlético Madrid" },
    { number: 23, name: "Franco Armani", position: "GK", club: "River Plate" },

    // Defenders
    { number: 2, name: "Nahuel Molina", position: "RB", club: "Atlético Madrid" },
    { number: 3, name: "Nicolás Tagliafico", position: "LB", club: "Lyon" },
    { number: 4, name: "Gonzalo Montiel", position: "RB", club: "Nottingham Forest" },
    { number: 5, name: "Germán Pezzella", position: "CB", club: "Real Betis" },
    { number: 6, name: "Nicolás Otamendi", position: "CB", club: "Benfica" },
    { number: 13, name: "Cristian Romero", position: "CB", club: "Tottenham Hotspur" },
    { number: 14, name: "Lisandro Martínez", position: "CB", club: "Manchester United" },
    { number: 8, name: "Marcos Acuña", position: "LB", club: "Sevilla" },

    // Midfielders
    { number: 7, name: "Rodrigo De Paul", position: "CM", club: "Atlético Madrid" },
    { number: 15, name: "Leandro Paredes", position: "CM", club: "Roma" },
    { number: 16, name: "Exequiel Palacios", position: "CM", club: "Bayer Leverkusen" },
    { number: 18, name: "Enzo Fernández", position: "CM", club: "Chelsea" },
    { number: 19, name: "Nicolás González", position: "LW", club: "Juventus" },
    { number: 20, name: "Giovani Lo Celso", position: "CM", club: "Villarreal" },
    { number: 21, name: "Alexis Mac Allister", position: "CM", club: "Liverpool" },

    // Forwards
    { number: 10, name: "Lionel Messi", position: "RW", club: "Inter Miami CF" },
    { number: 9, name: "Lautaro Martínez", position: "ST", club: "Inter Milan" },
    { number: 11, name: "Ángel Di María", position: "RW", club: "Benfica" },
    { number: 22, name: "Julián Álvarez", position: "ST", club: "Atlético Madrid" },
    { number: 17, name: "Alejandro Garnacho", position: "LW", club: "Manchester United" },
  ],

  England: [
    // Goalkeepers
    { number: 1, name: "Jordan Pickford", position: "GK", club: "Everton" },
    { number: 13, name: "Dean Henderson", position: "GK", club: "Crystal Palace" },
    { number: 23, name: "James Trafford", position: "GK", club: "Manchester City" },

    // Defenders
    { number: 2, name: "Reece James", position: "RB", club: "Chelsea" },
    { number: 3, name: "Dan Burn", position: "LB", club: "Newcastle United" },
    { number: 5, name: "John Stones", position: "CB", club: "Manchester City" },
    { number: 6, name: "Marc Guéhi", position: "CB", club: "Manchester City" },
    { number: 12, name: "Tino Livramento", position: "RB", club: "Newcastle United" },
    { number: 14, name: "Ezri Konsa", position: "CB", club: "Aston Villa" },
    { number: 15, name: "Jarell Quansah", position: "CB", club: "Bayer Leverkusen" },
    { number: 24, name: "Nico O'Reilly", position: "LB", club: "Manchester City" },
    { number: 25, name: "Djed Spence", position: "RB", club: "Tottenham Hotspur" },

    // Midfielders
    { number: 4, name: "Declan Rice", position: "CDM", club: "Arsenal" },
    { number: 8, name: "Jude Bellingham", position: "CM", club: "Real Madrid" },
    { number: 10, name: "Eberechi Eze", position: "CAM", club: "Arsenal" },
    { number: 16, name: "Kobbie Mainoo", position: "CM", club: "Manchester United" },
    { number: 18, name: "Elliot Anderson", position: "CM", club: "Nottingham Forest" },
    { number: 20, name: "Morgan Rogers", position: "CAM", club: "Aston Villa" },
    { number: 26, name: "Jordan Henderson", position: "CM", club: "Brentford" },

    // Forwards
    { number: 7, name: "Bukayo Saka", position: "RW", club: "Arsenal" },
    { number: 9, name: "Harry Kane", position: "ST", club: "Bayern Munich" },
    { number: 11, name: "Anthony Gordon", position: "LW", club: "Newcastle United" },
    { number: 17, name: "Marcus Rashford", position: "LW", club: "Barcelona" },
    { number: 19, name: "Ollie Watkins", position: "ST", club: "Aston Villa" },
    { number: 21, name: "Ivan Toney", position: "ST", club: "Al-Ahli" },
    { number: 22, name: "Noni Madueke", position: "RW", club: "Arsenal" }
  ],
  Germany: [
    // Goalkeepers
    { number: 1, name: "Oliver Baumann", position: "GK", club: "Hoffenheim" },
    { number: 12, name: "Manuel Neuer", position: "GK", club: "Bayern Munich" },
    { number: 22, name: "Alexander Nübel", position: "GK", club: "VfB Stuttgart" },

    // Defenders
    { number: 2, name: "Antonio Rüdiger", position: "CB", club: "Real Madrid" },
    { number: 3, name: "Waldemar Anton", position: "CB", club: "Borussia Dortmund" },
    { number: 4, name: "Jonathan Tah", position: "CB", club: "Bayern Munich" },
    { number: 6, name: "Joshua Kimmich", position: "RB", club: "Bayern Munich" },
    { number: 15, name: "Nico Schlotterbeck", position: "CB", club: "Borussia Dortmund" },
    { number: 18, name: "Nathaniel Brown", position: "LB", club: "Eintracht Frankfurt" },
    { number: 20, name: "David Raum", position: "LB", club: "RB Leipzig" },
    { number: 24, name: "Malick Thiaw", position: "CB", club: "Newcastle United" },

    // Midfielders
    { number: 5, name: "Aleksandar Pavlović", position: "CM", club: "Bayern Munich" },
    { number: 8, name: "Leon Goretzka", position: "CM", club: "Bayern Munich" },
    { number: 10, name: "Nadiem Amiri", position: "CAM", club: "Mainz 05" },
    { number: 13, name: "Felix Nmecha", position: "CM", club: "Borussia Dortmund" },
    { number: 14, name: "Jamal Musiala", position: "CAM", club: "Bayern Munich" },
    { number: 16, name: "Angelo Stiller", position: "CM", club: "VfB Stuttgart" },
    { number: 17, name: "Florian Wirtz", position: "CM", club: "Liverpool" },
    { number: 19, name: "Leroy Sané", position: "RW", club: "Galatasaray" },
    { number: 21, name: "Jamie Leweling", position: "RW", club: "VfB Stuttgart" },
    { number: 23, name: "Pascal Groß", position: "CM", club: "Borussia Dortmund" },
    { number: 25, name: "Lennart Karl", position: "CM", club: "Bayern Munich" },

    // Forwards
    { number: 7, name: "Kai Havertz", position: "CM", club: "Arsenal" },
    { number: 9, name: "Maximilian Beier", position: "ST", club: "Borussia Dortmund" },
    { number: 11, name: "Nick Woltemade", position: "ST", club: "Newcastle United" },
    { number: 26, name: "Deniz Undav", position: "ST", club: "VfB Stuttgart" }
  ],

  Portugal: [
    // Goalkeepers
    { number: 1, name: "Diogo Costa", position: "GK", club: "Porto" },
    { number: 12, name: "José Sá", position: "GK", club: "Wolves" },
    { number: 22, name: "Rui Silva", position: "GK", club: "Sporting CP" },
    { number: 24, name: "Ricardo Velho", position: "GK", club: "Gençlerbirliği" },

    // Defenders
    { number: 2, name: "Diogo Dalot", position: "RB", club: "Manchester United" },
    { number: 3, name: "Renato Veiga", position: "CB", club: "Villarreal" },
    { number: 4, name: "Rúben Dias", position: "CB", club: "Manchester City" },
    { number: 5, name: "Gonçalo Inácio", position: "CB", club: "Sporting CP" },
    { number: 13, name: "Tomás Araújo", position: "CB", club: "Benfica" },
    { number: 14, name: "Nélson Semedo", position: "RB", club: "Fenerbahçe" },
    { number: 19, name: "Nuno Mendes", position: "LB", club: "PSG" },
    { number: 20, name: "João Cancelo", position: "LB", club: "Barcelona" },
    { number: 25, name: "Matheus Nunes", position: "RB", club: "Manchester City" },

    // Midfielders
    { number: 6, name: "Samú Costa", position: "CM", club: "Mallorca" },
    { number: 8, name: "Bruno Fernandes", position: "CAM", club: "Manchester United" },
    { number: 10, name: "Bernardo Silva", position: "CM", club: "Manchester City" },
    { number: 15, name: "João Neves", position: "CM", club: "PSG" },
    { number: 16, name: "Vitinha", position: "CM", club: "PSG" },
    { number: 18, name: "Rúben Neves", position: "CM", club: "Al-Hilal" },

    // Forwards
    { number: 7, name: "Cristiano Ronaldo", position: "ST", club: "Al-Nassr" },
    { number: 9, name: "Gonçalo Ramos", position: "ST", club: "PSG" },
    { number: 11, name: "João Félix", position: "LW", club: "Al-Nassr" },
    { number: 17, name: "Rafael Leão", position: "LW", club: "AC Milan" },
    { number: 21, name: "Pedro Neto", position: "RW", club: "Chelsea" },
    { number: 23, name: "Gonçalo Guedes", position: "LW", club: "Real Sociedad" },
    { number: 26, name: "Francisco Conceição", position: "RW", club: "Juventus" },
    { number: 27, name: "Francisco Trincão", position: "RW", club: "Sporting CP" }
  ],

  Colombia: [
    // Goalkeepers
    { number: 1, name: "David Ospina", position: "GK", club: "Atlético Nacional" },
    { number: 12, name: "Camilo Vargas", position: "GK", club: "Atlas" },
    { number: 22, name: "Álvaro Montero", position: "GK", club: "Vélez Sarsfield" },

    // Defenders
    { number: 2, name: "Daniel Muñoz", position: "RB", club: "Crystal Palace" },
    { number: 3, name: "Jhon Lucumí", position: "CB", club: "Bologna" },
    { number: 4, name: "Santiago Arias", position: "RB", club: "Independiente" },
    { number: 13, name: "Yerry Mina", position: "CB", club: "Cagliari" },
    { number: 14, name: "Willer Ditta", position: "CB", club: "Cruz Azul" },
    { number: 17, name: "Johan Mojica", position: "LB", club: "Mallorca" },
    { number: 21, name: "Déiver Machado", position: "LB", club: "Nantes" },
    { number: 23, name: "Davinson Sánchez", position: "CB", club: "Galatasaray" },

    // Midfielders
    { number: 5, name: "Kevin Castaño", position: "CM", club: "River Plate" },
    { number: 6, name: "Richard Ríos", position: "CM", club: "Benfica" },
    { number: 8, name: "Gustavo Puerta", position: "CM", club: "Racing de Santander" },
    { number: 10, name: "James Rodríguez", position: "CAM", club: "Minnesota United" },
    { number: 11, name: "Jhon Arias", position: "RW", club: "Palmeiras" },
    { number: 15, name: "Juan Camilo Portilla", position: "CM", club: "Athletico Paranaense" },
    { number: 16, name: "Jefferson Lerma", position: "CM", club: "Crystal Palace" },
    { number: 18, name: "Jorge Carrascal", position: "CM", club: "Flamengo" },
    { number: 20, name: "Juan Fernando Quintero", position: "CAM", club: "River Plate" },

    // Forwards
    { number: 7, name: "Luis Díaz", position: "LW", club: "Bayern Munich" },
    { number: 9, name: "Jhon Córdoba", position: "ST", club: "Krasnodar" },
    { number: 19, name: "Juan Camilo Hernández", position: "ST", club: "Real Betis" },
    { number: 24, name: "Luis Suárez", position: "ST", club: "Sporting CP" },
    { number: 25, name: "Jaminton Campaz", position: "LW", club: "Rosario Central" },
    { number: 26, name: "Carlos Gómez", position: "RW", club: "Vasco da Gama" }
  ],

  Croatia: [
    // Goalkeepers
    { number: 1, name: "Dominik Livaković", position: "GK", club: "Fenerbahçe" },
    { number: 12, name: "Dominik Kotarski", position: "GK", club: "København" },
    { number: 23, name: "Ivor Pandur", position: "GK", club: "Hull City" },

    // Defenders
    { number: 2, name: "Josip Stanišić", position: "RB", club: "Bayern Munich" },
    { number: 3, name: "Marin Pongračić", position: "CB", club: "Fiorentina" },
    { number: 4, name: "Joško Gvardiol", position: "LB", club: "Manchester City" },
    { number: 5, name: "Duje Ćaleta-Car", position: "CB", club: "Real Sociedad" },
    { number: 6, name: "Josip Šutalo", position: "CB", club: "Ajax" },
    { number: 22, name: "Martin Erlić", position: "CB", club: "Midtjylland" },
    { number: 24, name: "Luka Vušković", position: "CB", club: "Hamburger SV" },

    // Midfielders
    { number: 8, name: "Mateo Kovačić", position: "CM", club: "Manchester City" },
    { number: 10, name: "Luka Modrić", position: "CM", club: "AC Milan" },
    { number: 13, name: "Nikola Vlašić", position: "CAM", club: "Torino" },
    { number: 15, name: "Mario Pašalić", position: "CM", club: "Atalanta" },
    { number: 16, name: "Martin Baturina", position: "CM", club: "Como 1907" },
    { number: 17, name: "Petar Sučić", position: "CM", club: "Inter Milan" },
    { number: 18, name: "Kristijan Jakić", position: "CM", club: "Augsburg" },
    { number: 19, name: "Toni Fruk", position: "CAM", club: "Rijeka" },
    { number: 21, name: "Luka Sučić", position: "CM", club: "Real Sociedad" },
    { number: 25, name: "Nikola Moro", position: "CM", club: "Bologna" },

    // Forwards
    { number: 7, name: "Petar Musa", position: "ST", club: "FC Dallas" },
    { number: 9, name: "Andrej Kramarić", position: "ST", club: "Hoffenheim" },
    { number: 11, name: "Ante Budimir", position: "ST", club: "Osasuna" },
    { number: 14, name: "Ivan Perišić", position: "LW", club: "PSV" },
    { number: 20, name: "Marco Pašalić", position: "RW", club: "Orlando City SC" },
    { number: 26, name: "Igor Matanović", position: "ST", club: "SC Freiburg" }
  ],

  USA: [
    // Goalkeepers
    { number: 1, name: "Matt Turner", position: "GK", club: "New England Revolution" },
    { number: 18, name: "Chris Brady", position: "GK", club: "Chicago Fire" },
    { number: 25, name: "Matt Freese", position: "GK", club: "New York City FC" },

    // Defenders
    { number: 2, name: "Sergiño Dest", position: "RB", club: "PSV" },
    { number: 3, name: "Chris Richards", position: "CB", club: "Crystal Palace" },
    { number: 4, name: "Miles Robinson", position: "CB", club: "FC Cincinnati" },
    { number: 5, name: "Antonee Robinson", position: "LB", club: "Fulham" },
    { number: 12, name: "Max Arfsten", position: "RB", club: "Columbus Crew" },
    { number: 13, name: "Tim Ream", position: "CB", club: "Charlotte FC" },
    { number: 14, name: "Alex Freeman", position: "RB", club: "Villarreal" },
    { number: 22, name: "Joe Scally", position: "RB", club: "Borussia Mönchengladbach" },
    { number: 24, name: "Mark McKenzie", position: "CB", club: "Toulouse" },

    // Midfielders
    { number: 6, name: "Tyler Adams", position: "CM", club: "AFC Bournemouth" },
    { number: 8, name: "Weston McKennie", position: "CM", club: "Juventus" },
    { number: 15, name: "Sebastian Berhalter", position: "CM", club: "Vancouver Whitecaps" },
    { number: 16, name: "Cristian Roldan", position: "CM", club: "Seattle Sounders" },

    // Forwards
    { number: 7, name: "Gio Reyna", position: "CAM", club: "Borussia Mönchengladbach" },
    { number: 9, name: "Ricardo Pepi", position: "ST", club: "PSV" },
    { number: 10, name: "Christian Pulisic", position: "LW", club: "AC Milan" },
    { number: 11, name: "Brenden Aaronson", position: "CAM", club: "Leeds United" },
    { number: 17, name: "Malik Tillman", position: "CAM", club: "Bayer Leverkusen" },
    { number: 19, name: "Haji Wright", position: "ST", club: "Coventry City" },
    { number: 20, name: "Folarin Balogun", position: "ST", club: "AS Monaco" },
    { number: 21, name: "Tim Weah", position: "RW", club: "Marseille" },
    { number: 23, name: "Alejandro Zendejas", position: "RW", club: "Club América" }
  ],
  Belgium: [
    // Goalkeepers
    { number: 1, name: "Thibaut Courtois", position: "GK", club: "Real Madrid" },
    { number: 12, name: "Senne Lammens", position: "GK", club: "Manchester United" },
    { number: 13, name: "Mike Penders", position: "GK", club: "Strasbourg" },

    // Defenders
    { number: 2, name: "Zeno Debast", position: "CB", club: "Sporting CP" },
    { number: 3, name: "Arthur Theate", position: "CB", club: "Eintracht Frankfurt" },
    { number: 4, name: "Brandon Mechele", position: "CB", club: "Club Brugge" },
    { number: 5, name: "Maxim De Cuyper", position: "LB", club: "Brighton and Hove Albion" },
    { number: 15, name: "Thomas Meunier", position: "RB", club: "Lille" },
    { number: 16, name: "Koni De Winter", position: "CB", club: "AC Milan" },
    { number: 18, name: "Joaquin Seys", position: "LB", club: "Club Brugge" },
    { number: 19, name: "Timothy Castagne", position: "RB", club: "Fulham" },
    { number: 24, name: "Nathan Ngoy", position: "CB", club: "Lille" },

    // Midfielders
    { number: 6, name: "Axel Witsel", position: "CM", club: "Girona" },
    { number: 7, name: "Kevin De Bruyne", position: "CAM", club: "Napoli" },
    { number: 8, name: "Youri Tielemans", position: "CM", club: "Aston Villa" },
    { number: 20, name: "Hans Vanaken", position: "CAM", club: "Club Brugge" },
    { number: 22, name: "Amadou Onana", position: "CM", club: "Aston Villa" },
    { number: 23, name: "Nicolas Raskin", position: "CM", club: "Rangers" },

    // Forwards
    { number: 9, name: "Charles De Ketelaere", position: "RW", club: "Atalanta" },
    { number: 10, name: "Romelu Lukaku", position: "ST", club: "Napoli" },
    { number: 11, name: "Jeremy Doku", position: "LW", club: "Manchester City" },
    { number: 14, name: "Dodi Lukebakio", position: "RW", club: "Benfica" },
    { number: 17, name: "Leandro Trossard", position: "LW", club: "Arsenal" },
    { number: 21, name: "Alexis Saelemaekers", position: "RW", club: "AC Milan" },
    { number: 25, name: "Diego Moreira", position: "LW", club: "Strasbourg" },
    { number: 26, name: "Matias Fernandez-Pardo", position: "LW", club: "Lille" }
  ],

  Turkey: [
    // Goalkeepers
    { number: 1, name: "Uğurcan Çakır", position: "GK", club: "Galatasaray" },
    { number: 12, name: "Altay Bayındır", position: "GK", club: "Manchester United" },
    { number: 23, name: "Mert Günok", position: "GK", club: "Fenerbahçe" },

    // Defenders
    { number: 2, name: "Zeki Çelik", position: "RB", club: "AS Roma" },
    { number: 3, name: "Merih Demiral", position: "CB", club: "Al-Ahli" },
    { number: 4, name: "Çağlar Söyüncü", position: "CB", club: "Fenerbahçe" },
    { number: 13, name: "Eren Elmalı", position: "LB", club: "Galatasaray" },
    { number: 14, name: "Abdülkerim Bardakcı", position: "CB", club: "Galatasaray" },
    { number: 15, name: "Ozan Kabak", position: "CB", club: "Hoffenheim" },
    { number: 18, name: "Mert Müldür", position: "RB", club: "Fenerbahçe" },
    { number: 20, name: "Ferdi Kadıoğlu", position: "LB", club: "Brighton & Hove Albion" },

    // Midfielders
    { number: 5, name: "Salih Özcan", position: "CM", club: "Borussia Dortmund" },
    { number: 6, name: "Orkun Kökçü", position: "CM", club: "Beşiktaş" },
    { number: 8, name: "Arda Güler", position: "CAM", club: "Real Madrid" },
    { number: 10, name: "Hakan Çalhanoğlu", position: "CM", club: "Inter Milan" },
    { number: 16, name: "İsmail Yüksek", position: "CM", club: "Fenerbahçe" },
    { number: 22, name: "Kaan Ayhan", position: "CM", club: "Galatasaray" },

    // Forwards
    { number: 7, name: "Kerem Aktürkoğlu", position: "LW", club: "Fenerbahçe" },
    { number: 9, name: "Barış Alper Yılmaz", position: "ST", club: "Galatasaray" },
    { number: 11, name: "Kenan Yıldız", position: "LW", club: "Juventus" },
    { number: 17, name: "İrfan Can Kahveci", position: "RW", club: "Kasımpaşa" },
    { number: 19, name: "Oğuz Aydın", position: "LW", club: "Fenerbahçe" },
    { number: 21, name: "Yunus Akgün", position: "RW", club: "Galatasaray" },
    { number: 24, name: "Can Uzun", position: "ST", club: "Eintracht Frankfurt" },
    { number: 25, name: "Yusuf Sarı", position: "RW", club: "Başakşehir" }
  ]

}

export default squads
