import Link from "next/link";
import {ConnectButton} from "@rainbow-me/rainbowkit";

const Header = () => {
    /* State & Context */
    return (
        <>
            <header className="bg-white px-4 py-6">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-2xl clay-primary font-serif font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}><Link href="/">RoomLab</Link></h1>
                    <nav>
                        <ul className="flex items-center space-x-4">
                            <li style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                <Link  href="/my-nfts">My NFTs</Link>
                            </li>
                            <li><ConnectButton /></li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}

export default Header