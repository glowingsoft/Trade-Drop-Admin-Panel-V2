export const CATEGORIES = [
    {
        category: "Photography",
        activeDrops: 214,
        share: "31%"
    },
    {
        category: "Music",
        activeDrops: 214,
        share: "31%"
    },
    {
        category: "Art",
        activeDrops: 214,
        share: "31%"
    },
    {
        category: "Video",
        activeDrops: 214,
        share: "31%"
    },
    {
        category: "Design",
        activeDrops: 214,
        share: "31%"
    },
    {
        category: "Writing",
        activeDrops: 214,
        share: "31%"
    }
]

export const AREAS = [
    {
        area: "Brooklyn, NY",
        activeUsers: 3820,
        share: "31%"
    },
    {
        area: "New York, NY",
        activeUsers: 3820,
        share: "31%"
    },
    {
        area: "Manhattan, NY",
        activeUsers: 3820,
        share: "31%"
    },
    {
        area: "Queens, NY",
        activeUsers: 3820,
        share: "31%"
    },
    {
        area: "Staten Island, NY",
        activeUsers: 3820,
        share: "31%"
    },
    {
        area: "Bronx, NY",
        activeUsers: 3820,
        share: "31%"
    }
]

export const TRADES_REPORT = {
    stats: {
        tapsIn: 1892,
        tradesStarted: 946,
        completed: 612,
        completionRate: 64.7,
    },
    periods: {
        today: {
            categories: ['12am', '4am', '8am', '12pm', '4pm', '8pm'],
            completed: [4, 8, 15, 22, 30, 38],
            newDrops: [2, 5, 9, 14, 18, 21],
        },
        monthly: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            completed: [320, 360, 410, 440, 480, 520, 540, 580, 612],
            newDrops: [180, 200, 230, 250, 270, 300, 320, 340, 360],
        },
        annual: {
            categories: ['2021', '2022', '2023', '2024', '2025', '2026'],
            completed: [1200, 2100, 3400, 4600, 5400, 6120],
            newDrops: [800, 1400, 2100, 2600, 3100, 3600],
        },
    },
}

export const TRADE_ACTIVITY = {
    total: 946,
    mostTraded: 'Hair ↔ Photography',
    series: [
        { label: 'Completed', value: 549 },
        { label: 'In progress', value: 208 },
        { label: 'Declined', value: 66 },
        { label: 'Awaiting confirm', value: 123 },
    ],
}

export const LAST_ACTIVITIES = [
    {
        title: "New signup",
        description: "Ingrid Solheim joined from Denver, CO · 2 min ago"
    },
    {
        title: "Trade completed",
        description: "Jordan Reyes ↔ Priyanka Rao closed a trade · 1 hr ago"
    },
    {
        title: "New signup",
        description: "Ingrid Solheim joined from Denver, CO · 2 hr ago"
    },
    {
        title: "New drop",
        description: "The New York Times joined from Denver, CO · 3 hr ago"
    },
    {
        title: "Trade completed",
        description: "Amara Diallo ↔ Wes Novak closed a trade · 5 hr ago"
    },
    {
        title: "New drop",
        description: "The New York Times joined from Denver, CO · 6 hr ago"
    },
    {
        title: "New drop",
        description: "The New York Times joined from Denver, CO · 7 hr ago"
    }
]