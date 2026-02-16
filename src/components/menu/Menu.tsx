import './Menu.scss';

function Menu (props: { name: string, onClick?: () => void }) {
    return (
        <>
            <div className='menu' onClick={props.onClick}>
                {props.name}
            </div>
        </>
    );
}

export default Menu;