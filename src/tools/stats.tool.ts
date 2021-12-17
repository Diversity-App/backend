import { StatItem, StatSummary } from '../types';

export default class StatsTool {
    static summarize(stats: StatItem[]): StatSummary {
        const total = stats.length;

        const categories = stats.reduce((acc: { [key: string]: number }, curr) => {
            const { categories } = curr;
            categories.forEach((category) => {
                if (!acc[category as string]) {
                    acc[category] = 0;
                }
                acc[category] += 1;
            });
            return acc;
        }, {});
        const categoriesArray = Object.keys(categories)
            .map((key) => ({
                name: key,
                count: categories[key],
            }))
            .sort((a, b) => b.count - a.count);

        const tags = stats.reduce((acc: { [key: string]: number }, curr) => {
            const { tags } = curr;
            tags.forEach((tag) => {
                if (!acc[tag]) {
                    acc[tag] = 0;
                }
                acc[tag] += 1;
            });
            return acc;
        }, {});
        const tagsArray = Object.keys(tags)
            .map((key) => ({
                name: key,
                count: tags[key],
            }))
            .sort((a, b) => b.count - a.count);

        return {
            categories: Object.keys(categories),
            tags: Object.keys(tags),
            categoriesRatio: categoriesArray,
            items: stats,
            tagsRatio: tagsArray,
            total,
        };
    }

    static aggregate(stats: StatSummary[]): StatSummary {
        return {
            total: stats.reduce((agg, stats) => agg + stats.total, 0),
            categories: stats.reduce((agg, stats) => agg.concat(stats.categories), []),
            categoriesRatio: stats.reduce((agg, stats) => {
                const { categoriesRatio } = stats;
                categoriesRatio.forEach((category) => {
                    const index = agg.findIndex((item) => item.name === category.name);
                    if (index === -1) {
                        agg.push(category);
                    } else {
                        agg[index].count += category.count;
                    }
                });
                return agg;
            }, []),
            items: stats.reduce((agg, stats) => agg.concat(stats.items), []),
            tags: stats.reduce((agg, stats) => agg.concat(stats.tags), []),
            tagsRatio: stats.reduce((agg, stats) => {
                const { tagsRatio } = stats;
                tagsRatio.forEach((tag) => {
                    const index = agg.findIndex((item) => item.name === tag.name);
                    if (index === -1) {
                        agg.push(tag);
                    } else {
                        agg[index].count += tag.count;
                    }
                });
                return agg;
            }, []),
        };
    }
}
