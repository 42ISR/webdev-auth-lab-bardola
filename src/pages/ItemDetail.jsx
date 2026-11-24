import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { api } from "../api/api";
import { useState } from "react";
import { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";

const ItemDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bids, setBids] = useState([]);
    const session = useUserStore((dfdfsdfs) => dfdfsdfs.session);
    const navigate = useNavigate()

    const loadBids = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await api
                .getItemBids(id)
                .then(setBids)
                .catch(setError)
                .finally(() => setIsLoading(false));
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        api.getItem(id)
            .then(setItem)
            .catch(setError)
            .finally(() => setIsLoading(false));

        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadBids();
    }, []);

    const handleBid = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const form = e.target;
        const amount = Number(form.bidInput.value);

        try {
            await api.createBid({ id, amount });
            form.reset();
            api.getItem(id)
                .then(setItem)
                .catch(setError)
                .finally(() => setIsLoading(false));
            loadBids();
        } catch (err) {
            setError(err);
        }
    };

    function deleteItem() {

        if (item.bidCount > 0) {
            setError("Удаление не возможно, есть ставки")
            return
        }
        try {
            api.deleteItems(id)
            navigate("/")
        } catch (e) {
            setError(e)
        }

    }

    if (isLoading) return <div className="container">Загрузка...</div>;

    return (
        <div className="container">
            <Link to={"/"}>← Вернуться к списку товаров</Link>
            {session?.user?.id == item?.userId && (
                <Button onClick={() => deleteItem()} >Удалить товарчик</Button>
            )}

            {error && (
                <div className="alert alert-error active">{error}</div>
            )}

            <div className="item-detail">
                <div className="item-header">
                    <div>
                        {item.imageUrl && (
                            <img
                                src={item.imageUrl}
                                className="item-image-large"
                            />
                        )}
                    </div>

                    <div className="item-info">
                        <span className="item-status">Активное</span>

                        <h1 className="item-title-large">{item.title}</h1>

                        <div className="item-seller-info">
                            <div className="seller-avatar">
                                {item.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="seller-details">
                                <div className="seller-name">
                                    {item.username}
                                </div>
                                <div className="seller-date">
                                    {new Date(item.createdAt).toLocaleString(
                                        "ru-RU",
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="item-description-full">
                            {item.description}
                        </div>

                        <div className="price-section">
                            <div className="starting-price">
                                Начальная цена:
                            </div>
                            <div className="current-price">
                                {item.price} Рррр.
                            </div>
                            <div className="highest-bid">
                                Текущая ставка: {item.highestBid}
                            </div>

                            <form className="bid-form" onSubmit={handleBid}>
                                <Input
                                    type="number"
                                    name="bidInput"
                                    className="bid-input"
                                    placeholder="Введите вашу ставку (мин. стоимость + 1 рубль ₽)"
                                    min={item.highestBid ?? item.price}
                                    step="100"
                                />
                                <Button type="submit" className="btn-bid">
                                    Сделать ставку
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="bids-section">
                    <div className="bids-header">
                        <h2 className="bids-title">История ставок</h2>
                        <span className="bids-count">{item.bidCount}</span>
                    </div>

                    {bids.length < 0 ? (
                        <div className="container">Ставок нет</div>
                    ) : (
                        <div className="bids-list">
                            {bids.map((item, index) => (
                                <div
                                    key={index}
                                    className={`bid-item ${index == 0 && "highest-bid-item"}`}
                                >
                                    <div className="bid-user">
                                        <div className="bid-avatar">
                                            {item.username
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </div>
                                        <div className="bid-details">
                                            <span className="bid-username">
                                                {item.username}
                                            </span>
                                            <span className="bid-time">{}</span>
                                        </div>
                                        {index == 0 && (
                                            <span className="highest-badge">
                                                🏆 Лидирует
                                            </span>
                                        )}
                                    </div>
                                    <div className="bid-amount">
                                        {item.amount} ₽
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;
