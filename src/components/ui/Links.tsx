type LinksProps = {
  way: string
  text: string
}
export default function Links({ way, text }: LinksProps) {
  return (
    <li>
      <a href={way} className="hover:text-primary hover:underline">
        {text}
      </a>
    </li>
  )
}
