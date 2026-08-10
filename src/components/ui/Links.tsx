import { Link } from "react-router-dom"
type LinksProps = {
    way:string,
    text:string,
}
export default function Links({ way, text }:LinksProps) {
    return(
        <li><Link to={way} className="hover:text-primary hover:underline">{text}</Link></li>
    )
}