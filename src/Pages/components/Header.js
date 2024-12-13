const Header = () => {
    return (
        <header className="flex justify-between items-center border-b border-black p-3 box-border">
            <h1 className="text-4xl">Galaxy</h1>
            <a href="#" className="text-2xl shadow px-6 py-2 rounded-2xl bg-green-600 text-white hover:bg-green-700 hover:scale-110 transition-all duration-150">Join</a>
        </header>
    )
}

export default Header;