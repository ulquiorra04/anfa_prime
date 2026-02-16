import { useEffect, useState } from "react";
import Meal from "../components/meal/Meal";
import type { MealDto } from "../models/meal";

function MealPage () {

    const [meals, setMeals] = useState<MealDto[]>([]);
    const [patient, setPatient] = useState<string>("");

    useEffect(() => {
        const fetchMeals = async () => {
        try {
            const response = await fetch('data/meals.json');
            console.log(response);
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMeals(data);
        } catch (error) {
            console.error('Error fetching meals:', error);
        }
        };

        fetchMeals();
    }, []);

    useEffect(() => {
        setPatient(localStorage.getItem('patient') ?? "");
    }, []);


    return (
        <>
            <h1>{patient}</h1>
            {meals.map((meal) => (
                <Meal key={meal.id} name={meal.name} link={`/menu/${meal.id}`} onClick={() => { console.log(`Chosed meal : ${meal.name} with ID : ${meal.id}`); }} />
            ))}
        </>
    );
}

export default MealPage;