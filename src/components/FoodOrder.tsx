import { useState, type MouseEventHandler, type ChangeEvent } from "react";
import type { MenuItem } from "../entities/entities";

interface FoodOrderProps {
    food: MenuItem;
    onQuantityUpdated: (id: number, quantity: number) => void;
    onReturnToMenu: MouseEventHandler<HTMLButtonElement> | undefined;
}

function FoodOrder(props: FoodOrderProps) {
    const [quantity, setQuantity] = useState(1);
    const [totalAmount, setTotalAmount] = useState(props.food.price);
    const [isOrdered, setIsOrdered] = useState(false);

    const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const q = Number(e.target.value);
        const safeQ = Number.isFinite(q) && q > 0 ? q : 1;
        setQuantity(safeQ);
        setTotalAmount(props.food.price * safeQ);
    };

    const handleSendOrder = () => {
        setIsOrdered(true);
        props.onQuantityUpdated(props.food.id, quantity);
    };

    return (
        <div className="foodOrder">
            <h4>Pedido</h4>
            <p>{props.food.name}</p>

            {!isOrdered ? (
                <>
                    <label>
                        Cantidad:
                        <input type="number" min={1} value={quantity} onChange={handleQuantityChange} />
                    </label>

                    <p>Precio: {totalAmount}$</p>

                    <button onClick={handleSendOrder}>Enviar pedido</button>
                    <button onClick={props.onReturnToMenu}>Volver al menú</button>
                </>
            ) : (
                <>
                    <p>Pedido confirmado.</p>
                    <button onClick={props.onReturnToMenu}>Volver al menú</button>
                </>
            )}
        </div>
    );
}

export default FoodOrder;
