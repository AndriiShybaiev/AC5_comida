import { render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { describe, it, expect } from "vitest";

describe("AC5.4 - Comida rápida", () => {
    it("Muestra 4 productos en la pantalla inicial (nombre + algún stock)", () => {
        render(<App />);

        expect(screen.getByText("Menús")).toBeInTheDocument(); // pantalla inicial

        // 4 nombres
        expect(screen.getByText("Hamburguesa de Pollo")).toBeInTheDocument();
        expect(screen.getByText("Hamburguesa de Carne")).toBeInTheDocument();
        expect(screen.getByText("Helado")).toBeInTheDocument();
        expect(screen.getByText("Patatas fritas")).toBeInTheDocument();

        // algún stock
        expect(screen.getByText(/#\s*40/)).toBeInTheDocument();
    });

    it("En 'Pedir Comida' se muestran 4 productos, alguna imagen y alguno de los precios", async () => {
        const user = userEvent.setup();
        render(<App />);

        // Ir a pantalla de carta (Foods lazy)
        await user.click(screen.getByRole("button", { name: "Pedir Comida" }));

        // Esperar a que cargue "Carta"
        expect(await screen.findByText("Carta")).toBeInTheDocument();

        // 4 productos (1 botón "Pedir" por producto)
        const pedirButtons = screen.getAllByRole("button", { name: "Pedir" });
        expect(pedirButtons).toHaveLength(4);

        // Algún precio (por ejemplo 24$)
        expect(screen.getByText("24$")).toBeInTheDocument();

        // Alguna imagen
        const imgs = document.querySelectorAll("img");
        expect(imgs.length).toBe(4);
        expect(imgs[0]).toHaveAttribute("src");
    });

    it("En la compra se actualiza correctamente el precio para una cantidad introducida", async () => {
        const user = userEvent.setup();
        render(<App />);

        // Abrir carta
        await user.click(screen.getByRole("button", { name: "Pedir Comida" }));
        expect(await screen.findByText("Carta")).toBeInTheDocument();

        // Pedimos el primer producto -> abre FoodOrder
        const pedirButtons = screen.getAllByRole("button", { name: "Pedir" });
        await user.click(pedirButtons[0]);

        const foodOrderEl = document.querySelector(".foodOrder") as HTMLElement;
        expect(foodOrderEl).toBeTruthy();

        const order = within(foodOrderEl);
        expect(order.getByText("Pedido")).toBeInTheDocument();

        const getPriceNumber = () => {
            const priceP = order.getByText((_, el) => {
                if (!el) return false;
                return el.tagName.toLowerCase() === "p" && (el.textContent ?? "").includes("Precio:");
            });
            const text = priceP.textContent ?? "";
            return Number(text.replace(/[^\d]/g, ""));
        };

        const baseTotal = getPriceNumber();
        expect(Number.isFinite(baseTotal)).toBe(true);

        const qtyInput = order.getByRole("spinbutton"); // input type=number
        fireEvent.change(qtyInput, { target: { value: "3" } }); // onChange -> setTotalAmount(price * q)

        await waitFor(() => {
            const updatedTotal = getPriceNumber();
            expect(updatedTotal).toBe(baseTotal * 3);
        });
    });
});
