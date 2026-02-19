interface CardHrProps {
    barColor: string;
}

function CardHr(
    props: CardHrProps
) {
    return (
        <>
            <div className={`h-0.5 w-full bg-gradient-to-r ${props.barColor}`} />
        </>
    );
}

export default CardHr;