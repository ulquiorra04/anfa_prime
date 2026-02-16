import { Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";

function Accueil() {

    const navigate = useNavigate();

    const onScan = (v: any) => {
        console.log(v);
        console.log(v[0].rawValue);

        localStorage.setItem('patient', v[0].rawValue);
        navigate('/meal');
    }

    return (
        <>
            <Scanner
                onScan={ onScan }
                onError={(err) => {
                    console.log(err);
                }}
            />
        </>
    );
}

export default Accueil;