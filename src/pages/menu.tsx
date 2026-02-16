import { useEffect, useState } from "react";
import type { MenuDto } from "../models/menu";
import Menu from "../components/menu/Menu";

function MenuPage() {

    const [menuItems, setMenuItems] = useState<MenuDto[]>([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch('../data/menus.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMenuItems(data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []);

    return (
        <>
            {menuItems.map(item => (
                <Menu key={item.id} name={item.name} />
            ))}
        </>
    );
}

export default MenuPage;