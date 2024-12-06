import { useState, useEffect } from "react";
import Bank from './Bank.js';
import Shop from './Shop.js';
const Main = () => {
    const [currentSection, setCurrentSection] = useState("bank");

    useEffect(() => {
        document.title = `${currentSection}`;
    }, [currentSection]);

    return (
        <>
            <section className="flex justify-evenly text-xl p-2 border-b-4">
                <button
                    onClick={() => setCurrentSection("bank")}
                    className={`p-2 ${
                        currentSection === "bank" ? "border-b border-black transition-all duration-300 ease" : ""
                    }`}
                >
                    Bank
                </button>
                <button
                    onClick={() => setCurrentSection("shop")}
                    className={`p-2 ${
                        currentSection === "shop" ? "border-b border-black transition-all duration-300 ease" : ""
                    }`}
                >
                    Shop
                </button>
            </section>
            <>
                {currentSection === "bank" && <Bank />}
                {currentSection === "shop" && <Shop />}
            </>
        </>
    );
};

export default Main;
