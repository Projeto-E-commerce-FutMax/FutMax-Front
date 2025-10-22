// Products Data
const products = [
    {
        id: 1,
        name: "Camisa Brasil",
        team: "Seleção Brasileira",
        season: "Temporada 2024",
        price: 199.90,
        image: "https://images.unsplash.com/photo-1690841813659-813aa4daaba7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    },
    {
        id: 2,
        name: "Camisa Japão",
        team: "Seleção Japonesa",
        season: "Temporada 2023",
        price: 189.90,
        image: "https://images.unsplash.com/photo-1759447946445-397b1c034768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    },
    {
        id: 3,
        name: "Camisa Argentina",
        team: "Seleção Argentina",
        season: "Temporada 2023",
        price: 179.90,
        image: "https://images.unsplash.com/photo-1718337799103-f1080ce21ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    },
    {
        id: 4,
        name: "Camisa Alemanha",
        team: "Seleção Alemã",
        season: "Temporada 2023",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1759447946445-397b1c034768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    },
    {
        id: 5,
        name: "Camisa Itália",
        team: "Seleção Italiana",
        season: "Temporada 2024",
        price: 199.90,
        image: "https://images.unsplash.com/photo-1759447946445-397b1c034768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    },
    {
        id: 6,
        name: "Camisa Jamaica",
        team: "Seleção Jamaicana",
        season: "Temporada 2023",
        price: 189.90,
        image: "https://images.unsplash.com/photo-1690841813659-813aa4daaba7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    },
    {
        id: 7,
        name: "Camisa Espanha",
        team: "Seleção Espanhola",
        season: "Temporada 2025",
        price: 179.90,
        image: "https://images.unsplash.com/photo-1544366981-2150548c9c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    },
    {
        id: 8,
        name: "Camisa Portugal",
        team: "Seleção Portuguesa",
        season: "Temporada 2023",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1708941546136-d77e400c31ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    },
    {
        id: 9,
        name: "Camisa Manchester United",
        team: "Manchester United",
        season: "Temporada 2024",
        price: 199.00,
        image: "https://images.unsplash.com/photo-1544366981-2150548c9c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    },
    {
        id: 10,
        name: "Camisa Manchester City",
        team: "Manchester City",
        season: "Temporada 2023",
        price: 189.90,
        image: "https://images.unsplash.com/photo-1759447946445-397b1c034768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    },
    {
        id: 11,
        name: "Camisa Chelsea",
        team: "Chelsea FC",
        season: "Temporada 2023",
        price: 179.90,
        image: "https://images.unsplash.com/photo-1759447946445-397b1c034768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    },
    {
        id: 12,
        name: "Camisa Newcastle",
        team: "Newcastle United",
        season: "Temporada 2023",
        price: 239.90,
        image: "https://images.unsplash.com/photo-1718337799103-f1080ce21ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    }
];

// Rare Products
const rareProducts = [
    {
        id: 101,
        name: "Camisa Brasil Copa 1970",
        team: "Seleção Brasileira",
        season: "Copa do Mundo 1970",
        price: 1899.90,
        image: "https://images.unsplash.com/photo-1690841813659-813aa4daaba7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        year: 1970,
        condition: "Excelente - Com Etiqueta Original",
        rarity: "Extremamente Rara",
        hasOriginalTag: true,
        historicalEvent: "Tri-Campeonato Mundial - Pelé"
    },
    {
        id: 102,
        name: "Camisa Argentina Copa 1986",
        team: "Seleção Argentina",
        season: "Copa do Mundo 1986",
        price: 2299.90,
        image: "https://images.unsplash.com/photo-1718337799103-f1080ce21ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        year: 1986,
        condition: "Perfeita - Lacrada",
        rarity: "Extremamente Rara",
        hasOriginalTag: true,
        historicalEvent: "Maradona - Gol do Século"
    },
    {
        id: 103,
        name: "Camisa Alemanha Copa 1990",
        team: "Seleção Alemã",
        season: "Copa do Mundo 1990",
        price: 1599.90,
        image: "https://images.unsplash.com/photo-1759447946445-397b1c034768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        year: 1990,
        condition: "Excelente - Com Etiqueta",
        rarity: "Muito Rara",
        hasOriginalTag: true,
        historicalEvent: "Campeã Mundial na Itália"
    },
    {
        id: 104,
        name: "Camisa Brasil Copa 1982",
        team: "Seleção Brasileira",
        season: "Copa do Mundo 1982",
        price: 1749.90,
        image: "https://images.unsplash.com/photo-1690841813659-813aa4daaba7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        year: 1982,
        condition: "Ótima - Com Etiqueta Original",
        rarity: "Extremamente Rara",
        hasOriginalTag: true,
        historicalEvent: "Seleção de Zico e Sócrates"
    },
    {
        id: 105,
        name: "Camisa Itália Copa 1982",
        team: "Seleção Italiana",
        season: "Copa do Mundo 1982",
        price: 1499.90,
        image: "https://images.unsplash.com/photo-1759447946445-397b1c034768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        year: 1982,
        condition: "Muito Boa - Com Etiqueta",
        rarity: "Muito Rara",
        hasOriginalTag: true,
        historicalEvent: "Tri-Campeã Mundial"
    },
    {
        id: 106,
        name: "Camisa Holanda Copa 1988",
        team: "Seleção Holandesa",
        season: "Eurocopa 1988",
        price: 1399.90,
        image: "https://images.unsplash.com/photo-1544366981-2150548c9c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        year: 1988,
        condition: "Ótima - Etiqueta Original",
        rarity: "Rara",
        hasOriginalTag: true,
        historicalEvent: "Campeã da Eurocopa - Van Basten"
    }
];
