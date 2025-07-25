import { User } from "lucide-react";

const Header = () => {
    return (
    <>
        <nav className="w-full h-10 my-3 flex items-center justify-between">
            <div className="mx-4">
                <h1 className="font-bold text-2xl">Event Saya</h1>
            </div>
            <div className="mx-4">
                <div className="flex items-center gap-2 bg-neutral-300 p-2 rounded-full">
                    <div className="bg-blue-800 rounded-full p-1">
                    <User/>
                    </div>
                    <p className="text-sm tracking-widest">youremail@mail.com</p>
                </div>
            </div>
        </nav>
    </>
    )
}

export default Header;