import { useEffect, useState } from "react";
import type { OrderDto } from "../models/order";
import type { sejourDto } from "../models/sejour";

function OrderPage () {

    const [orders, setOrders] =  useState<OrderDto[]>([]);
    const [sejour, setSejour] = useState<sejourDto | null>(null);

    useEffect(
        () => {
            const fetchSejour = async () => {
                try {
                    const response = await fetch('data/sejour.json');
                    console.log(response);

                    response.json().then((sj) => {
                        // Set Sejour
                        setSejour(sj);
                        // Set Orders
                        if(sj) {
                            console.log(sj.orders);
                            setOrders(sj.orders);
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            }

            fetchSejour();
        }, []
    );

    return (
        <>
            <h1>{sejour?.name}</h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th> Repas </th>
                        <th> Menu </th>
                        <th> Status </th>
                    </tr>
                </thead>
                <tbody>
                {
                    orders.map(
                        (order) => (
                            <tr key={order.id}>
                                <td> { order.id } </td>
                                <td> { order.meal.name } </td>
                                <td> { order.menu.name } </td>
                                <td> { order.status } </td>
                            </tr>
                        )
                    )
                }
                </tbody>
            </table>
        </>
    );
}

export default OrderPage;