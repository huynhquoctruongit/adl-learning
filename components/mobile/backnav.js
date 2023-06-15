import Link from "next/link"
import { LeftIcon } from "../icons"

const BackComponent = ({ children, className, redirect }) => {
    return (
        <Link href={redirect || "/account"} passHref>
            <div className={"flex items-center h-[64px] px-3 py-[18px] z-100 w-screen bg-white " + className}>
                <div className="w-7">
                    <LeftIcon className="w-7" />
                </div>
                <div className="text-body-2-highlight ml-2.5">{children}</div>
            </div>
        </Link>
    )
}
export default BackComponent