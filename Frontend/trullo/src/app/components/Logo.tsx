import Image from "next/image";
import logo from "../images/TrulloLogo.svg"

export default function Logo() {

    return(
        <Image
            src={logo}
            alt="Logo"
            width={100}
            height={100}
            //layout="fixed"
        />
    )
}