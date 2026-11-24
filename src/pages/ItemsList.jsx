import { useEffect } from "react";
import ItemCard from "../components/ItemCard";
import { useItemStore } from "../store/useItemStore";
import { api } from "../api/api";
import { useState } from "react";

const ItemsList = () => {
    const { items, getItems } = useItemStore();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        getItems();

        api.getStats().then((data) => {
            setStats(data);
        });
    }, [getItems]);

    return (
        <div className="container">
            <div className="page-header">
                <h1>Все товары</h1>
            </div>
            <div className="stats">
                <div className="stat-item">
                    <span className="stat-value">
                        {stats ? stats.totalItems : 0}
                    </span>
                    <span className="stat-label">Товаров</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">
                        {stats ? stats.totalBids : 0}
                    </span>
                    <span className="stat-label">Ставок</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">
                        {stats ? stats.activeItems : 0}
                    </span>
                    <span className="stat-label">Активных</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">
                        {stats ? stats.averageItemPrice : 0}₽
                    </span>
                    <span className="stat-label">Средняя цена</span>
                </div>
            </div>

            <div className="items-grid">
                {items.length > 0 &&
                    items.map((item) => <ItemCard key={item.id} {...item} />)}
            </div>
        </div>
    );
};

export default ItemsList;
