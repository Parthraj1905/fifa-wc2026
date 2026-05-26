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
    { number: 2, name: "Wesley", position: "DEF", club: "Roma" },
    { number: 3, name: "Gabriel Magalhães", position: "DEF", club: "Arsenal" },
    { number: 4, name: "Marquinhos", position: "DEF", club: "PSG" },
    { number: 6, name: "Douglas Santos", position: "DEF", club: "Zenit" },
    { number: 13, name: "Danilo", position: "DEF", club: "Flamengo" },
    { number: 14, name: "Bremer", position: "DEF", club: "Juventus" },
    { number: 15, name: "Léo Pereira", position: "DEF", club: "Flamengo" },
    { number: 16, name: "Alex Sandro", position: "DEF", club: "Flamengo" },
    { number: 24, name: "Roger Ibañez", position: "DEF", club: "Al-Ahli" },

    // Midfielders
    { number: 5, name: "Casemiro", position: "MID", club: "Manchester United" },
    { number: 8, name: "Bruno Guimarães", position: "MID", club: "Newcastle United" },
    { number: 17, name: "Fabinho", position: "MID", club: "Al-Ittihad" },
    { number: 18, name: "Danilo Santos", position: "MID", club: "Botafogo" },
    { number: 25, name: "Lucas Paquetá", position: "MID", club: "Flamengo" },

    // Forwards
    { number: 7, name: "Vinícius Júnior", position: "FWD", club: "Real Madrid" },
    { number: 9, name: "Matheus Cunha", position: "FWD", club: "Manchester United" },
    { number: 10, name: "Neymar", position: "FWD", club: "Santos" },
    { number: 11, name: "Raphinha", position: "FWD", club: "Barcelona" },
    { number: 19, name: "Endrick", position: "FWD", club: "Real Madrid" },
    { number: 20, name: "Luiz Henrique", position: "FWD", club: "Zenit" },
    { number: 21, name: "Igor Thiago", position: "FWD", club: "Brentford" },
    { number: 22, name: "Gabriel Martinelli", position: "FWD", club: "Arsenal" },
    { number: 26, name: "Rayan", position: "FWD", club: "Bournemouth" }
  ],

  Spain: [
    // Goalkeepers
    { number: 1, name: "David Raya", position: "GK", club: "Arsenal" },
    { number: 13, name: "Joan Garcia", position: "GK", club: "Barcelona" },
    { number: 23, name: "Unai Simon", position: "GK", club: "Athletic Club" },

    // Defenders
    { number: 2, name: "Pedro Porro", position: "DEF", club: "Tottenham Hotspur" },
    { number: 3, name: "Alex Grimaldo", position: "DEF", club: "Bayer Leverkusen" },
    { number: 4, name: "Pau Cubarsi", position: "DEF", club: "Barcelona" },
    { number: 5, name: "Marcos Llorente", position: "DEF", club: "Atletico Madrid" },
    { number: 12, name: "Marc Pubill", position: "DEF", club: "Atletico Madrid" },
    { number: 14, name: "Aymeric Laporte", position: "DEF", club: "Athletic Club" },
    { number: 24, name: "Marc Cucurella", position: "DEF", club: "Chelsea" },
    { number: 25, name: "Eric Garcia", position: "DEF", club: "Barcelona" },

    // Midfielders
    { number: 6, name: "Gavi", position: "MID", club: "Barcelona" },
    { number: 8, name: "Fabian Ruiz", position: "MID", club: "PSG" },
    { number: 15, name: "Alex Baena", position: "MID", club: "Atletico Madrid" },
    { number: 16, name: "Rodri", position: "MID", club: "Manchester City" },
    { number: 18, name: "Mikel Merino", position: "MID", club: "Arsenal" },
    { number: 20, name: "Pedri", position: "MID", club: "Barcelona" },
    { number: 26, name: "Martin Zubimendi", position: "MID", club: "Arsenal" },

    // Forwards
    { number: 7, name: "Ferran Torres", position: "FWD", club: "Barcelona" },
    { number: 9, name: "Borja Iglesias", position: "FWD", club: "Celta Vigo" },
    { number: 10, name: "Dani Olmo", position: "FWD", club: "Barcelona" },
    { number: 11, name: "Yeremy Pino", position: "FWD", club: "Crystal Palace" },
    { number: 17, name: "Nico Williams", position: "FWD", club: "Athletic Club" },
    { number: 19, name: "Lamine Yamal", position: "FWD", club: "Barcelona" },
    { number: 21, name: "Mikel Oyarzabal", position: "FWD", club: "Real Sociedad" },
    { number: 22, name: "Victor Munoz", position: "FWD", club: "Osasuna" }
  ],

  France: [
    // Goalkeepers
    { number: 1, name: "Brice Samba", position: "GK", club: "Rennes" },
    { number: 16, name: "Mike Maignan", position: "GK", club: "AC Milan" },
    { number: 23, name: "Robin Risser", position: "GK", club: "Lens" },

    // Defenders
    { number: 2, name: "Malo Gusto", position: "DEF", club: "Chelsea" },
    { number: 3, name: "Lucas Digne", position: "DEF", club: "Aston Villa" },
    { number: 4, name: "Dayot Upamecano", position: "DEF", club: "Bayern Munich" },
    { number: 5, name: "Jules Koundé", position: "DEF", club: "Barcelona" },
    { number: 15, name: "Ibrahima Konaté", position: "DEF", club: "Liverpool" },
    { number: 17, name: "William Saliba", position: "DEF", club: "Arsenal" },
    { number: 21, name: "Lucas Hernández", position: "DEF", club: "PSG" },
    { number: 22, name: "Theo Hernández", position: "DEF", club: "Al Hilal" },
    { number: 24, name: "Maxence Lacroix", position: "DEF", club: "Crystal Palace" },

    // Midfielders
    { number: 6, name: "Warren Zaïre-Emery", position: "MID", club: "PSG" },
    { number: 8, name: "Aurélien Tchouaméni", position: "MID", club: "Real Madrid" },
    { number: 13, name: "N'Golo Kanté", position: "MID", club: "Fenerbahçe" },
    { number: 14, name: "Adrien Rabiot", position: "MID", club: "AC Milan" },
    { number: 18, name: "Manu Koné", position: "MID", club: "Roma" },
    { number: 25, name: "Rayan Cherki", position: "MID", club: "Manchester City" },

    // Forwards
    { number: 7, name: "Ousmane Dembélé", position: "FWD", club: "PSG" },
    { number: 9, name: "Marcus Thuram", position: "FWD", club: "Inter Milan" },
    { number: 10, name: "Kylian Mbappé", position: "FWD", club: "Real Madrid" },
    { number: 11, name: "Michael Olise", position: "FWD", club: "Bayern Munich" },
    { number: 12, name: "Maghnes Akliouche", position: "FWD", club: "Monaco" },
    { number: 19, name: "Jean-Philippe Mateta", position: "FWD", club: "Crystal Palace" },
    { number: 20, name: "Bradley Barcola", position: "FWD", club: "PSG" },
    { number: 26, name: "Désiré Doué", position: "FWD", club: "PSG" }
  ],

  Argentina: [
    // Goalkeepers
    { number: 1, name: "Emiliano Martínez", position: "GK", club: "Aston Villa" },
    { number: 12, name: "Geronimo Rulli", position: "GK", club: "Atlético Madrid" },
    { number: 23, name: "Franco Armani", position: "GK", club: "River Plate" },

    // Defenders
    { number: 2, name: "Nahuel Molina", position: "DEF", club: "Atlético Madrid" },
    { number: 3, name: "Nicolás Tagliafico", position: "DEF", club: "Lyon" },
    { number: 4, name: "Gonzalo Montiel", position: "DEF", club: "Nottingham Forest" },
    { number: 5, name: "Germán Pezzella", position: "DEF", club: "Real Betis" },
    { number: 6, name: "Nicolás Otamendi", position: "DEF", club: "Benfica" },
    { number: 13, name: "Cristian Romero", position: "DEF", club: "Tottenham Hotspur" },
    { number: 14, name: "Lisandro Martínez", position: "DEF", club: "Manchester United" },
    { number: 8, name: "Marcos Acuña", position: "DEF", club: "Sevilla" },

    // Midfielders
    { number: 7, name: "Rodrigo De Paul", position: "MID", club: "Atlético Madrid" },
    { number: 15, name: "Leandro Paredes", position: "MID", club: "Roma" },
    { number: 16, name: "Exequiel Palacios", position: "MID", club: "Bayer Leverkusen" },
    { number: 18, name: "Enzo Fernández", position: "MID", club: "Chelsea" },
    { number: 19, name: "Nicolás González", position: "MID", club: "Juventus" },
    { number: 20, name: "Giovani Lo Celso", position: "MID", club: "Villarreal" },
    { number: 21, name: "Alexis Mac Allister", position: "MID", club: "Liverpool" },

    // Forwards
    { number: 10, name: "Lionel Messi", position: "FWD", club: "Inter Miami CF" },
    { number: 9, name: "Lautaro Martínez", position: "FWD", club: "Inter Milan" },
    { number: 11, name: "Ángel Di María", position: "FWD", club: "Benfica" },
    { number: 22, name: "Julián Álvarez", position: "FWD", club: "Atlético Madrid" },
    { number: 17, name: "Alejandro Garnacho", position: "FWD", club: "Manchester United" },
  ],

  England: [
    // Goalkeepers
    { number: 1, name: "Jordan Pickford", position: "GK", club: "Everton" },
    { number: 13, name: "Dean Henderson", position: "GK", club: "Crystal Palace" },
    { number: 23, name: "James Trafford", position: "GK", club: "Manchester City" },

    // Defenders
    { number: 2, name: "Reece James", position: "DEF", club: "Chelsea" },
    { number: 3, name: "Dan Burn", position: "DEF", club: "Newcastle United" },
    { number: 5, name: "John Stones", position: "DEF", club: "Manchester City" },
    { number: 6, name: "Marc Guéhi", position: "DEF", club: "Manchester City" },
    { number: 12, name: "Tino Livramento", position: "DEF", club: "Newcastle United" },
    { number: 14, name: "Ezri Konsa", position: "DEF", club: "Aston Villa" },
    { number: 15, name: "Jarell Quansah", position: "DEF", club: "Bayer Leverkusen" },
    { number: 24, name: "Nico O'Reilly", position: "DEF", club: "Manchester City" },
    { number: 25, name: "Djed Spence", position: "DEF", club: "Tottenham Hotspur" },

    // Midfielders
    { number: 4, name: "Declan Rice", position: "MID", club: "Arsenal" },
    { number: 8, name: "Jude Bellingham", position: "MID", club: "Real Madrid" },
    { number: 10, name: "Eberechi Eze", position: "MID", club: "Arsenal" },
    { number: 16, name: "Kobbie Mainoo", position: "MID", club: "Manchester United" },
    { number: 18, name: "Elliot Anderson", position: "MID", club: "Nottingham Forest" },
    { number: 20, name: "Morgan Rogers", position: "MID", club: "Aston Villa" },
    { number: 26, name: "Jordan Henderson", position: "MID", club: "Brentford" },

    // Forwards
    { number: 7, name: "Bukayo Saka", position: "FWD", club: "Arsenal" },
    { number: 9, name: "Harry Kane", position: "FWD", club: "Bayern Munich" },
    { number: 11, name: "Anthony Gordon", position: "FWD", club: "Newcastle United" },
    { number: 17, name: "Marcus Rashford", position: "FWD", club: "Barcelona" },
    { number: 19, name: "Ollie Watkins", position: "FWD", club: "Aston Villa" },
    { number: 21, name: "Ivan Toney", position: "FWD", club: "Al-Ahli" },
    { number: 22, name: "Noni Madueke", position: "FWD", club: "Arsenal" }
  ],
  Germany: [
    // Goalkeepers
    { number: 1, name: "Oliver Baumann", position: "GK", club: "Hoffenheim" },
    { number: 12, name: "Manuel Neuer", position: "GK", club: "Bayern Munich" },
    { number: 22, name: "Alexander Nübel", position: "GK", club: "VfB Stuttgart" },

    // Defenders
    { number: 2, name: "Antonio Rüdiger", position: "DEF", club: "Real Madrid" },
    { number: 3, name: "Waldemar Anton", position: "DEF", club: "Borussia Dortmund" },
    { number: 4, name: "Jonathan Tah", position: "DEF", club: "Bayern Munich" },
    { number: 6, name: "Joshua Kimmich", position: "DEF", club: "Bayern Munich" },
    { number: 15, name: "Nico Schlotterbeck", position: "DEF", club: "Borussia Dortmund" },
    { number: 18, name: "Nathaniel Brown", position: "DEF", club: "Eintracht Frankfurt" },
    { number: 20, name: "David Raum", position: "DEF", club: "RB Leipzig" },
    { number: 24, name: "Malick Thiaw", position: "DEF", club: "Newcastle United" },

    // Midfielders
    { number: 5, name: "Aleksandar Pavlović", position: "MID", club: "Bayern Munich" },
    { number: 8, name: "Leon Goretzka", position: "MID", club: "Bayern Munich" },
    { number: 10, name: "Nadiem Amiri", position: "MID", club: "Mainz 05" },
    { number: 13, name: "Felix Nmecha", position: "MID", club: "Borussia Dortmund" },
    { number: 14, name: "Jamal Musiala", position: "MID", club: "Bayern Munich" },
    { number: 16, name: "Angelo Stiller", position: "MID", club: "VfB Stuttgart" },
    { number: 17, name: "Florian Wirtz", position: "MID", club: "Liverpool" },
    { number: 19, name: "Leroy Sané", position: "MID", club: "Galatasaray" },
    { number: 21, name: "Jamie Leweling", position: "MID", club: "VfB Stuttgart" },
    { number: 23, name: "Pascal Groß", position: "MID", club: "Borussia Dortmund" },
    { number: 25, name: "Lennart Karl", position: "MID", club: "Bayern Munich" },

    // Forwards
    { number: 7, name: "Kai Havertz", position: "FWD", club: "Arsenal" },
    { number: 9, name: "Maximilian Beier", position: "FWD", club: "Borussia Dortmund" },
    { number: 11, name: "Nick Woltemade", position: "FWD", club: "Newcastle United" },
    { number: 26, name: "Deniz Undav", position: "FWD", club: "VfB Stuttgart" }
  ],

  Portugal: [
    // Goalkeepers
    { number: 1, name: "Diogo Costa", position: "GK", club: "Porto" },
    { number: 12, name: "José Sá", position: "GK", club: "Wolves" },
    { number: 22, name: "Rui Silva", position: "GK", club: "Sporting CP" },
    { number: 24, name: "Ricardo Velho", position: "GK", club: "Gençlerbirliği" },

    // Defenders
    { number: 2, name: "Diogo Dalot", position: "DEF", club: "Manchester United" },
    { number: 3, name: "Renato Veiga", position: "DEF", club: "Villarreal" },
    { number: 4, name: "Rúben Dias", position: "DEF", club: "Manchester City" },
    { number: 5, name: "Gonçalo Inácio", position: "DEF", club: "Sporting CP" },
    { number: 13, name: "Tomás Araújo", position: "DEF", club: "Benfica" },
    { number: 14, name: "Nélson Semedo", position: "DEF", club: "Fenerbahçe" },
    { number: 19, name: "Nuno Mendes", position: "DEF", club: "PSG" },
    { number: 20, name: "João Cancelo", position: "DEF", club: "Barcelona" },
    { number: 25, name: "Matheus Nunes", position: "DEF", club: "Manchester City" },

    // Midfielders
    { number: 6, name: "Samú Costa", position: "MID", club: "Mallorca" },
    { number: 8, name: "Bruno Fernandes", position: "MID", club: "Manchester United" },
    { number: 10, name: "Bernardo Silva", position: "MID", club: "Manchester City" },
    { number: 15, name: "João Neves", position: "MID", club: "PSG" },
    { number: 16, name: "Vitinha", position: "MID", club: "PSG" },
    { number: 18, name: "Rúben Neves", position: "MID", club: "Al-Hilal" },

    // Forwards
    { number: 7, name: "Cristiano Ronaldo", position: "FWD", club: "Al-Nassr" },
    { number: 9, name: "Gonçalo Ramos", position: "FWD", club: "PSG" },
    { number: 11, name: "João Félix", position: "FWD", club: "Al-Nassr" },
    { number: 17, name: "Rafael Leão", position: "FWD", club: "AC Milan" },
    { number: 21, name: "Pedro Neto", position: "FWD", club: "Chelsea" },
    { number: 23, name: "Gonçalo Guedes", position: "FWD", club: "Real Sociedad" },
    { number: 26, name: "Francisco Conceição", position: "FWD", club: "Juventus" },
    { number: 27, name: "Francisco Trincão", position: "FWD", club: "Sporting CP" }
  ],

  Colombia: [
    // Goalkeepers
    { number: 1, name: "David Ospina", position: "GK", club: "Atlético Nacional" },
    { number: 12, name: "Camilo Vargas", position: "GK", club: "Atlas" },
    { number: 22, name: "Álvaro Montero", position: "GK", club: "Vélez Sarsfield" },

    // Defenders
    { number: 2, name: "Daniel Muñoz", position: "DEF", club: "Crystal Palace" },
    { number: 3, name: "Jhon Lucumí", position: "DEF", club: "Bologna" },
    { number: 4, name: "Santiago Arias", position: "DEF", club: "Independiente" },
    { number: 13, name: "Yerry Mina", position: "DEF", club: "Cagliari" },
    { number: 14, name: "Willer Ditta", position: "DEF", club: "Cruz Azul" },
    { number: 17, name: "Johan Mojica", position: "DEF", club: "Mallorca" },
    { number: 21, name: "Déiver Machado", position: "DEF", club: "Nantes" },
    { number: 23, name: "Davinson Sánchez", position: "DEF", club: "Galatasaray" },

    // Midfielders
    { number: 5, name: "Kevin Castaño", position: "MID", club: "River Plate" },
    { number: 6, name: "Richard Ríos", position: "MID", club: "Benfica" },
    { number: 8, name: "Gustavo Puerta", position: "MID", club: "Racing de Santander" },
    { number: 10, name: "James Rodríguez", position: "MID", club: "Minnesota United" },
    { number: 11, name: "Jhon Arias", position: "MID", club: "Palmeiras" },
    { number: 15, name: "Juan Camilo Portilla", position: "MID", club: "Athletico Paranaense" },
    { number: 16, name: "Jefferson Lerma", position: "MID", club: "Crystal Palace" },
    { number: 18, name: "Jorge Carrascal", position: "MID", club: "Flamengo" },
    { number: 20, name: "Juan Fernando Quintero", position: "MID", club: "River Plate" },

    // Forwards
    { number: 7, name: "Luis Díaz", position: "FWD", club: "Bayern Munich" },
    { number: 9, name: "Jhon Córdoba", position: "FWD", club: "Krasnodar" },
    { number: 19, name: "Juan Camilo Hernández", position: "FWD", club: "Real Betis" },
    { number: 24, name: "Luis Suárez", position: "FWD", club: "Sporting CP" },
    { number: 25, name: "Jaminton Campaz", position: "FWD", club: "Rosario Central" },
    { number: 26, name: "Carlos Gómez", position: "FWD", club: "Vasco da Gama" }
  ],

  Croatia: [
    // Goalkeepers
    { number: 1, name: "Dominik Livaković", position: "GK", club: "Fenerbahçe" },
    { number: 12, name: "Dominik Kotarski", position: "GK", club: "København" },
    { number: 23, name: "Ivor Pandur", position: "GK", club: "Hull City" },

    // Defenders
    { number: 2, name: "Josip Stanišić", position: "DEF", club: "Bayern Munich" },
    { number: 3, name: "Marin Pongračić", position: "DEF", club: "Fiorentina" },
    { number: 4, name: "Joško Gvardiol", position: "DEF", club: "Manchester City" },
    { number: 5, name: "Duje Ćaleta-Car", position: "DEF", club: "Real Sociedad" },
    { number: 6, name: "Josip Šutalo", position: "DEF", club: "Ajax" },
    { number: 22, name: "Martin Erlić", position: "DEF", club: "Midtjylland" },
    { number: 24, name: "Luka Vušković", position: "DEF", club: "Hamburger SV" },

    // Midfielders
    { number: 8, name: "Mateo Kovačić", position: "MID", club: "Manchester City" },
    { number: 10, name: "Luka Modrić", position: "MID", club: "AC Milan" },
    { number: 13, name: "Nikola Vlašić", position: "MID", club: "Torino" },
    { number: 15, name: "Mario Pašalić", position: "MID", club: "Atalanta" },
    { number: 16, name: "Martin Baturina", position: "MID", club: "Como 1907" },
    { number: 17, name: "Petar Sučić", position: "MID", club: "Inter Milan" },
    { number: 18, name: "Kristijan Jakić", position: "MID", club: "Augsburg" },
    { number: 19, name: "Toni Fruk", position: "MID", club: "Rijeka" },
    { number: 21, name: "Luka Sučić", position: "MID", club: "Real Sociedad" },
    { number: 25, name: "Nikola Moro", position: "MID", club: "Bologna" },

    // Forwards
    { number: 7, name: "Petar Musa", position: "FWD", club: "FC Dallas" },
    { number: 9, name: "Andrej Kramarić", position: "FWD", club: "Hoffenheim" },
    { number: 11, name: "Ante Budimir", position: "FWD", club: "Osasuna" },
    { number: 14, name: "Ivan Perišić", position: "FWD", club: "PSV" },
    { number: 20, name: "Marco Pašalić", position: "FWD", club: "Orlando City SC" },
    { number: 26, name: "Igor Matanović", position: "FWD", club: "SC Freiburg" }
  ],

  USA: [
    // Goalkeepers
    { number: 1, name: "Matt Turner", position: "GK", club: "New England Revolution" },
    { number: 18, name: "Chris Brady", position: "GK", club: "Chicago Fire" },
    { number: 25, name: "Matt Freese", position: "GK", club: "New York City FC" },

    // Defenders
    { number: 2, name: "Sergiño Dest", position: "DEF", club: "PSV" },
    { number: 3, name: "Chris Richards", position: "DEF", club: "Crystal Palace" },
    { number: 4, name: "Miles Robinson", position: "DEF", club: "FC Cincinnati" },
    { number: 5, name: "Antonee Robinson", position: "DEF", club: "Fulham" },
    { number: 12, name: "Max Arfsten", position: "DEF", club: "Columbus Crew" },
    { number: 13, name: "Tim Ream", position: "DEF", club: "Charlotte FC" },
    { number: 14, name: "Alex Freeman", position: "DEF", club: "Villarreal" },
    { number: 22, name: "Joe Scally", position: "DEF", club: "Borussia Mönchengladbach" },
    { number: 24, name: "Mark McKenzie", position: "DEF", club: "Toulouse" },

    // Midfielders
    { number: 6, name: "Tyler Adams", position: "MID", club: "AFC Bournemouth" },
    { number: 8, name: "Weston McKennie", position: "MID", club: "Juventus" },
    { number: 15, name: "Sebastian Berhalter", position: "MID", club: "Vancouver Whitecaps" },
    { number: 16, name: "Cristian Roldan", position: "MID", club: "Seattle Sounders" },

    // Forwards
    { number: 7, name: "Gio Reyna", position: "FWD", club: "Borussia Mönchengladbach" },
    { number: 9, name: "Ricardo Pepi", position: "FWD", club: "PSV" },
    { number: 10, name: "Christian Pulisic", position: "FWD", club: "AC Milan" },
    { number: 11, name: "Brenden Aaronson", position: "FWD", club: "Leeds United" },
    { number: 17, name: "Malik Tillman", position: "FWD", club: "Bayer Leverkusen" },
    { number: 19, name: "Haji Wright", position: "FWD", club: "Coventry City" },
    { number: 20, name: "Folarin Balogun", position: "FWD", club: "AS Monaco" },
    { number: 21, name: "Tim Weah", position: "FWD", club: "Marseille" },
    { number: 23, name: "Alejandro Zendejas", position: "FWD", club: "Club América" }
  ]

}

export default squads
