import { Link } from 'react-router-dom';
import './Meal.scss';

function Meal (props: { name: string, link: string, onClick?: () => void }) {
    return (
        <>
            <div className='meal' onClick={props.onClick}>
                <Link to={props.link}>{props.name}</Link>
            </div>
        </>
    );
}

export default Meal;